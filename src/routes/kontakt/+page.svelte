<script lang="ts">
    import type { PageProps } from './$types';
    import Card from '$lib/components/ui/card/card.svelte';
    import CardContent from '$lib/components/ui/card/card-content.svelte';
    import CardFooter from '$lib/components/ui/card/card-footer.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Button from '$lib/components/ui/button/button.svelte';

    let { data }: PageProps = $props();

    const budgets = [
        'Under 100 000 kr',
        '100 000 - 200 000 kr',
        '200 000 - 300 000 kr',
        'Over 300 000 kr'
    ];

    const guests = ['Under 30', '30-50', '50-80', '80+'];

    const destinations = [
        'Italia',
        'Spania',
        'Frankrike',
        'Hellas',
        'Portugal',
        'Annet'
    ];

    let form = {
        name: '',
        phone: '',
        email: '',
        location: '',
        budget: '',
        guestCount: '',
        weddingDate: '',
        destination: '',
        message: '',
        subscribe: false
    };

    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
    };
</script>

<svelte:head>
    <title>Kontakt | Bryllup i Utlandet</title>
    <meta
        name="description"
        content="Fyll ut kontaktskjemaet for å komme i dialog med våre bryllupsplanleggere om bryllup i utlandet."
    />
</svelte:head>

<section class="bg-muted/40 py-16">
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
        <header class="mx-auto max-w-2xl text-center">
            <h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Er du interessert i å gifte deg i Bryllup i utlandet?
            </h1>
            <p class="mt-4 text-base text-muted-foreground sm:text-lg">
                Fyll inn informasjonen nedenfor og en av våre bryllupsplanleggere vil ta kontakt med deg.
            </p>
        </header>

        <Card class="border-0 shadow-lg">
            <form class="flex flex-col gap-8" on:submit|preventDefault={handleSubmit}>
                <CardContent class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-muted-foreground" for="name">Ditt navn</label>
                        <Input
                            id="name"
                            name="name"
                            bind:value={form.name}
                            placeholder="Ditt navn"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-muted-foreground" for="budget">Ca budsjett</label>
                        <div class="relative">
                            <select
                                id="budget"
                                name="budget"
                                bind:value={form.budget}
                                class="ring-offset-background focus-visible:ring-ring dark:bg-input/30 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border-input bg-background placeholder:text-muted-foreground shadow-xs flex h-10 w-full min-w-0 appearance-none rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                required
                            >
                                <option value="" disabled selected>Velg budsjett</option>
                                {#each budgets as option}
                                    <option value={option}>{option}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-muted-foreground" for="phone">Telefonnummer</label>
                        <Input
                            id="phone"
                            name="phone"
                            bind:value={form.phone}
                            placeholder="Telefonnummer"
                            type="tel"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-muted-foreground" for="guestCount">Ca gjester</label>
                        <div class="relative">
                            <select
                                id="guestCount"
                                name="guestCount"
                                bind:value={form.guestCount}
                                class="ring-offset-background focus-visible:ring-ring dark:bg-input/30 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border-input bg-background placeholder:text-muted-foreground shadow-xs flex h-10 w-full min-w-0 appearance-none rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                required
                            >
                                <option value="" disabled selected>Velg antall gjester</option>
                                {#each guests as option}
                                    <option value={option}>{option}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-muted-foreground" for="email">E-postadresse</label>
                        <Input
                            id="email"
                            name="email"
                            bind:value={form.email}
                            placeholder="E-postadresse"
                            type="email"
                            required
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-muted-foreground" for="weddingDate">Ca dato</label>
                        <Input
                            id="weddingDate"
                            name="weddingDate"
                            bind:value={form.weddingDate}
                            placeholder="dd.mm.åååå"
                            type="text"
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-muted-foreground" for="location">Bosted</label>
                        <Input
                            id="location"
                            name="location"
                            bind:value={form.location}
                            placeholder="Bosted"
                            type="text"
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-muted-foreground" for="destination">Destinasjon</label>
                        <div class="relative">
                            <select
                                id="destination"
                                name="destination"
                                bind:value={form.destination}
                                class="ring-offset-background focus-visible:ring-ring dark:bg-input/30 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border-input bg-background placeholder:text-muted-foreground shadow-xs flex h-10 w-full min-w-0 appearance-none rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            >
                                <option value="" disabled selected>Velg destinasjon</option>
                                {#each destinations as option}
                                    <option value={option}>{option}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </CardContent>

                <CardContent class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-muted-foreground" for="message"
                            >Tilleggsinformasjon/Spørsmål</label
                        >
                        <textarea
                            id="message"
                            name="message"
                            bind:value={form.message}
                            placeholder="Tilleggsinformasjon/Spørsmål"
                            rows="4"
                            class="ring-offset-background focus-visible:ring-ring dark:bg-input/30 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border-input bg-background placeholder:text-muted-foreground shadow-xs w-full rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        ></textarea>
                    </div>

                    <div class="flex items-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/60 p-4">
                        <div class="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background">
                            <span aria-hidden="true" class="text-sm font-semibold text-muted-foreground">re</span>
                        </div>
                        <div class="flex flex-1 flex-col">
                            <span class="text-sm font-medium text-muted-foreground">Bekreft at du ikke er en robot</span>
                            <span class="text-xs text-muted-foreground/80">reCAPTCHA implementeres her</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter class="flex justify-end">
                    <Button type="submit" class="bg-primary px-10 py-6 text-lg font-semibold">
                        Send
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
</section>