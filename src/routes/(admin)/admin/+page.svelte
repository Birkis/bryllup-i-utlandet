<script lang="ts">
	import type { PageProps } from './$types';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import {
		Mail,
		Phone,
		Calendar,
		MapPin,
		Users,
		Search,
		ChevronLeft,
		ChevronRight,
		ArrowUpDown,
		ChevronDown,
		LogOut
	} from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import type { ContactRequestStage } from '$lib/types/contact-request';

	let { data, form }: PageProps = $props();

	const contactRequests = data.contactRequests || [];
	const pagination = data.pagination || { page: 1, totalPages: 1, totalItems: 0, itemsPerPage: 20 };
	const filters = data.filters || { search: '', stage: '', sortBy: 'created_at', sortOrder: 'desc' };

	let searchValue = $state(filters.search);
	let stageFilter = $state(filters.stage);
	let sortBy = $state(filters.sortBy);
	let sortOrder = $state(filters.sortOrder);

	const stages: { value: ContactRequestStage | ''; label: string }[] = [
		{ value: '', label: 'Alle stadier' },
		{ value: 'new', label: 'Ny' },
		{ value: 'contacted', label: 'Kontaktet' },
		{ value: 'qualified', label: 'Kvalifisert' },
		{ value: 'won', label: 'Vunnet' },
		{ value: 'lost', label: 'Tapt' }
	];

	const sortOptions: { value: string; label: string }[] = [
		{ value: 'created_at', label: 'Dato' },
		{ value: 'name', label: 'Navn' },
		{ value: 'email', label: 'E-post' },
		{ value: 'stage', label: 'Stadium' }
	];

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('no-NO', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(date);
	};

	const getStageColor = (stage: string) => {
		switch (stage) {
			case 'new':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
			case 'contacted':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
			case 'qualified':
				return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
			case 'won':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'lost':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
		}
	};

	const getStageLabel = (stage: string) => {
		return stages.find((s) => s.value === stage)?.label || stage;
	};

	const updateFilters = () => {
		const params = new URLSearchParams();
		if (searchValue) params.set('search', searchValue);
		if (stageFilter) params.set('stage', stageFilter);
		if (sortBy !== 'created_at') params.set('sortBy', sortBy);
		if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
		params.set('page', '1'); // Reset to first page when filters change

		goto(`/admin?${params.toString()}`, { invalidateAll: true });
	};

	const handleSearch = () => {
		updateFilters();
	};

	const handleStageFilter = (value: string) => {
		stageFilter = value;
		updateFilters();
	};

	const handleSort = (newSortBy: string) => {
		if (sortBy === newSortBy) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = newSortBy;
			sortOrder = 'desc';
		}
		updateFilters();
	};

	const goToPage = (newPage: number) => {
		const params = new URLSearchParams(page.url.searchParams);
		params.set('page', newPage.toString());
		goto(`/admin?${params.toString()}`, { invalidateAll: true });
	};

	const getPageNumbers = () => {
		const pages: (number | 'ellipsis')[] = [];
		const total = pagination.totalPages;
		const current = pagination.page;

		if (total <= 7) {
			// Show all pages if 7 or fewer
			for (let i = 1; i <= total; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (current > 3) {
				pages.push('ellipsis');
			}

			// Show pages around current
			const start = Math.max(2, current - 1);
			const end = Math.min(total - 1, current + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (current < total - 2) {
				pages.push('ellipsis');
			}

			// Always show last page
			pages.push(total);
		}

		return pages;
	};

	const handleStageUpdate = (id: string) => {
		return async ({ result, update, formData }: { result: any; update: () => Promise<void>; formData: FormData }) => {
			if (result.type === 'success') {
				const newStage = formData.get('stage') as ContactRequestStage;
				toast.success('Stadium oppdatert', {
					description: `Status endret til ${getStageLabel(newStage)}`
				});
				await update();
			} else if (result.type === 'failure') {
				toast.error('Kunne ikke oppdatere stadium', {
					description: result.data?.error || 'Ukjent feil'
				});
			}
		};
	};
</script>

<svelte:head>
	<title>Admin - Kontaktforesp?rsler | Bryllup i Utlandet</title>
</svelte:head>

<section class="container mx-auto py-8 px-6">
	<header class="mb-8 flex items-start justify-between">
		<div>
			<h1 class="text-3xl font-semibold tracking-tight text-foreground">Kontaktforesp?rsler</h1>
			<p class="mt-2 text-muted-foreground">
				Viser {contactRequests.length} av {pagination.totalItems} foresp?rsel{pagination.totalItems !== 1
					? 'er'
					: ''}
			</p>
		</div>
		<form method="post" action="/logout">
			<Button type="submit" variant="outline" size="sm">
				<LogOut class="mr-2 size-4" />
				Logg ut
			</Button>
		</form>
	</header>

	<!-- Filters and Search -->
	<Card class="mb-6">
		<CardContent class="pt-6">
			<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<!-- Search -->
				<div class="relative flex-1">
					<Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						bind:value={searchValue}
						placeholder="S?k etter navn, e-post, destinasjon eller telefon..."
						class="pl-10"
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								handleSearch();
							}
						}}
					/>
				</div>

				<!-- Stage Filter -->
				<div class="flex items-center gap-2">
					<label class="text-sm font-medium text-muted-foreground" for="stage-filter"
						>Filtrer:</label
					>
					<select
						id="stage-filter"
						bind:value={stageFilter}
						onchange={() => handleStageFilter(stageFilter)}
						class="ring-offset-background dark:bg-input/30 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border-input bg-background placeholder:text-muted-foreground shadow-xs rounded-md border px-3 py-2 text-sm outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#each stages as stage}
							<option value={stage.value}>{stage.label}</option>
						{/each}
					</select>
				</div>

				<!-- Sort -->
				<div class="flex items-center gap-2">
					<label class="text-sm font-medium text-muted-foreground" for="sort-select"
						>Sorter:</label
					>
					<div class="flex items-center gap-1">
						<select
							id="sort-select"
							bind:value={sortBy}
							onchange={() => handleSort(sortBy)}
							class="ring-offset-background dark:bg-input/30 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border-input bg-background placeholder:text-muted-foreground shadow-xs rounded-md border px-3 py-2 text-sm outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#each sortOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
						<Button
							variant="outline"
							size="sm"
							onclick={() => handleSort(sortBy)}
							class="h-9 w-9 p-0"
							title="Endre sorteringsrekkef?lge"
						>
							<ArrowUpDown class="size-4" />
						</Button>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>

	{#if contactRequests.length === 0}
		<Card>
			<CardContent class="py-12 text-center">
				<p class="text-muted-foreground">Ingen kontaktforesp?rsler funnet.</p>
			</CardContent>
		</Card>
	{:else}
		<div class="space-y-4">
			{#each contactRequests as request}
				<Card>
					<CardHeader>
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<CardTitle class="text-xl">{request.name}</CardTitle>
								<div class="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
									<div class="flex items-center gap-2">
										<Mail class="size-4" />
										<a
											href="mailto:{request.email}"
											class="hover:text-foreground hover:underline"
										>
											{request.email}
										</a>
									</div>
									{#if request.phone}
										<div class="flex items-center gap-2">
											<Phone class="size-4" />
											<a
												href="tel:{request.phone}"
												class="hover:text-foreground hover:underline"
											>
												{request.phone}
											</a>
										</div>
									{/if}
								</div>
							</div>
							<div class="flex flex-col items-end gap-2">
								<form
									method="post"
									action="?/updateStage"
									use:enhance={handleStageUpdate(request.id)}
								>
									<input type="hidden" name="id" value={request.id} />
									<select
										name="stage"
										value={request.stage}
										onchange={(e) => {
											const form = e.currentTarget.closest('form');
											if (form) {
												form.requestSubmit();
											}
										}}
										class="ring-offset-background dark:bg-input/30 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border-input bg-background placeholder:text-muted-foreground shadow-xs rounded-full border px-3 py-1 text-xs font-medium outline-none transition-[color,box-shadow] {getStageColor(request.stage)}"
									>
										<option value="new">Ny</option>
										<option value="contacted">Kontaktet</option>
										<option value="qualified">Kvalifisert</option>
										<option value="won">Vunnet</option>
										<option value="lost">Tapt</option>
									</select>
								</form>
								<span class="text-xs text-muted-foreground">
									{formatDate(request.createdAt)}
								</span>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div class="grid gap-4 md:grid-cols-2">
							{#if request.weddingDate}
								<div class="flex items-center gap-2 text-sm">
									<Calendar class="size-4 text-muted-foreground" />
									<span class="text-muted-foreground">Bryllupsdato:</span>
									<span class="font-medium">{request.weddingDate}</span>
								</div>
							{/if}
							{#if request.destination}
								<div class="flex items-center gap-2 text-sm">
									<MapPin class="size-4 text-muted-foreground" />
									<span class="text-muted-foreground">Destinasjon:</span>
									<span class="font-medium">{request.destination}</span>
								</div>
							{/if}
							{#if request.guestCount}
								<div class="flex items-center gap-2 text-sm">
									<Users class="size-4 text-muted-foreground" />
									<span class="text-muted-foreground">Antall gjester:</span>
									<span class="font-medium">{request.guestCount}</span>
								</div>
							{/if}
							{#if request.services && request.services.length > 0}
								<div class="text-sm">
									<span class="text-muted-foreground">Tjenester:</span>
									<div class="mt-1 flex flex-wrap gap-2">
										{#each request.services as service}
											<span class="rounded-md bg-muted px-2 py-1 text-xs font-medium">
												{service}
											</span>
										{/each}
									</div>
								</div>
							{/if}
						</div>
						{#if request.message}
							<div class="mt-4 rounded-md bg-muted/50 p-4">
								<p class="text-sm text-muted-foreground">Melding:</p>
								<p class="mt-1 whitespace-pre-wrap text-sm">{request.message}</p>
							</div>
						{/if}
						{#if request.tags && request.tags.length > 0}
							<div class="mt-4 flex flex-wrap gap-2">
								{#each request.tags as tag}
									<span class="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
										{tag}
									</span>
								{/each}
							</div>
						{/if}
					</CardContent>
				</Card>
			{/each}
		</div>

		<!-- Pagination -->
		{#if pagination.totalPages > 1}
			<div class="mt-8 flex items-center justify-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onclick={() => goToPage(pagination.page - 1)}
					disabled={pagination.page === 1}
				>
					<ChevronLeft class="size-4" />
					<span class="sr-only">Forrige side</span>
				</Button>

				<div class="flex items-center gap-1">
					{#each getPageNumbers() as pageNum}
						{#if pageNum === 'ellipsis'}
							<span class="px-2 text-muted-foreground">...</span>
						{:else}
							<Button
								variant={pageNum === pagination.page ? 'default' : 'outline'}
								size="sm"
								onclick={() => goToPage(pageNum)}
							>
								{pageNum}
							</Button>
						{/if}
					{/each}
				</div>

				<Button
					variant="outline"
					size="sm"
					onclick={() => goToPage(pagination.page + 1)}
					disabled={pagination.page === pagination.totalPages}
				>
					<ChevronRight class="size-4" />
					<span class="sr-only">Neste side</span>
				</Button>
			</div>
		{/if}
	{/if}
</section>
