<script lang="ts">
  const links = [
    { href: "/kontakt", label: "Kontakt" },
  ];
</script>

<nav class="bg-[#0f1f16] text-white">
  <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
    <a href="/" class="text-lg font-semibold tracking-tight">Bryllupspakken</a>
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
