<script lang="ts">
  import { MapPin, FileText, Mail, Home, ArrowLeft } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  export let links = [
    { href: "/", label: "Hjem", icon: Home },
    { href: "/destinations", label: "Destinasjoner", icon: MapPin },
    { href: "/blog", label: "Blogg", icon: FileText },
    { href: "/kontakt", label: "Kontakt", icon: Mail, isCTA: true },
  ];

  export let brandLabel = "Bryllupspakken";
  export let brandHref = "/";

  // Check if current path matches the link
  function isActive(href: string, currentPath: string): boolean {
    if (href === '/') return currentPath === '/';
    return currentPath.startsWith(href);
  }

  // Handle back navigation
  function handleBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      goto('/');
    }
  }
</script>

<!-- Desktop Navigation -->
<nav class="hidden bg-[#0f1f16] text-white md:block">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href={brandHref} class="text-lg font-semibold tracking-tight">{brandLabel}</a>
    <ul class="flex items-center gap-6 text-sm font-medium">
      {#each links as link}
        <li>
          <a
            href={link.href}
            class="transition-colors hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >{link.label}</a
          >
        </li>
      {/each}
    </ul>
  </div>
</nav>

<!-- Mobile Header -->
<header class="bg-[#0f1f16] text-white md:hidden">
  <div class="flex items-center justify-between px-4 py-4">
    {#if $page.url.pathname !== '/'}
      <button
        onclick={handleBack}
        class="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white/70"
        aria-label="Tilbake"
      >
        <ArrowLeft size={20} />
        <span>Tilbake</span>
      </button>
    {:else}
      <div></div>
    {/if}
    <a href={brandHref} class="text-lg font-semibold tracking-tight">{brandLabel}</a>
    <div class="w-20"></div> <!-- Spacer for centering -->
  </div>
</header>

<!-- Mobile Floating Navigation -->
<nav class="fixed inset-x-0 bottom-0 z-50 md:hidden">
  <div class="mx-auto max-w-md px-4 pb-4">
    <div
      class="flex items-center justify-around rounded-3xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm"
    >
      {#each links as link}
        {@const active = isActive(link.href, $page.url.pathname)}
        {@const isCTA = link.isCTA === true}
        <a
          href={link.href}
          class="flex flex-col items-center gap-1 transition-all duration-200"
        >
          <div
            class="rounded-full p-2 transition-all {active && !isCTA
              ? 'bg-[#0f1f16]/10 text-[#0f1f16]'
              : isCTA
                ? 'bg-[#0f1f16] text-white shadow-md'
                : 'text-gray-500 hover:bg-gray-100 hover:text-[#0f1f16]'}"
          >
            <svelte:component this={link.icon} size={20} strokeWidth={2} />
          </div>
          <span class="text-xs font-medium {isCTA ? 'text-[#0f1f16] font-semibold' : active ? 'text-[#0f1f16]' : 'text-gray-500'}">{link.label}</span>
        </a>
      {/each}
    </div>
  </div>
</nav>

<!-- Mobile spacer to prevent content from being hidden behind floating nav -->
<div class="md:hidden" aria-hidden="true"></div>

