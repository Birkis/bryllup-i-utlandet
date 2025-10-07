<script lang="ts">
	import { ChevronLeft, ChevronRight, Calendar } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	interface MonthPickerProps {
		value?: string;
		onValueChange?: (value: string) => void;
		placeholder?: string;
		class?: string;
	}

	let {
		value = $bindable(''),
		onValueChange,
		placeholder = 'Velg måned',
		class: className
	}: MonthPickerProps = $props();

	let isOpen = $state(false);
	let selectedYear = $state(new Date().getFullYear());
	let selectedMonth = $state<number | null>(null);

	const months = [
		'Januar',
		'Februar',
		'Mars',
		'April',
		'Mai',
		'Juni',
		'Juli',
		'August',
		'September',
		'Oktober',
		'November',
		'Desember'
	];

	// Parse initial value if provided
	$effect(() => {
		if (value && value.includes('-')) {
			const [year, month] = value.split('-').map(Number);
			if (year && month) {
				selectedYear = year;
				selectedMonth = month - 1; // Convert to 0-indexed
			}
		}
	});

	const formattedValue = $derived(
		selectedMonth !== null ? `${months[selectedMonth]} ${selectedYear}` : ''
	);

	function handleMonthSelect(monthIndex: number) {
		selectedMonth = monthIndex;
		const newValue = `${selectedYear}-${String(monthIndex + 1).padStart(2, '0')}`;
		value = newValue;
		onValueChange?.(newValue);
		isOpen = false;
	}

	function previousYear() {
		selectedYear--;
	}

	function nextYear() {
		selectedYear++;
	}

	function togglePicker() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.month-picker-container')) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

<div class="month-picker-container relative">
	<button
		type="button"
		class={cn(
			'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		onclick={togglePicker}
	>
		<span class={cn('flex items-center gap-2', !formattedValue && 'text-muted-foreground')}>
			<Calendar class="size-4" />
			{formattedValue || placeholder}
		</span>
		<ChevronRight
			class={cn('size-4 transition-transform', isOpen && 'rotate-90')}
			aria-hidden="true"
		/>
	</button>

	{#if isOpen}
		<div
			class="absolute left-0 top-full z-50 mt-2 w-full min-w-[280px] rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-lg"
		>
			<!-- Year selector -->
			<div class="mb-4 flex items-center justify-between">
				<button
					type="button"
					onclick={previousYear}
					class="rounded-md p-1 hover:bg-accent hover:text-accent-foreground"
					aria-label="Forrige år"
				>
					<ChevronLeft class="size-5" />
				</button>
				<span class="text-sm font-semibold">{selectedYear}</span>
				<button
					type="button"
					onclick={nextYear}
					class="rounded-md p-1 hover:bg-accent hover:text-accent-foreground"
					aria-label="Neste år"
				>
					<ChevronRight class="size-5" />
				</button>
			</div>

			<!-- Month grid -->
			<div class="grid grid-cols-3 gap-2">
				{#each months as month, index}
					<button
						type="button"
						onclick={() => handleMonthSelect(index)}
						class={cn(
							'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
							selectedMonth === index &&
								selectedYear === new Date(value).getFullYear() &&
								'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
						)}
					>
						{month.slice(0, 3)}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

