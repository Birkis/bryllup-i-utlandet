<script lang="ts">
  import { format } from 'date-fns';
  import { nb } from 'date-fns/locale';
  import type { PageProps } from './$types';
  import type { DestinationDetail, PortableTextBlock, PortableTextImageBlock } from '$lib/types/destination';
  import { Button } from '$lib/components/ui/button';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
  } from '$lib/components/ui/card';

  const { data }: PageProps = $props();
  const destination = data.destination as DestinationDetail;

  const formatDate = (date?: string) => {
    if (!date) return undefined;

    const parsed = new Date(date);
    if (Number.isNaN(parsed.valueOf())) return undefined;

    return format(parsed, "d. MMMM yyyy", { locale: nb });
  };

  const formatCurrency = (value?: number, currency?: string) => {
    if (value == null) return undefined;

    return new Intl.NumberFormat('nb-NO', {
      style: 'currency',
      currency: currency ?? 'NOK',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isBlock = (item: PortableTextBlock | PortableTextImageBlock): item is PortableTextBlock =>
    item._type === 'block';

  const isImageBlock = (
    item: PortableTextBlock | PortableTextImageBlock,
  ): item is PortableTextImageBlock => item._type === 'image';

  // Helper function to render a span with its marks
  const renderSpanWithMarks = (
    span: { text: string; marks?: string[] },
    markDefs?: Array<{ _key: string; _type: string; href?: string }>,
  ): string => {
    // First, convert newlines to <br> tags
    let html = span.text.replace(/\n/g, '<br>');

    if (!span.marks || span.marks.length === 0) {
      return html;
    }

    // Apply marks in order
    for (const mark of span.marks) {
      // Check if it's a link reference
      const linkDef = markDefs?.find((def) => def._key === mark);
      if (linkDef && linkDef._type === 'link' && linkDef.href) {
        html = `<a href="${linkDef.href}" class="text-[#0f1f16] underline hover:text-[#0f1f16]/80 transition" target="_blank" rel="noopener">${html}</a>`;
      } else {
        // Apply standard marks
        switch (mark) {
          case 'strong':
            html = `<strong>${html}</strong>`;
            break;
          case 'em':
            html = `<em>${html}</em>`;
            break;
          case 'underline':
            html = `<u>${html}</u>`;
            break;
          case 'code':
            html = `<code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm">${html}</code>`;
            break;
          case 'strikethrough':
            html = `<s>${html}</s>`;
            break;
        }
      }
    }

    return html;
  };

  const hasCapacity = destination.capacity?.min || destination.capacity?.max;
  const hasAverageCosts =
    destination.averageCosts?.venue != null ||
    destination.averageCosts?.catering != null ||
    destination.averageCosts?.total != null;

  const lastUpdatedFormatted = formatDate(destination.lastUpdated);
</script>

<svelte:head>
  <title>{destination.name} | Bryllup i utlandet</title>
  {#if destination.metaDescription}
    <meta name="description" content={destination.metaDescription} />
  {/if}
  {#if destination.keywords?.length}
    <meta name="keywords" content={destination.keywords.join(', ')} />
  {/if}
</svelte:head>

<div class="min-h-screen bg-white text-slate-900">
  <section class="relative isolate overflow-hidden bg-[#0f1f16]">
    <div class="absolute inset-0">
      {#if destination.heroImage?.url}
        <img
          src={destination.heroImage.url}
          alt={destination.heroImage.alt ?? destination.name}
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
        href="/"
        class="inline-flex w-max items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
      >
        ← Tilbake til oversikt
      </a>
      <div class="space-y-4">
        <span class="text-sm uppercase tracking-[0.3em] text-white/60">Bryllupsdestinasjon</span>
        <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">{destination.name}</h1>
        {#if destination.shortDescription}
          <p class="max-w-2xl text-base text-white/70">{destination.shortDescription}</p>
        {/if}
      </div>
      <div class="flex flex-wrap gap-4 text-white/80">
        {#if destination.location?.country}
          <span class="rounded-full border border-white/20 px-4 py-2 text-sm">
            {destination.location.country}
            {#if destination.location.region}
              · {destination.location.region}
            {/if}
            {#if destination.location.city}
              · {destination.location.city}
            {/if}
          </span>
        {/if}
        {#if destination.venueTypes?.length}
          {#each destination.venueTypes.slice(0, 3) as venue}
            <span class="rounded-full border border-white/20 px-4 py-2 text-sm capitalize">
              {venue}
            </span>
          {/each}
          {#if destination.venueTypes.length > 3}
            <span class="rounded-full border border-white/20 px-4 py-2 text-sm">
              +{destination.venueTypes.length - 3} flere
            </span>
          {/if}
        {/if}
        {#if destination.bestTimeToVisit?.length}
          <span class="rounded-full border border-white/20 px-4 py-2 text-sm">
            Beste tid: {destination.bestTimeToVisit.join(', ')}
          </span>
        {/if}
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <Button
          size="lg"
          class="rounded-full border border-white/30 bg-white px-6 py-4 text-sm font-semibold text-[#0f1f16] shadow-none transition hover:bg-white/90"
          asChild
        >
          <a href="/kontakt">Kontakt oss om {destination.name}</a>
        </Button>
        {#if lastUpdatedFormatted}
          <span class="text-xs uppercase tracking-wide text-white/60">
            Sist oppdatert {lastUpdatedFormatted}
          </span>
        {/if}
      </div>
    </div>
  </section>

  <main class="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[2fr,1fr]">
    <section class="space-y-12">
      {#if destination.fullDescription?.length}
        <article class="prose prose-slate max-w-none">
          {#each destination.fullDescription as block}
            {#if isBlock(block)}
              {#if block.style === 'h2'}
                <h2>
                  {#each block.children ?? [] as child}
                    {@html renderSpanWithMarks(child, block.markDefs)}
                  {/each}
                </h2>
              {:else if block.style === 'h3'}
                <h3>
                  {#each block.children ?? [] as child}
                    {@html renderSpanWithMarks(child, block.markDefs)}
                  {/each}
                </h3>
              {:else if block.style === 'h4'}
                <h4>
                  {#each block.children ?? [] as child}
                    {@html renderSpanWithMarks(child, block.markDefs)}
                  {/each}
                </h4>
              {:else if block.style === 'blockquote'}
                <blockquote>
                  {#each block.children ?? [] as child}
                    {@html renderSpanWithMarks(child, block.markDefs)}
                  {/each}
                </blockquote>
              {:else}
                <p>
                  {#each block.children ?? [] as child}
                    {@html renderSpanWithMarks(child, block.markDefs)}
                  {/each}
                </p>
              {/if}
            {:else if isImageBlock(block) && block.url}
              <figure class="overflow-hidden rounded-2xl">
                <img
                  src={block.url}
                  alt={block.alt ?? destination.name}
                  class="w-full rounded-2xl"
                  loading="lazy"
                  decoding="async"
                />
                {#if block.caption}
                  <figcaption class="mt-2 text-center text-sm text-slate-500">{block.caption}</figcaption>
                {/if}
              </figure>
            {/if}
          {/each}
        </article>
      {:else}
        <div class="space-y-4">
          <h2 class="text-2xl font-semibold text-slate-900">Om destinasjonen</h2>
          <p class="text-slate-600">Informasjon om denne destinasjonen kommer snart. Ta kontakt for flere detaljer.</p>
        </div>
      {/if}

      {#if destination.imageGallery?.length}
        <section class="space-y-6">
          <h2 class="text-2xl font-semibold text-slate-900">Bildegalleri</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            {#each destination.imageGallery as image (image._key ?? image.url)}
              {#if image?.url}
                <figure class="group overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={image.url}
                    alt={image.alt ?? destination.name}
                    class="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  {#if image.caption}
                    <figcaption class="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
                      {image.caption}
                    </figcaption>
                  {/if}
                </figure>
              {/if}
            {/each}
          </div>
        </section>
      {/if}
    </section>

    <aside class="space-y-8">
      {#if destination.highlights?.length}
        <Card class="border-slate-200">
          <CardHeader>
            <CardTitle>Høydepunkter</CardTitle>
            <CardDescription>Dette elsker parene ved {destination.name}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            {#each destination.highlights as highlight}
              <div class="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                <p class="text-sm font-semibold text-slate-900">
                  {highlight.icon ? `${highlight.icon} ` : ''}{highlight.title}
                </p>
                {#if highlight.description}
                  <p class="mt-1 text-sm text-slate-600">{highlight.description}</p>
                {/if}
              </div>
            {/each}
          </CardContent>
        </Card>
      {/if}

      {#if hasCapacity || hasAverageCosts}
        <Card class="border-slate-200">
          <CardHeader>
            <CardTitle>Praktisk info</CardTitle>
            <CardDescription>Planlegging og kapasitet</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            {#if hasCapacity}
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-600">Gjester</span>
                <span class="font-semibold text-slate-900">
                  {destination.capacity?.min ?? '?'}–{destination.capacity?.max ?? '?'} gjester
                </span>
              </div>
            {/if}
            {#if hasAverageCosts}
              <div class="grid gap-3 text-sm">
                {#if destination.averageCosts?.venue != null}
                  <div class="flex justify-between">
                    <span class="text-slate-600">Venue</span>
                    <span class="font-semibold text-slate-900">
                      {formatCurrency(destination.averageCosts?.venue, destination.averageCosts?.currency)}
                    </span>
                  </div>
                {/if}
                {#if destination.averageCosts?.catering != null}
                  <div class="flex justify-between">
                    <span class="text-slate-600">Catering (per person)</span>
                    <span class="font-semibold text-slate-900">
                      {formatCurrency(destination.averageCosts?.catering, destination.averageCosts?.currency)}
                    </span>
                  </div>
                {/if}
                {#if destination.averageCosts?.total != null}
                  <div class="flex justify-between">
                    <span class="text-slate-600">Estimert total</span>
                    <span class="font-semibold text-slate-900">
                      {formatCurrency(destination.averageCosts?.total, destination.averageCosts?.currency)}
                    </span>
                  </div>
                {/if}
              </div>
            {/if}
          </CardContent>
        </Card>
      {/if}

      {#if destination.contactInfo?.email || destination.contactInfo?.phone || destination.contactInfo?.website || destination.contactInfo?.bookingInfo}
        <Card class="border-slate-200">
          <CardHeader>
            <CardTitle>Kontaktinfo</CardTitle>
            <CardDescription>La oss planlegge {destination.name}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3 text-sm text-slate-600">
            {#if destination.contactInfo?.email}
              <p>
                <span class="font-semibold text-slate-900">E-post:</span>
                <br />
                <a class="text-[#0f1f16] underline" href={`mailto:${destination.contactInfo.email}`}>
                  {destination.contactInfo.email}
                </a>
              </p>
            {/if}
            {#if destination.contactInfo?.phone}
              <p>
                <span class="font-semibold text-slate-900">Telefon:</span>
                <br />
                <a class="text-[#0f1f16] underline" href={`tel:${destination.contactInfo.phone}`}>
                  {destination.contactInfo.phone}
                </a>
              </p>
            {/if}
            {#if destination.contactInfo?.website}
              <p>
                <span class="font-semibold text-slate-900">Nettside:</span>
                <br />
                <a
                  class="text-[#0f1f16] underline"
                  href={destination.contactInfo.website}
                  rel="noopener"
                  target="_blank"
                >
                  Besøk nettsiden
                </a>
              </p>
            {/if}
            {#if destination.contactInfo?.bookingInfo}
              <p>
                <span class="font-semibold text-slate-900">Booking-info:</span>
                <br />
                <span>{destination.contactInfo.bookingInfo}</span>
              </p>
            {/if}
          </CardContent>
        </Card>
      {/if}

      <Card class="border-slate-200 bg-[#0f1f16] text-white">
        <CardHeader>
          <CardTitle>Planlegg ditt drømmebryllup</CardTitle>
          <CardDescription class="text-white/80">
            Fyll ut kontaktskjemaet vårt, så tar vi en prat om {destination.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            class="w-full rounded-full border border-white/30 bg-white px-6 py-4 text-sm font-semibold text-[#0f1f16] shadow-none transition hover:bg-white/90"
            asChild
          >
            <a href="/kontakt">Kontakt oss</a>
          </Button>
        </CardContent>
      </Card>
    </aside>
  </main>
</div>