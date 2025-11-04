import { createServerClient } from '$lib/server/supabase-auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Create a Supabase client specific to this request
	event.locals.supabase = createServerClient(event);

	/**
	 * A helper function to safely get the session without throwing an error
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session },
			error
		} = await event.locals.supabase.auth.getSession();

		if (error) {
			console.error('Error getting session:', error);
			return { session: null, user: null };
		}

		return {
			session,
			user: session?.user ?? null
		};
	};

	// Get the session for this request
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			// Allow the auth cookies to be sent to the client
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

