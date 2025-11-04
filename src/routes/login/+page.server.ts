import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	// If already logged in, redirect to admin
	if (locals.session) {
		throw redirect(303, '/admin');
	}

	return {
		session: locals.session
	};
};

export const actions = {
	login: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			return fail(400, {
				error: 'E-post og passord er påkrevd',
				email
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Ugyldig e-postadresse',
				email
			});
		}

		// Attempt to sign in
		const { error } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error('Login error:', error);
			return fail(401, {
				error: 'Ugyldig e-post eller passord',
				email
			});
		}

		// Get the redirect URL from query params, default to /admin
		const redirectTo = url.searchParams.get('redirectTo') ?? '/admin';
		
		throw redirect(303, redirectTo);
	}
} satisfies Actions;

