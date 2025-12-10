import type { PageServerLoad } from './$types';
import { citiesQuery } from '$lib/sanity/queries';
import { sanityClient } from '$lib/server/sanity';
import type { City } from '$lib/types/destination';

export const load = (async () => {
  const cities = await sanityClient.fetch<City[]>(citiesQuery);

  // Group cities by country for display
  const citiesByCountry = cities.reduce<Record<string, { country: City['country']; cities: City[] }>>(
    (acc, city) => {
      const countryName = city.country?.name ?? 'Ukjent land';
      if (!acc[countryName]) {
        acc[countryName] = {
          country: city.country,
          cities: [],
        };
      }
      acc[countryName].cities.push(city);
      return acc;
    },
    {}
  );

  return {
    cities,
    citiesByCountry,
  };
}) satisfies PageServerLoad;

