<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
    CardDescription,
  } from "$lib/components/ui/card";
  import heroImage from "$lib/assets/bryllupsbilder_3.png?imagetools&width=1600;1200;800&format=webp;png&as=picture";

  export let data;
</script>

<div id="top" class="min-h-screen bg-white text-slate-900">
  <div class="relative overflow-hidden bg-[#0f1f16] text-white">
    <div class="absolute inset-0">
      <picture>
        {#each heroImage.sources as source}
          <source srcset={source.srcset} type={source.type} sizes="100vw" />
        {/each}
        <img
          src={heroImage.img.src}
          alt="Bryllupspar i utlandet"
          class="h-full w-full object-cover opacity-40"
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div class="absolute inset-0 bg-[#0f1f16]/30"></div>
    </div>

    <header class="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 pb-24 pt-20 text-center">
      <span class="text-sm uppercase tracking-[0.3em] text-white/60">Bryllupspakken</span>
      <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">Bryllup i utlandet</h1>
      <p class="max-w-2xl text-lg text-white/70">
        Si ja til hverandre på verdens vakreste steder. Vi gjør drømmen til virkelighet.
      </p>
      <Button
        size="lg"
        class="rounded-full border border-white/30 bg-transparent px-8 py-6 text-base text-white shadow-none transition hover:bg-white/10"
        asChild
      >
        <a href="/kontakt">Be om tilbud</a>
      </Button>
    </header>
  </div>

  <main class="">
    <section id="destinations" class="mx-auto max-w-6xl px-6">
      <div class="text-center">
        <h2 class="text-3xl font-semibold text-slate-900 py-6">Våre populære destinasjoner</h2>
        <p class="mt-3 text-base text-slate-600">
          Fra eksotiske strender til snødekte fjell – vi hjelper deg å finne den perfekte rammen for deres store dag .
        </p>
      </div>
      <div class="mt-12 grid gap-8 md:grid-cols-2 pb-24">
        {#if data.destinations?.length === 0}
          <p class="text-center text-slate-500">Ingen destinasjoner funnet akkurat nå. Kom tilbake senere!</p>
        {:else}
          {#each data.destinations as destination}
            <Card class="overflow-hidden rounded-2xl border-slate-200">
            {#if destination.imageUrl}
              <img src={destination.imageUrl} alt={destination.imageAlt ?? destination.name} class="h-60 object-top w-full object-cover -translate-y-6" />
            {:else}
              <div class="flex h-60 w-full items-center justify-center bg-slate-100 text-slate-500">
                <span>Mangler bilde</span>
              </div>
            {/if}
            <CardHeader class="gap-2 border-b border-slate-100 pb-5">
              <CardTitle class="text-xl">
                {#if destination.slug}
                  <a
                    href={`/destinations/${destination.slug}`}
                    class="text-slate-900 underline-offset-4 transition hover:text-[#0f1f16] hover:underline"
                  >
                    {destination.name}
                  </a>
                {:else}
                  {destination.name}
                {/if}
              </CardTitle>
              <CardDescription class="text-slate-600">{destination.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4 pt-6">
              <div class="space-y-2">
                <h3 class="font-semibold text-slate-900">Høydepunkter:</h3>
                {#if destination.highlights?.length}
                  <div class="flex flex-wrap gap-2">
                    {#each destination.highlights as highlight}
                      <span class="rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-700">
                        {highlight.title}
                      </span>
                    {/each}
                  </div>
                {:else}
                  <p class="text-sm text-slate-500">Høydepunkter kommer snart.</p>
                {/if}
              </div>
            </CardContent>
            <CardFooter class="border-t border-slate-100 pt-6">
              <Button
                variant="outline"
                class="w-full rounded-full border-slate-300 px-6 py-5 text-base font-semibold text-slate-900"
                asChild
              >
                <a href="/kontakt">Få tilbud for {destination.name}</a>
              </Button>
            </CardFooter>
            </Card>
          {/each}
        {/if}
      </div>
    </section>

    <section id="about" class="bg-slate-50">
      <div class="mx-auto max-w-5xl space-y-10 px-6 py-20 text-center">
        <div class="space-y-4">
          <h2 class="text-3xl font-semibold text-slate-900">Hvorfor velge oss for ditt destinasjonsbryllup?</h2>
          <p class="mx-auto max-w-3xl text-base text-slate-600">
            Vi samarbeider med lokale eksperter og tar hånd om alle detaljer, slik at dere kan fokusere på å nyte dagen.
          </p>
        </div>
        <div class="grid gap-10 md:grid-cols-3">
          <div class="space-y-3">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0f1f16]/10 text-[#0f1f16]">
              <span class="text-xl">🌍</span>
            </div>
            <h3 class="text-lg font-semibold text-slate-900">Lokal ekspertise</h3>
            <p class="text-sm text-slate-600">
              Vi har lokale partnere på alle våre destinasjoner som kjenner de beste stedene og leverandørene.
            </p>
          </div>
          <div class="space-y-3">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0f1f16]/10 text-[#0f1f16]">
              <span class="text-xl">📋</span>
            </div>
            <h3 class="text-lg font-semibold text-slate-900">Alt fra A til Å</h3>
            <p class="text-sm text-slate-600">
              Fra vielse og dokumenter til resepsjon og overnatting – vi ordner alt så dere kan slappe av.
            </p>
          </div>
          <div class="space-y-3">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0f1f16]/10 text-[#0f1f16]">
              <span class="text-xl">❤️</span>
            </div>
            <h3 class="text-lg font-semibold text-slate-900">Personlig service</h3>
            <p class="text-sm text-slate-600">
              Vi skreddersyr hver enkel reise og bryllup etter deres ønsker og drømmer.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="relative overflow-hidden">
      <div class="absolute inset-0">
        <img
          src={heroImage.img.src}
          alt="Bryllupspar på stranden"
          class="h-full w-full object-cover opacity-30"
          loading="lazy"
          decoding="async"
        />
        <div class="absolute inset-0 bg-[#0f1f16]/80"></div>
      </div>
      <div class="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center text-white">
        <h2 class="text-3xl font-semibold">La oss planlegge deres drømmebryllup</h2>
        <p class="max-w-2xl text-base text-white/80">
          Kontakt oss i dag for en uforpliktende samtale om hvordan vi kan gjøre deres destinasjonsbryllup til virkelighet.
        </p>
        <Button
          size="lg"
          class="rounded-full border border-white/30 bg-white px-8 py-5 text-base font-semibold text-[#0f1f16] hover:bg-white/90"
          asChild
        >
          <a href="/kontakt">Kontakt oss i dag</a>
        </Button>
      </div>
    </section>
  </main>

</div>
