<script lang="ts">
  import { format } from 'date-fns';
  import { nb } from 'date-fns/locale';
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '$lib/components/ui/card';
  import type { PageProps } from './$types';
  import type { BlogPostListItem } from '$lib/types/blog-post';

  let { data }: PageProps = $props();

  const posts = data.posts ?? [] satisfies BlogPostListItem[];

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.valueOf())) return date;
    return format(parsed, "d. MMMM yyyy", { locale: nb });
  };
</script>

<svelte:head>
  <title>Blogg | Bryllup i utlandet</title>
  <meta
    name="description"
    content="Les historier, tips og inspirasjon om bryllup i utlandet. Finn artikler om destinasjoner, planlegging og reelle bryllupsopplevelser."
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
        <span class="text-sm uppercase tracking-[0.3em] text-white/60">Blogg</span>
        <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">Historier og inspirasjon</h1>
        <p class="max-w-2xl text-base text-white/70">
          Oppdag tips, destinasjonsguider og reelle bryllupshistorier fra par som har feiret sin store dag i utlandet.
        </p>
      </div>
    </div>
  </section>

  <main class="mx-auto w-full max-w-6xl px-6 py-16">
    {#if posts.length}
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {#each posts as post (post.id)}
          <a href={`/blog/${post.slug}`} class="group">
            <Card class="h-full border-slate-200 transition hover:shadow-lg">
              {#if post.featuredImage?.url}
                <div class="overflow-hidden rounded-t-lg">
                  <img
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt ?? post.title}
                    class="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              {/if}
              <CardHeader>
                <CardTitle class="text-lg group-hover:text-[#0f1f16]">{post.title}</CardTitle>
                <CardDescription class="text-sm text-slate-500">
                  {formatDate(post.publishedAt)} · {post.author}
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <p class="text-sm text-slate-600">{post.excerpt}</p>
                {#if post.tags?.length}
                  <div class="flex flex-wrap gap-2">
                    {#each post.tags as tag}
                      <span class="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        {tag}
                      </span>
                    {/each}
                  </div>
                {/if}
              </CardContent>
            </Card>
          </a>
        {/each}
      </div>
    {:else}
      <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
        <h2 class="text-lg font-semibold text-slate-900">Ingen blogginnlegg tilgjengelig</h2>
        <p class="mt-2 text-sm text-slate-600">
          Vi jobber med å publisere innhold. Kom tilbake snart!
        </p>
      </div>
    {/if}
  </main>
</div>

