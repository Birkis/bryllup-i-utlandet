import type { PageServerLoad } from './$types';
import { destinationsQuery } from '$lib/sanity/queries';
import { sanityClient } from '$lib/server/sanity';
import type { DestinationListItem } from '$lib/types/destination';

const uniqueSorted = (values: (string | undefined | null)[]) =>
  Array.from(new Set(values.filter((value): value is string => Boolean(value))))
    .sort((a, b) => a.localeCompare(b, 'nb'));

export const load = (async () => {
  const destinations = await sanityClient.fetch<DestinationListItem[]>(destinationsQuery);

  const countries = uniqueSorted(destinations.map((destination) => destination.location?.country));
  const regions = uniqueSorted(destinations.map((destination) => destination.location?.region));
  const venueTypes = uniqueSorted(destinations.flatMap((destination) => destination.venueTypes ?? []));
  const bestSeasons = uniqueSorted(destinations.flatMap((destination) => destination.bestTimeToVisit ?? []));

  const capacityRange = destinations.reduce(
    (range, destination) => {
      const min = destination.capacity?.min ?? range.min;
      const max = destination.capacity?.max ?? range.max;

      return {
        min: min != null ? Math.min(range.min ?? min, min) : range.min,
        max: max != null ? Math.max(range.max ?? max, max) : range.max,
      };
    },
    { min: undefined as number | undefined, max: undefined as number | undefined },
  );

  const priceRange = destinations.reduce(
    (range, destination) => {
      const total = destination.averageCosts?.total;

      if (total == null) return range;

      return {
        min: range.min != null ? Math.min(range.min, total) : total,
        max: range.max != null ? Math.max(range.max, total) : total,
      };
    },
    { min: undefined as number | undefined, max: undefined as number | undefined },
  );

  return {
    destinations,
    filterMeta: {
      countries,
      regions,
      venueTypes,
      bestSeasons,
      capacityRange,
      priceRange,
    },
  };
}) satisfies PageServerLoad;


