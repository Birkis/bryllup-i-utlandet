import type { PageServerLoad } from './$types';
import { cityBySlugQuery } from '$lib/sanity/queries';
import { sanityClient } from '$lib/server/sanity';
import type { City } from '$lib/types/destination';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
  const city = await sanityClient.fetch<City | null>(cityBySlugQuery, {
    slug: params.city,
  });

  if (!city) {
    error(404, {
      message: 'Byen ble ikke funnet',
    });
  }

  return {
    city,
  };
}) satisfies PageServerLoad;

