<script lang="ts">
    import type { PageProps } from './$types';
    import { Button } from '$lib/components/ui/button';
    import {
        Card,
        CardHeader,
        CardTitle,
        CardContent,
        CardDescription,
    } from '$lib/components/ui/card';
    import { MapPin } from '@lucide/svelte';

    let { data }: PageProps = $props();
    const city = data.city;

    // Build contact URL with country and city pre-populated
    const contactUrl = city.country?.name
        ? `/kontakt?country=${encodeURIComponent(city.country.name)}&city=${encodeURIComponent(city.name)}`
        : `/kontakt?city=${encodeURIComponent(city.name)}`;
</script>

<svelte:head>
    <title>{city.name} | Bryllup i Utlandet</title>
    <meta
        name="description"
        content={city.shortDescription ?? `Planlegg ditt drømmebryllup i ${city.name}.`}
    />
</svelte:head>

<div class="min-h-screen bg-white text-slate-900">
    <section class="relative isolate overflow-hidden bg-[#0f1f16]">
        <div class="absolute inset-0">
            {#if city.imageUrl}
                <img
                    src={city.imageUrl}
                    alt={city.imageAlt ?? city.name}
                    class="h-full w-full object-cover opacity-60"
                    loading="lazy"
                    decoding="async"
                />
            {:else}
                <div class="h-full w-full bg-[#0f1f16] opacity-80"></div>
            {/if}
            <div class="absolute inset-0 bg-gradient-to-b from-[#0f1f16]/80 via-[#0f1f16]/70 to-[#0f1f16]/90"></div>
        </div>
        <div class="relative mx-auto flex max-w-5xl flex-col gap-6 px-6 py-24 text-white">
            <a
                href="/cities"
                class="inline-flex w-max items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
            >
                ← Tilbake til byer
            </a>
            <div class="space-y-4">
                <span class="text-sm uppercase tracking-[0.3em] text-white/60">Bryllupsby</span>
                <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">{city.name}</h1>
                {#if city.shortDescription}
                    <p class="max-w-2xl text-base text-white/70">{city.shortDescription}</p>
                {/if}
            </div>
            <div class="flex flex-wrap gap-4 text-white/80">
                {#if city.country?.name}
                    <span class="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
                        <MapPin class="size-4" />
                        {city.country.name}
                        {#if city.region}
                            · {city.region}
                        {/if}
                    </span>
                {:else if city.region}
                    <span class="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm">
                        <MapPin class="size-4" />
                        {city.region}
                    </span>
                {/if}
                {#if city.isFeatured}
                    <span class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
                        Anbefalt
                    </span>
                {/if}
            </div>
            <div class="flex flex-wrap items-center gap-4">
                <Button
                    size="lg"
                    class="rounded-full border border-white/30 bg-white px-6 py-4 text-sm font-semibold text-[#0f1f16] shadow-none transition hover:bg-white/90"
                    href={contactUrl}
                >
                    Få tilbud for bryllup i {city.name}
                </Button>
            </div>
        </div>
    </section>

    <main class="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[2fr,1fr]">
        <section class="space-y-12">
            <article class="prose prose-slate max-w-none">
                <h2>Om {city.name}</h2>
                {#if city.shortDescription}
                    <p class="lead">{city.shortDescription}</p>
                {:else}
                    <p>
                        {city.name} er en fantastisk destinasjon for ditt drømmebryllup. 
                        Kontakt oss for mer informasjon om muligheter og bryllupsplanlegging i {city.name}.
                    </p>
                {/if}
                
                {#if city.country?.description}
                    <h3>Om {city.country.name}</h3>
                    <p>{city.country.description}</p>
                {/if}
            </article>

            {#if city.coordinates?.latitude && city.coordinates?.longitude}
                <section class="space-y-4">
                    <h2 class="text-xl font-semibold text-slate-900">Beliggenhet</h2>
                    <div class="overflow-hidden rounded-2xl border border-slate-200">
                        <iframe
                            title="Kart over {city.name}"
                            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q={city.coordinates.latitude},{city.coordinates.longitude}&zoom=12"
                            class="h-80 w-full"
                            loading="lazy"
                            allowfullscreen
                        ></iframe>
                    </div>
                </section>
            {/if}
        </section>

        <aside class="space-y-8">
            {#if city.country}
                <Card class="border-slate-200">
                    <CardHeader>
                        <CardTitle>Land</CardTitle>
                        <CardDescription>{city.country.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {#if city.country.imageUrl}
                            <img
                                src={city.country.imageUrl}
                                alt={city.country.name}
                                class="h-32 w-full rounded-lg object-cover"
                                loading="lazy"
                            />
                        {/if}
                    </CardContent>
                </Card>
            {/if}

            <Card class="border-slate-200 bg-[#0f1f16] text-white">
                <CardHeader>
                    <CardTitle>Planlegg ditt drømmebryllup</CardTitle>
                    <CardDescription class="text-white/80">
                        Kontakt oss for en uforpliktende prat om bryllup i {city.name}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        size="lg"
                        class="w-full rounded-full border border-white/30 bg-white px-6 py-4 text-sm font-semibold text-[#0f1f16] shadow-none transition hover:bg-white/90"
                        href={contactUrl}
                    >
                        Kontakt oss
                    </Button>
                </CardContent>
            </Card>
        </aside>
    </main>
</div>
