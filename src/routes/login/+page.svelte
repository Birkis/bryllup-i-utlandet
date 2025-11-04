<script lang="ts">
	import { enhance } from '$app/forms';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Mail, Lock } from 'lucide-svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Logg inn | Bryllup i Utlandet</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
	<Card class="w-full max-w-md">
		<CardHeader class="space-y-1">
			<CardTitle class="text-2xl font-semibold">Logg inn</CardTitle>
			<CardDescription>Logg inn med e-post og passord for å få tilgang til admin</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				method="post"
				action="?/login"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
			>
				<div class="space-y-4">
					{#if form?.error}
						<div
							class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
						>
							{form.error}
						</div>
					{/if}

					<div class="space-y-2">
						<label for="email" class="text-sm font-medium leading-none">E-post</label>
						<div class="relative">
							<Mail
								class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="din@epost.no"
								required
								autocomplete="email"
								value={form?.email || ''}
								class="pl-10"
							/>
						</div>
					</div>

					<div class="space-y-2">
						<label for="password" class="text-sm font-medium leading-none">Passord</label>
						<div class="relative">
							<Lock
								class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
							/>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								required
								autocomplete="current-password"
								class="pl-10"
							/>
						</div>
					</div>

					<Button type="submit" class="w-full" disabled={isSubmitting}>
						{isSubmitting ? 'Logger inn...' : 'Logg inn'}
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>

