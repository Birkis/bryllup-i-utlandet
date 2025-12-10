<script lang="ts">
	import { Calendar } from "@lucide/svelte";
	import { cn } from "$lib/utils";

	interface DatePickerProps {
		value?: string;
		onValueChange?: (value: string) => void;
		placeholder?: string;
		class?: string;
		min?: string;
	}

	let {
		value = $bindable(""),
		onValueChange,
		placeholder = "Velg dato",
		class: className,
		min
	}: DatePickerProps = $props();

	// Format the display value
	const formattedValue = $derived.by(() => {
		if (!value || !value.includes("-")) return "";
		const [year, month, day] = value.split("-").map(Number);
		if (!year || !month || !day) return "";
		const date = new Date(year, month - 1, day);
		return date.toLocaleDateString("nb-NO", {
			day: "numeric",
			month: "long",
			year: "numeric"
		});
	});

	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		onValueChange?.(target.value);
	}

	// Calculate min date (today) if not provided
	const minDate = $derived.by(() => {
		if (min) return min;
		const today = new Date();
		return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
	});
</script>

<div class="relative">
	<div
		class={cn(
			"flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
			className
		)}
	>
		<Calendar class="size-4 shrink-0 text-muted-foreground" />
		<div class="relative flex-1 min-h-[1.5rem]">
			<input
				type="date"
				{value}
				min={minDate}
				onchange={handleChange}
				class="absolute inset-0 w-full h-full cursor-pointer text-transparent bg-transparent border-none outline-none [color-scheme:light] [&::-webkit-datetime-edit]:invisible [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
			/>
			<span class={cn("pointer-events-none", !formattedValue && "text-muted-foreground")}>
				{formattedValue || placeholder}
			</span>
		</div>
	</div>
</div>
