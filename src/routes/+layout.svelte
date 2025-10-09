<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
 import Navbar from '$lib/components/layout/Navbar.svelte';
 import Footer from '$lib/components/layout/Footer.svelte';
 import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="top-center" />
<Navbar />
{@render children?.()}
<Footer />
