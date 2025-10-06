import type { Actions, PageServerLoad } from './$types';
import { CONTACT_SERVICE_OPTIONS } from '$lib/config/contact';
import { sendContactEmail } from '$lib/server/email';
import type { ContactRequest, ContactRequestInput } from '$lib/types/contact-request';
import { fail, json } from '@sveltejs/kit';

const CONTACT_COLLECTION = new Map<string, ContactRequest>();
const CONTACT_EVENTS: string[] = [];

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
  return {
    name: (formData.get('name') ?? '').toString().trim(),
    email: (formData.get('email') ?? '').toString().trim().toLowerCase(),
    phone: (formData.get('phone') ?? '').toString().trim() || undefined,
    weddingDate: (formData.get('weddingDate') ?? '').toString().trim() || undefined,
    destination: (formData.get('destination') ?? '').toString().trim() || undefined,
    guestCount: parseNumber(formData.get('guestCount')),
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

export const load = (async () => {
  return {
    serviceOptions: CONTACT_SERVICE_OPTIONS,
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

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const contactRequest: ContactRequest = {
      id,
      createdAt: now,
      name: input.name,
      email: input.email,
      phone: input.phone,
      weddingDate: input.weddingDate,
      destination: input.destination,
      guestCount: input.guestCount,
      services: input.services ?? [],
      message: input.message,
      subscribe: input.subscribe ?? false,
      stage: 'new',
      source: 'website-kontakt',
      tags: [url.searchParams.get('utm_source') ?? 'website'],
      metadata: {
        ipAddress: request.headers.get('x-forwarded-for') ?? undefined,
        userAgent: request.headers.get('user-agent') ?? undefined,
        referrer: request.headers.get('referer') ?? undefined,
        utmSource: url.searchParams.get('utm_source') ?? undefined,
        utmMedium: url.searchParams.get('utm_medium') ?? undefined,
        utmCampaign: url.searchParams.get('utm_campaign') ?? undefined,
      },
    };

    const emailText = `Ny kontaktforespørsel:\n\nNavn: ${contactRequest.name}\nE-post: ${contactRequest.email}\nTelefon: ${contactRequest.phone ?? 'Ikke oppgitt'}\nDestinasjon: ${contactRequest.destination ?? 'Ikke oppgitt'}\nTjenester: ${contactRequest.services.join(', ') || 'Ingen valgt'}\nMelding:\n${contactRequest.message ?? ''}`;

    await sendContactEmail({
      subject: 'Ny kontaktforespørsel fra nettsiden',
      to: 'post@bryllupspakken.no',
      from: 'no-reply@bryllupspakken.no',
      replyTo: contactRequest.email,
      text: emailText,
    });

    return json({ success: true });
  },
} satisfies Actions;
