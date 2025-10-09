<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";

  export type Destination = {
    name: string;
    slug?: string;
    imageUrl?: string;
    imageAlt?: string | null;
    shortDescription?: string | null;
    highlights?: { title: string }[];
  };

  export let destination: Destination;
</script>

<Card class="overflow-hidden rounded-2xl border-slate-200">
  {#if destination.imageUrl}
    <img
      src={destination.imageUrl}
      alt={destination.imageAlt ?? destination.name}
      class="h-60 w-full -translate-y-6 object-cover object-top"
    />
  {:else}
    <div class="flex h-60 w-full items-center justify-center bg-slate-100 text-slate-500">
      <span>Mangler bilde</span>
    </div>
  {/if}
  <CardHeader class="gap-2 border-b border-slate-100 pb-5">
    <CardTitle class="text-xl">
      {#if destination.slug}
        <a
          href="/destinations/{destination.slug.replace(/^\/+/, '')}"
          class="text-slate-900 underline-offset-4 transition hover:text-[#0f1f16] hover:underline"
        >
          {destination.name}
        </a>
      {:else}
        {destination.name}
      {/if}
    </CardTitle>
    {#if destination.shortDescription}
      <CardDescription class="text-slate-600">{destination.shortDescription}</CardDescription>
    {/if}
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

