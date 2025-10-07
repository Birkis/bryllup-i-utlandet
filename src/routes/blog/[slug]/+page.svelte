<script lang="ts">
  import { format } from 'date-fns';
  import { nb } from 'date-fns/locale';
  import type { PageProps } from './$types';
  import type { BlogPostDetail } from '$lib/types/blog-post';
  import type { PortableTextBlock, PortableTextImageBlock } from '$lib/types/destination';

  const { data }: PageProps = $props();
  const post = data.post as BlogPostDetail;

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.valueOf())) return date;
    return format(parsed, "d. MMMM yyyy", { locale: nb });
  };

  const isBlock = (item: PortableTextBlock | PortableTextImageBlock): item is PortableTextBlock =>
    item._type === 'block';

  const isImageBlock = (
    item: PortableTextBlock | PortableTextImageBlock,
  ): item is PortableTextImageBlock => item._type === 'image';
</script>

<svelte:head>
  <title>{post.title} | Bryllup i utlandet</title>
  {#if post.excerpt}
    <meta name="description" content={post.excerpt} />
  {/if}
  {#if post.tags?.length}
    <meta name="keywords" content={post.tags.join(', ')} />
  {/if}
</svelte:head>

<div class="min-h-screen bg-white text-slate-900">
  <section class="relative isolate overflow-hidden bg-[#0f1f16]">
    <div class="absolute inset-0">
      {#if post.featuredImage?.url}
        <img
          src={post.featuredImage.url}
          alt={post.featuredImage.alt ?? post.title}
          class="h-full w-full object-cover opacity-60"
          loading="lazy"
          decoding="async"
        />
      {:else}
        <div class="h-full w-full bg-[#0f1f16] opacity-80"></div>
      {/if}
      <div class="absolute inset-0 bg-gradient-to-b from-[#0f1f16]/80 via-[#0f1f16]/70 to-[#0f1f16]/90"></div>
    </div>
    <div class="relative mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12 text-white">
      <div class="space-y-4">
        <span class="text-sm uppercase tracking-[0.3em] text-white/60">Blogg</span>
        <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
        <div class="flex flex-wrap items-center gap-4 text-sm text-white/70">
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>Av {post.author}</span>
        </div>
        {#if post.excerpt}
          <p class="max-w-2xl text-base text-white/70">{post.excerpt}</p>
        {/if}
        {#if post.tags?.length}
          <div class="flex flex-wrap gap-2">
            {#each post.tags as tag}
              <span class="rounded-full border border-white/20 px-4 py-2 text-sm">
                {tag}
              </span>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </section>

  <main class="mx-auto w-full max-w-4xl px-6 py-16">
    {#if post.content?.length}
      <article class="prose prose-slate prose-lg max-w-none">
        {#each post.content as block}
          {#if isBlock(block)}
            {#if block.style === 'h2'}
              <h2>{block.children?.[0]?.text}</h2>
            {:else if block.style === 'h3'}
              <h3>{block.children?.[0]?.text}</h3>
            {:else if block.style === 'h4'}
              <h4>{block.children?.[0]?.text}</h4>
            {:else if block.style === 'blockquote'}
              <blockquote>
                {#each block.children ?? [] as child}
                  <p>{child.text}</p>
                {/each}
              </blockquote>
            {:else}
              <p>
                {#each block.children ?? [] as child}
                  <span>{child.text}</span>
                {/each}
              </p>
            {/if}
          {:else if isImageBlock(block) && block.url}
            <figure class="overflow-hidden rounded-2xl">
              <img
                src={block.url}
                alt={block.alt ?? post.title}
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
        <h2 class="text-2xl font-semibold text-slate-900">Innholdet kommer snart</h2>
        <p class="text-slate-600">Vi jobber med å publisere innholdet for denne artikkelen.</p>
      </div>
    {/if}

    <div class="mt-16 border-t border-slate-200 pt-8">
      <a
        href="/blog"
        class="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-[#0f1f16]"
      >
        ← Tilbake til alle artikler
      </a>
    </div>
  </main>
</div>

