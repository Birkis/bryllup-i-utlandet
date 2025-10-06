/// <reference types="vite-imagetools/client" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			form?: import('@sveltejs/kit').ActionData;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
