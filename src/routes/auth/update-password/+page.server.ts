import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Must be authenticated to update password
	if (!locals.session) {
		throw redirect(303, '/login');
	}

	return {
		session: locals.session
	};
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.session) {
			return fail(401, { error: 'Du må være innlogget for å endre passord' });
		}

		const formData = await request.formData();
		const password = formData.get('password')?.toString();
		const confirmPassword = formData.get('confirmPassword')?.toString();

		if (!password || !confirmPassword) {
			return fail(400, { error: 'Begge feltene er påkrevd' });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Passordet må være minst 6 tegn' });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passordene stemmer ikke overens' });
		}

		const { error } = await locals.supabase.auth.updateUser({
			password: password
		});

		if (error) {
			console.error('Password update error:', error);
			return fail(500, { error: 'Kunne ikke oppdatere passord: ' + error.message });
		}

		// Redirect to admin after successful password update
		throw redirect(303, '/admin');
	}
} satisfies Actions;

