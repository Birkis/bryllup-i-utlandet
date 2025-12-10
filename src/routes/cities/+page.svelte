<script lang="ts">
    import type { PageProps } from './$types';
    import { Button } from '$lib/components/ui/button';
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from '$lib/components/ui/card';

    let { data }: PageProps = $props();
</script>

<svelte:head>
    <title>Byer | Bryllup i Utlandet</title>
    <meta
        name="description"
        content="Utforsk våre bryllupsbyer - finn den perfekte byen for deres destinasjonsbryllup."
    />
</svelte:head>

<div class="min-h-screen bg-white text-slate-900">
    <section class="relative overflow-hidden bg-[#0f1f16] text-white">
        <div class="absolute inset-0 bg-gradient-to-b from-[#0f1f16]/80 via-[#0f1f16]/70 to-[#0f1f16]/90"></div>
        <header class="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 pb-20 pt-16 text-center">
            <span class="text-sm uppercase tracking-[0.3em] text-white/60">Bryllupsbyer</span>
            <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">Våre byer</h1>
            <p class="max-w-2xl text-lg text-white/70">
                Utforsk romantiske byer som er perfekte for deres destinasjonsbryllup.
            </p>
        </header>
    </section>

    <main class="mx-auto max-w-6xl px-6 py-16">
        {#if Object.keys(data.citiesByCountry).length === 0}
            <div class="text-center">
                <p class="text-slate-500">Ingen byer funnet akkurat nå. Kom tilbake senere!</p>
            </div>
        {:else}
            {#each Object.entries(data.citiesByCountry) as [countryName, { country, cities }]}
                <section class="mb-16">
                    <div class="mb-8 flex items-center gap-4">
                        <h2 class="text-2xl font-semibold text-slate-900">{countryName}</h2>
                        <span class="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                            {cities.length} {cities.length === 1 ? 'by' : 'byer'}
                        </span>
                    </div>
                    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {#each cities as city (city.id)}
                            <Card class="overflow-hidden rounded-2xl border-slate-200 transition hover:shadow-lg">
                                {#if city.imageUrl}
                                    <a href="/cities/{city.slug}" class="block">
                                        <img
                                            src={city.imageUrl}
                                            alt={city.imageAlt ?? city.name}
                                            class="h-48 w-full object-cover transition hover:scale-105"
                                            loading="lazy"
                                        />
                                    </a>
                                {:else}
                                    <div class="flex h-48 w-full items-center justify-center bg-slate-100 text-slate-400">
                                        <span>Ingen bilde</span>
                                    </div>
                                {/if}
                                <CardHeader class="pb-2">
                                    <CardTitle class="text-lg">
                                        <a
                                            href="/cities/{city.slug}"
                                            class="text-slate-900 underline-offset-4 transition hover:text-[#0f1f16] hover:underline"
                                        >
                                            {city.name}
                                        </a>
                                    </CardTitle>
                                    {#if city.region}
                                        <CardDescription class="text-sm text-slate-500">
                                            {city.region}
                                        </CardDescription>
                                    {/if}
                                </CardHeader>
                                {#if city.shortDescription}
                                    <CardContent class="pt-0">
                                        <p class="line-clamp-2 text-sm text-slate-600">{city.shortDescription}</p>
                                    </CardContent>
                                {/if}
                                <CardFooter class="border-t border-slate-100 pt-4">
                                    <Button
                                        variant="outline"
                                        class="w-full rounded-full border-slate-300 text-sm font-semibold text-slate-900"
                                        asChild
                                    >
                                        <a href="/cities/{city.slug}">Les mer</a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        {/each}
                    </div>
                </section>
            {/each}
        {/if}
    </main>
</div>
