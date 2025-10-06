import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { destinationBySlugQuery } from '$lib/sanity/queries';
import { sanityClient } from '$lib/server/sanity';

export const load = (async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    throw error(400, 'Destination slug mangler.');
  }

  const destination = await sanityClient.fetch(destinationBySlugQuery, { slug });

  if (!destination) {
    throw error(404, 'Fant ikke destinasjon.');
  }

  return {
    destination,
  };
}) satisfies PageServerLoad;

