<script lang="ts">
  import { ChevronDown, SlidersHorizontal } from 'lucide-svelte';
  import DestinationCard from '$lib/components/destinations/DestinationCard.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import type { DestinationListItem } from '$lib/types/destination';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  const destinations = data.destinations ?? [] satisfies DestinationListItem[];
  const filterMeta = data.filterMeta ?? {};

  const countries = filterMeta?.countries ?? [];
  const regions = filterMeta?.regions ?? [];
  const venueTypes = filterMeta?.venueTypes ?? [];
  const bestSeasons = filterMeta?.bestSeasons ?? [];

  const capacityMin = filterMeta?.capacityRange?.min;
  const capacityMax = filterMeta?.capacityRange?.max;
  const priceMin = filterMeta?.priceRange?.min;
  const priceMax = filterMeta?.priceRange?.max;

  let selectedCountry = '';
  let selectedRegion = '';
  let selectedVenueTypes: string[] = [];
  let selectedSeason = '';
  let guestMin = capacityMin;
  let guestMax = capacityMax;
  let maxBudget = priceMax;
  let requireAccommodation = false;
  let requirePlannerSupport = false;

  let showFilters = false;

  const toggleVenueType = (venue: string) => {
    selectedVenueTypes = selectedVenueTypes.includes(venue)
      ? selectedVenueTypes.filter((item) => item !== venue)
      : [...selectedVenueTypes, venue];
  };

  const resetFilters = () => {
    selectedCountry = '';
    selectedRegion = '';
    selectedVenueTypes = [];
    selectedSeason = '';
    guestMin = capacityMin;
    guestMax = capacityMax;
    maxBudget = priceMax;
    requireAccommodation = false;
    requirePlannerSupport = false;
  };

  const parseNumber = (value: string | number | undefined | null) => {
    if (value == null || value === '') return undefined;
    const numeric = Number(value);
    return Number.isNaN(numeric) ? undefined : numeric;
  };

  const accommodationPattern = /(overnatt|accommod|stay|lodging|hotell)/;
  const plannerPattern = /(planlegger|planner|service|koordin|koordinator)/;

  const hasAccommodation = (destination: DestinationListItem) =>
    destination.highlights?.some((highlight) => {
      const title = highlight.title?.toLowerCase() ?? '';
      return accommodationPattern.test(title);
    }) ?? false;

  const hasPlannerSupport = (destination: DestinationListItem) =>
    destination.highlights?.some((highlight) => {
      const title = highlight.title?.toLowerCase() ?? '';
      return plannerPattern.test(title);
    }) ?? false;

  const matchesVenueTypes = (destination: DestinationListItem) => {
    if (!selectedVenueTypes.length) return true;
    const venueList = destination.venueTypes ?? [];
    return selectedVenueTypes.every((venue) => venueList.includes(venue));
  };

  const matchesSeason = (destination: DestinationListItem) => {
    if (!selectedSeason) return true;
    return destination.bestTimeToVisit?.includes(selectedSeason) ?? false;
  };

  const matchesGuests = (destination: DestinationListItem) => {
    const min = parseNumber(guestMin);
    const max = parseNumber(guestMax);

    const capacityMinValue = destination.capacity?.min;
    const capacityMaxValue = destination.capacity?.max;

    if (min != null && capacityMaxValue != null && capacityMaxValue < min) return false;
    if (max != null && capacityMinValue != null && capacityMinValue > max) return false;
    return true;
  };

  const matchesBudget = (destination: DestinationListItem) => {
    const budget = parseNumber(maxBudget);
    if (budget == null) return true;
    const totalCost = destination.averageCosts?.total;
    if (totalCost == null) return false;
    return totalCost <= budget;
  };

  const matchesLocation = (destination: DestinationListItem) => {
    const country = selectedCountry;
    const region = selectedRegion;

    if (country && destination.location?.country !== country) return false;
    if (region && destination.location?.region !== region) return false;
    return true;
  };

  const matchesExtras = (destination: DestinationListItem) => {
    if (requireAccommodation && !hasAccommodation(destination)) return false;
    if (requirePlannerSupport && !hasPlannerSupport(destination)) return false;
    return true;
  };

  const isFilterActive = () =>
    Boolean(
      selectedCountry ||
        selectedRegion ||
        selectedVenueTypes.length ||
        selectedSeason ||
        requireAccommodation ||
        requirePlannerSupport ||
        (parseNumber(guestMin) != null && parseNumber(guestMin) !== capacityMin) ||
        (parseNumber(guestMax) != null && parseNumber(guestMax) !== capacityMax) ||
        (parseNumber(maxBudget) != null && parseNumber(maxBudget) !== priceMax),
    );

  const filteredDestinations = $derived.by(() =>
    destinations.filter(
      (destination) =>
        matchesLocation(destination) &&
        matchesVenueTypes(destination) &&
        matchesSeason(destination) &&
        matchesGuests(destination) &&
        matchesBudget(destination) &&
        matchesExtras(destination),
    ),
  );

  const matchCountLabel = $derived(
    filteredDestinations.length === 1
      ? '1 destinasjon matcher'
      : `${filteredDestinations.length} destinasjoner matcher`,
  );

</script>

<svelte:head>
  <title>Finn destinasjon | Bryllup i utlandet</title>
  <meta
    name="description"
    content="Utforsk bryllupsdestinasjoner i utlandet. Filtrer på land, sesong, budsjett og gjesteantall for å finne stedet som passer dere."
  />
</svelte:head>

<div class="min-h-screen bg-white text-slate-900">
  <section class="relative isolate overflow-hidden bg-[#0f1f16]">
    <div class="absolute inset-0 bg-gradient-to-br from-[#0f1f16] via-[#13281e] to-[#0f1f16]"></div>
    <div class="relative mx-auto flex max-w-4xl flex-col gap-6 px-6 py-24 text-white">
      <a
        href="/"
        class="inline-flex w-max items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
      >
        ← Tilbake til forsiden
      </a>
      <div class="space-y-4">
        <span class="text-sm uppercase tracking-[0.3em] text-white/60">Bryllupsdestinasjoner</span>
        <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">Finn den perfekte destinasjonen</h1>
        <p class="max-w-2xl text-base text-white/70">
          Filtrer etter land, budsjett, sesong, kapasitet og ønskede tjenester for å finne stedet som passer deres
          drømmedag.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-4 text-white/80">
        <p class="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
          <SlidersHorizontal class="h-4 w-4" aria-hidden="true" />
          <span aria-live="polite">{matchCountLabel}</span>
        </p>
        {#if isFilterActive()}
          <Button variant="secondary" class="rounded-full bg-white/20 px-5 py-2 text-sm text-white" on:click={resetFilters}>
            Tilbakestill filtre
          </Button>
        {/if}
      </div>
    </div>
  </section>

  <main class="mx-auto w-full max-w-6xl px-6 py-16">
    <div class="mb-8 flex items-center justify-between gap-4 lg:hidden">
      <div class="flex items-center gap-2 text-sm font-medium text-slate-600">
        <SlidersHorizontal class="h-4 w-4" aria-hidden="true" />
        <span>Filtre</span>
      </div>
      <Button
        variant="outline"
        class="flex items-center gap-2 rounded-full border-slate-300 px-4 py-2 text-sm"
        on:click={() => (showFilters = !showFilters)}
        aria-expanded={showFilters}
        aria-controls="filters-panel"
      >
        {showFilters ? 'Skjul' : 'Vis'} filtre
        <ChevronDown class={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} aria-hidden="true" />
      </Button>
    </div>

    <div class="grid gap-10 lg:grid-cols-[320px_1fr]">
      <aside
        id="filters-panel"
        class={`space-y-6 rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm transition-all duration-200 ${
          showFilters ? 'block' : 'hidden lg:block'
        }`}
      >
        <header class="flex items-center justify-between">
          <div class="space-y-1">
            <h2 class="text-lg font-semibold text-slate-900">Filtrer destinasjoner</h2>
            <p class="text-sm text-slate-500">Juster etter det som er viktig for dere</p>
          </div>
          <Button variant="ghost" class="text-sm text-slate-600" on:click={resetFilters}>
            Nullstill
          </Button>
        </header>

        <div class="space-y-4">
          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-slate-700">Land</span>
            <select
              class="h-10 w-full rounded-full border border-slate-200 bg-white px-4 text-sm shadow-sm focus:border-[#0f1f16] focus:outline-none"
              bind:value={selectedCountry}
            >
              <option value="">Alle land</option>
              {#each countries as country}
                <option value={country}>{country}</option>
              {/each}
            </select>
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-slate-700">Region</span>
            <select
              class="h-10 w-full rounded-full border border-slate-200 bg-white px-4 text-sm shadow-sm focus:border-[#0f1f16] focus:outline-none"
              bind:value={selectedRegion}
            >
              <option value="">Alle regioner</option>
              {#each regions as regionOption}
                <option value={regionOption}>{regionOption}</option>
              {/each}
            </select>
          </label>
        </div>

        {#if venueTypes.length}
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">Stedstype</span>
              <span class="text-xs text-slate-500">Velg flere</span>
            </div>
            <div class="flex flex-wrap gap-2">
              {#each venueTypes as venue}
                <button
                  type="button"
                  class={`rounded-full border px-4 py-2 text-sm transition ${
                    selectedVenueTypes.includes(venue)
                      ? 'border-[#0f1f16] bg-[#0f1f16] text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                  on:click={() => toggleVenueType(venue)}
                >
                  {venue}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        {#if capacityMin != null || capacityMax != null}
          <div class="space-y-3">
            <span class="text-sm font-medium text-slate-700">Gjesteantall</span>
            <div class="grid grid-cols-2 gap-4">
              <label class="space-y-1 text-xs text-slate-500">
                <span>Fra</span>
                <Input
                  type="number"
                  min={capacityMin ?? 0}
                  bind:value={guestMin}
                  placeholder={capacityMin != null ? `${capacityMin}` : '0'}
                />
              </label>
              <label class="space-y-1 text-xs text-slate-500">
                <span>Til</span>
                <Input
                  type="number"
                  min={capacityMin ?? 0}
                  bind:value={guestMax}
                  placeholder={capacityMax != null ? `${capacityMax}` : '200'}
                />
              </label>
            </div>
            <p class="text-xs text-slate-500">
              Vi matcher destinasjoner som kan håndtere hele intervallet dere oppgir.
            </p>
          </div>
        {/if}

        {#if priceMax != null}
          <div class="space-y-3">
            <span class="text-sm font-medium text-slate-700">Budsjett (totalramme)</span>
            <label class="space-y-2">
              <span class="text-xs text-slate-500">Maks {priceMax?.toLocaleString('nb-NO')} kr</span>
              <Input
                type="number"
                min={priceMin ?? 0}
                step={1000}
                bind:value={maxBudget}
                placeholder={priceMax != null ? `${priceMax}` : 'Angi beløp'}
              />
            </label>
            <p class="text-xs text-slate-500">Viser destinasjoner med estimert totalpris under valgt beløp.</p>
          </div>
        {/if}

        {#if bestSeasons.length}
          <div class="space-y-3">
            <span class="text-sm font-medium text-slate-700">Beste sesong</span>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class={`rounded-full border px-4 py-2 text-sm transition ${
                  selectedSeason === ''
                    ? 'border-[#0f1f16] bg-[#0f1f16] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
                on:click={() => (selectedSeason = '')}
              >
                Alle
              </button>
              {#each bestSeasons as season}
                <button
                  type="button"
                  class={`rounded-full border px-4 py-2 text-sm capitalize transition ${
                    selectedSeason === season
                      ? 'border-[#0f1f16] bg-[#0f1f16] text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                  on:click={() => (selectedSeason = season)}
                >
                  {season}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        <div class="space-y-3">
          <span class="text-sm font-medium text-slate-700">Ekstra ønsker</span>
          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" bind:checked={requireAccommodation} class="h-4 w-4 rounded border-slate-300" />
            Overnatting på eller nær stedet
          </label>
          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" bind:checked={requirePlannerSupport} class="h-4 w-4 rounded border-slate-300" />
            Lokal bryllupsplanlegger inkludert
          </label>
        </div>
      </aside>

      <section class="space-y-8">
        <header class="flex flex-col gap-2">
          <h2 class="text-2xl font-semibold text-slate-900">{matchCountLabel}</h2>
          <p class="text-sm text-slate-600">
            Vi oppdaterer listen etter hvert som du justerer filtrene. Alle priser er veiledende og kan variere med
            sesong og leverandører.
          </p>
        </header>

        {#if filteredDestinations.length}
          <div class="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {#each filteredDestinations as destination (destination.id)}
              <DestinationCard destination={destination} />
            {/each}
          </div>
        {:else}
          <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <h3 class="text-lg font-semibold text-slate-900">Ingen destinasjoner matcher filtrene</h3>
            <p class="mt-2 text-sm text-slate-600">
              Juster filtrene, eller <a href="/kontakt" class="underline">ta kontakt</a> så finner vi et alternativ
              som passer dere.
            </p>
            <Button class="mt-6 rounded-full px-6 py-3" on:click={resetFilters}>Tilbakestill filtre</Button>
          </div>
        {/if}
      </section>
    </div>
  </main>
</div>