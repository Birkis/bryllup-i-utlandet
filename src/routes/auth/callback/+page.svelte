<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createBrowserClient } from '$lib/supabase-client';

	let status = $state<'loading' | 'success' | 'error'>('loading');
	let errorMessage = $state('');

	onMount(async () => {
		const supabase = createBrowserClient();

		// Get the hash from the URL (contains the access_token, refresh_token, etc.)
		const hashParams = new URLSearchParams(window.location.hash.substring(1));
		const accessToken = hashParams.get('access_token');
		const refreshToken = hashParams.get('refresh_token');
		const type = hashParams.get('type');

		if (accessToken && refreshToken) {
			try {
				// Set the session using the tokens from the URL
				const { error } = await supabase.auth.setSession({
					access_token: accessToken,
					refresh_token: refreshToken
				});

				if (error) {
					console.error('Error setting session:', error);
					status = 'error';
					errorMessage = error.message;
					return;
				}

				status = 'success';

				// If this is a password recovery, redirect to update password page
				if (type === 'recovery') {
					setTimeout(() => {
						goto('/auth/update-password');
					}, 1000);
				} else {
					// Otherwise redirect to admin
					setTimeout(() => {
						goto('/admin');
					}, 1000);
				}
			} catch (err) {
				console.error('Unexpected error:', err);
				status = 'error';
				errorMessage = 'En uventet feil oppstod';
			}
		} else {
			// Try to get existing session
			const {
				data: { session }
			} = await supabase.auth.getSession();

			if (session) {
				status = 'success';
				setTimeout(() => {
					goto('/admin');
				}, 1000);
			} else {
				status = 'error';
				errorMessage = 'Ingen gyldige autentiseringstokens funnet';
			}
		}
	});
</script>

<svelte:head>
	<title>Autentiserer... | Bryllup i Utlandet</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-muted/30 px-4">
	<div class="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
		{#if status === 'loading'}
			<div class="mb-4 flex justify-center">
				<div class="size-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
			</div>
			<h1 class="text-xl font-semibold">Autentiserer...</h1>
			<p class="mt-2 text-sm text-muted-foreground">Vennligst vent mens vi logger deg inn</p>
		{:else if status === 'success'}
			<div class="mb-4 flex justify-center">
				<svg
					class="size-12 text-green-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					></path>
				</svg>
			</div>
			<h1 class="text-xl font-semibold">Innlogging vellykket!</h1>
			<p class="mt-2 text-sm text-muted-foreground">Omdirigerer...</p>
		{:else if status === 'error'}
			<div class="mb-4 flex justify-center">
				<svg class="size-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					></path>
				</svg>
			</div>
			<h1 class="text-xl font-semibold">Autentisering feilet</h1>
			<p class="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
			<a
				href="/login"
				class="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			>
				Gå til innlogging
			</a>
		{/if}
	</div>
</div>

