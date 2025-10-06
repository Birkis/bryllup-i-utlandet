import type { PageServerLoad } from './$types';
import { destinationsQuery } from '$lib/sanity/queries';
import { sanityClient } from '$lib/server/sanity';
import type { DestinationListItem } from '$lib/types/destination';

export const load = (async () => {
  const destinations = await sanityClient.fetch<DestinationListItem[]>(destinationsQuery);

  return {
    destinations,
    fallbackImage: '/fallback-destination.jpg',
  };
}) satisfies PageServerLoad;

