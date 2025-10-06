<script lang="ts">
    import type { PageProps } from './$types';
    import Card from '$lib/components/ui/card/card.svelte';
    import CardContent from '$lib/components/ui/card/card-content.svelte';
    import CardFooter from '$lib/components/ui/card/card-footer.svelte';
    import Input from '$lib/components/ui/input/input.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import { Clock, Mail, MapPin, Phone } from '@lucide/svelte';
    import { CONTACT_SERVICE_OPTIONS, type ContactServiceOption } from '$lib/config/contact';
    import { enhance } from '$app/forms';

    let { data, form: actionData }: PageProps = $props();

    const serviceOptions = [...(data.serviceOptions ?? CONTACT_SERVICE_OPTIONS)] as ContactServiceOption[];

    let form = $state({
        name: (actionData && 'values' in actionData ? actionData.values?.name : '') ?? '',
        email: (actionData && 'values' in actionData ? actionData.values?.email : '') ?? '',
        phone: (actionData && 'values' in actionData ? actionData.values?.phone : '') ?? '',
        weddingDate: (actionData && 'values' in actionData ? actionData.values?.weddingDate : '') ?? '',
        destination: (actionData && 'values' in actionData ? actionData.values?.destination : '') ?? '',
        guestCount: (actionData && 'values' in actionData ? actionData.values?.guestCount : '') ?? '',
        services: (actionData && 'values' in actionData ? actionData.values?.services : []) ?? ([] as string[]),
        message: (actionData && 'values' in actionData ? actionData.values?.message : '') ?? '',
        subscribe: (actionData && 'values' in actionData ? actionData.values?.subscribe : false) ?? false
    });

    const errors = $derived((actionData && 'errors' in actionData ? actionData.errors : {}) ?? {});
    const success = $derived((actionData && 'success' in actionData ? actionData.success : false) ?? false);

    const handleEnhance: import('@sveltejs/kit').SubmitFunction = () => {
        return async ({ result, update }) => {
            if (result.type === 'success') {
                // Clear the form on success
                form = {
                    name: '',
                    email: '',
                    phone: '',
                    weddingDate: '',
                    destination: '',
                    guestCount: '',
                    services: [],
                    message: '',
                    subscribe: false
                };
            }
            
            // Call default update behavior
            await update();
        };
    };

    type ErrorRecord = Record<string, string> & { _form?: string };
</script>

<svelte:head>
    <title>Kontakt | Bryllup i Utlandet</title>
    <meta
        name="description"
        content="Fyll ut kontaktskjemaet for å komme i dialog med våre bryllupsplanleggere om bryllup i utlandet."
    />
</svelte:head>

<section class="bg-muted/40 py-16">
    <div class="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div class="flex flex-col gap-8">
            <header class="max-w-xl">
                <h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Send oss en melding
                </h1>
                <p class="mt-4 text-base text-muted-foreground sm:text-lg">
                    Fyll inn detaljene nedenfor så vil en av våre bryllupsplanleggere ta kontakt med deg.
                </p>
            </header>

            <Card class="border-0 shadow-lg">
                <form class="flex flex-col gap-8" method="post" use:enhance={handleEnhance}>
                    <CardContent class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-muted-foreground" for="name">Navn *</label>
                            <Input
                                id="name"
                                name="name"
                                bind:value={form.name}
                                placeholder="Ditt fulle navn"
                                required
                            />
                            {#if (errors as ErrorRecord).name}
                                <span class="text-sm text-destructive">{(errors as ErrorRecord).name}</span>
                            {/if}
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-muted-foreground" for="email">E-post *</label>
                            <Input
                                id="email"
                                name="email"
                                bind:value={form.email}
                                placeholder="din@epost.no"
                                type="email"
                                required
                            />
                            {#if (errors as ErrorRecord).email}
                                <span class="text-sm text-destructive">{(errors as ErrorRecord).email}</span>
                            {/if}
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-muted-foreground" for="phone">Telefon</label>
                            <Input
                                id="phone"
                                name="phone"
                                bind:value={form.phone}
                                placeholder="+47 123 45 678"
                                type="tel"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-muted-foreground" for="weddingDate"
                                >Ønsket bryllupsdato</label
                            >
                            <Input
                                id="weddingDate"
                                name="weddingDate"
                                bind:value={form.weddingDate}
                                placeholder="dd.mm.åååå"
                                type="text"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-muted-foreground" for="destination"
                                >Ønsket sted/destinasjon</label
                            >
                            <Input
                                id="destination"
                                name="destination"
                                bind:value={form.destination}
                                placeholder="f.eks. Oslo, Hellas, Kroatia"
                                type="text"
                            />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-muted-foreground" for="guestCount"
                                >Antall gjester (ca.)</label
                            >
                            <Input
                                id="guestCount"
                                name="guestCount"
                                bind:value={form.guestCount}
                                placeholder="50"
                                type="number"
                                min="0"
                            />
                            {#if (errors as ErrorRecord).guestCount}
                                <span class="text-sm text-destructive">{(errors as ErrorRecord).guestCount}</span>
                            {/if}
                        </div>
                    </CardContent>

                    <CardContent class="flex flex-col gap-6">
                        <div class="flex flex-col gap-3">
                            <span class="text-sm font-medium text-muted-foreground"
                                >Hvilke tjenester er du interessert i? (velg flere)</span
                            >
                            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {#each serviceOptions as option}
                                    <label class="flex items-center gap-3 rounded-lg border border-muted/40 bg-background/60 px-3 py-2 text-sm font-medium text-foreground">
                                        <input
                                            type="checkbox"
                                            class="size-4 rounded border-muted-foreground/50 text-primary focus-visible:ring-primary"
                                            value={option}
                                            checked={form.services.includes(option)}
                                            onchange={(event) => {
                                                const { checked } = event.currentTarget as HTMLInputElement;
                                                form.services = checked
                                                    ? [...form.services, option]
                                                    : form.services.filter((service: string) => service !== option);
                                            }}
                                            name="services"
                                        />
                                        <span class="select-none">{option}</span>
                                    </label>
                                {/each}
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-medium text-muted-foreground" for="message"
                                >Fortell oss om ditt drømmebryllup</label
                            >
                            <textarea
                                id="message"
                                name="message"
                                bind:value={form.message}
                                placeholder="Beskriv deres drømmer, ønsker og eventuelle spesielle behov..."
                                rows="6"
                                class="ring-offset-background dark:bg-input/30 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border-input bg-background placeholder:text-muted-foreground shadow-xs w-full rounded-md border px-3 py-2 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            ></textarea>
                        </div>

                        <label class="flex items-center gap-3 text-sm text-muted-foreground">
                            <input
                                type="checkbox"
                                name="subscribe"
                                class="size-4 rounded border-muted-foreground/50 text-primary focus-visible:ring-primary"
                                bind:checked={form.subscribe}
                            />
                            <span>Motta nyheter og inspirasjon på e-post</span>
                        </label>

                        {#if (errors as ErrorRecord)._form}
                            <div class="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                {(errors as ErrorRecord)._form}
                            </div>
                        {/if}

                        {#if success}
                            <div class="rounded-md bg-primary/10 px-4 py-3 text-sm text-primary">
                                Takk for forespørselen! Vi kontakter dere snart.
                            </div>
                        {/if}
                    </CardContent>

                    <CardFooter class="flex justify-end">
                        <Button type="submit" class="bg-primary px-10 py-6 text-lg font-semibold">
                            Send forespørsel
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>

        <aside class="flex flex-col gap-6">
            <div class="rounded-3xl border border-white/40 bg-white/80 p-8 shadow-lg shadow-primary/10 backdrop-blur">
                <h2 class="text-2xl font-semibold text-foreground">Kom i kontakt</h2>
                <p class="mt-2 text-sm text-muted-foreground">
                    Ring eller send e-post, så finner vi tidspunkt for en uforpliktende prat.
                </p>

                <div class="mt-6 space-y-6 text-sm">
                    <div class="flex gap-4">
                        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Phone class="size-5" aria-hidden="true" />
                        </span>
                        <div>
                            <span class="font-medium text-foreground">Telefon</span>
                            <p class="text-muted-foreground">(+47) 940 82 222</p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Mail class="size-5" aria-hidden="true" />
                        </span>
                        <div>
                            <span class="font-medium text-foreground">E-post</span>
                            <p class="text-muted-foreground">post@bryllupspakken.no</p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <MapPin class="size-5" aria-hidden="true" />
                        </span>
                        <div>
                            <span class="font-medium text-foreground">Besøksadresse</span>
                            <p class="text-muted-foreground">Novaduo AS<br />Gamle Sånervei 356<br />1827 Hobøl, Norge</p>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Clock class="size-5" aria-hidden="true" />
                        </span>
                        <div>
                            <span class="font-medium text-foreground">Åpningstider</span>
                            <div class="mt-1 space-y-1 text-muted-foreground">
                                <p>Mandag - Fredag: 09:00 - 17:00</p>
                                <p>Lørdag: 10:00 - 15:00</p>
                                <p>Søndag: Stengt</p>
                            </div>
                            <p class="mt-2 text-xs text-muted-foreground">
                                Vi har også kvelds-møter etter avtale for travle par.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="mt-8 space-y-3">
                    <Button href="tel:+4794082222" class="w-full justify-center bg-primary py-6 text-base font-semibold">
                        Ring oss nå
                    </Button>
                    <Button
                        href="mailto:post@bryllupspakken.no"
                        variant="outline"
                        class="w-full justify-center py-6 text-base font-semibold"
                    >
                        Send e-post
                    </Button>
                </div>
            </div>
        </aside>
    </div>
</section>