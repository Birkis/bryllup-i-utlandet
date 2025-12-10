import type { Actions, PageServerLoad } from './$types';
import { CONTACT_SERVICE_OPTIONS } from '$lib/config/contact';
import { sendContactEmail } from '$lib/server/email';
import { sendToN8n } from '$lib/server/n8n';
import type { ContactRequestInput } from '$lib/types/contact-request';
import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/server/supabase';
import { sanityClient } from '$lib/server/sanity';
import { citiesQuery } from '$lib/sanity/queries';
import type { Country, City } from '$lib/types/destination';

const parseServices = (value: FormDataEntryValue | FormDataEntryValue[] | null): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap((v) => parseServices(v)).filter(Boolean);
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === 'string');
      }
    } catch (error) {
      console.warn('Failed to parse services JSON', error);
    }
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const parseBoolean = (value: FormDataEntryValue | null): boolean => {
  if (typeof value === 'string') {
    return value === 'on' || value === 'true' || value === '1';
  }
  return false;
};

const parseNumber = (value: FormDataEntryValue | null): number | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const buildInput = (formData: FormData): ContactRequestInput => {
  const services = parseServices(formData.getAll('services'));
  const country = (formData.get('country') ?? '').toString().trim() || undefined;
  const city = (formData.get('city') ?? '').toString().trim() || undefined;
  
  // Combine country and city into destination string for storage
  let destination: string | undefined;
  if (country && city) {
    destination = `${country} - ${city}`;
  } else if (country) {
    destination = country;
  } else if (city) {
    destination = city;
  }

  return {
    name: (formData.get('name') ?? '').toString().trim(),
    email: (formData.get('email') ?? '').toString().trim().toLowerCase(),
    phone: (formData.get('phone') ?? '').toString().trim() || undefined,
    weddingDate: (formData.get('weddingDate') ?? '').toString().trim() || undefined,
    destination,
    guestCount: parseNumber(formData.get('guestCount')),
    budgetMin: parseNumber(formData.get('budgetMin')),
    budgetMax: parseNumber(formData.get('budgetMax')),
    services: services.filter((service): service is (typeof CONTACT_SERVICE_OPTIONS)[number] => CONTACT_SERVICE_OPTIONS.includes(service as (typeof CONTACT_SERVICE_OPTIONS)[number])),
    message: (formData.get('message') ?? '').toString().trim() || undefined,
    subscribe: parseBoolean(formData.get('subscribe')),
  };
};

const validate = (input: ContactRequestInput) => {
  const errors: Record<string, string> = {};

  if (!input.name) {
    errors.name = 'Vennligst oppgi navnet ditt';
  }

  if (!input.email) {
    errors.email = 'Vennligst oppgi en gyldig e-postadresse';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = 'E-postadressen ser ikke gyldig ut';
  }

  if (input.guestCount && input.guestCount < 0) {
    errors.guestCount = 'Antall gjester kan ikke være negativt';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export const load = (async ({ url }) => {
  // Fetch cities from Sanity (includes embedded country data)
  const cities = await sanityClient.fetch<City[]>(citiesQuery);

  // Extract unique countries from cities (more reliable than separate countries query)
  const countriesMap = new Map<string, Country>();
  for (const city of cities) {
    if (city.country?.name && !countriesMap.has(city.country.name)) {
      countriesMap.set(city.country.name, {
        id: city.country.id ?? city.countryId ?? '',
        name: city.country.name,
        slug: city.country.slug ?? '',
      });
    }
  }
  const countries = Array.from(countriesMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  // Get prefilled country from URL params
  const prefilledCountry = url.searchParams.get('country') ?? '';
  const prefilledCity = url.searchParams.get('city') ?? '';

  return {
    serviceOptions: CONTACT_SERVICE_OPTIONS,
    countries,
    cities,
    prefilledCountry,
    prefilledCity,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, url }) => {
    const formData = await request.formData();
    const input = buildInput(formData);
    const { isValid, errors } = validate(input);

    if (!isValid) {
      return fail(400, {
        success: false,
        errors,
        values: input,
      });
    }

    // Build metadata for tracking and automation
    const metadata = {
      ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
      userAgent: request.headers.get('user-agent') ?? undefined,
      referrer: request.headers.get('referer') ?? undefined,
      utmSource: url.searchParams.get('utm_source') ?? undefined,
      utmMedium: url.searchParams.get('utm_medium') ?? undefined,
      utmCampaign: url.searchParams.get('utm_campaign') ?? undefined,
    };

    // Insert contact request into Supabase
    const { data: contactRequest, error: insertError } = await supabase
      .from('contact_requests')
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone,
        wedding_date: input.weddingDate,
        destination: input.destination,
        guest_count: input.guestCount,
        budget_min: input.budgetMin,
        budget_max: input.budgetMax,
        services: input.services ?? [],
        message: input.message,
        subscribe: input.subscribe ?? false,
        stage: 'new',
        source: 'website-kontakt',
        tags: [url.searchParams.get('utm_source') ?? 'website'],
        metadata,
      })
      .select()
      .single();

    if (insertError || !contactRequest) {
      console.error('Failed to insert contact request:', insertError);
      return fail(500, {
        success: false,
        errors: { _form: 'Det oppstod en feil ved lagring av forespørselen. Vennligst prøv igjen.' },
        values: input,
      });
    }

    // Create an event for automation tracking
    const { error: eventError } = await supabase
      .from('contact_request_events')
      .insert({
        contact_request_id: contactRequest.id,
        event_type: 'contact.request.created',
        payload: {
          name: contactRequest.name,
          email: contactRequest.email,
          services: contactRequest.services,
          source: contactRequest.source,
        },
      });

    if (eventError) {
      console.error('Failed to create event:', eventError);
    }

    // Format budget range for email
    const formatBudgetRange = (min: number | null | undefined, max: number | null | undefined): string => {
      const formatValue = (val: number) => new Intl.NumberFormat('nb-NO', { style: 'decimal', maximumFractionDigits: 0 }).format(val) + ' NOK';
      if (!min && !max) return 'Ikke oppgitt';
      if (min && max) return `${formatValue(min)} – ${formatValue(max)}`;
      if (min) return `Fra ${formatValue(min)}`;
      if (max) return `Opp til ${formatValue(max)}`;
      return 'Ikke oppgitt';
    };

    // Send notification email
    const emailText = `Ny kontaktforespørsel:\n\nNavn: ${contactRequest.name}\nE-post: ${contactRequest.email}\nTelefon: ${contactRequest.phone ?? 'Ikke oppgitt'}\nDestinasjon: ${contactRequest.destination ?? 'Ikke oppgitt'}\nBudsjett: ${formatBudgetRange(contactRequest.budget_min, contactRequest.budget_max)}\nTjenester: ${contactRequest.services?.join(', ') || 'Ingen valgt'}\nMelding:\n${contactRequest.message ?? ''}`;

    await sendContactEmail({
      subject: 'Ny kontaktforespørsel fra nettsiden',
      to: 'post@bryllupspakken.no',
      from: 'no-reply@bryllupspakken.no',
      replyTo: contactRequest.email,
      text: emailText,
    });

    // Send to n8n webhook for automation (fire-and-forget)
    sendToN8n(contactRequest);

    return { success: true };
  },
} satisfies Actions;
