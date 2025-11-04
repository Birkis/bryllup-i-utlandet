import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	// Sign out from Supabase
	await locals.supabase.auth.signOut();

	// Redirect to home page
	throw redirect(303, '/');
};

