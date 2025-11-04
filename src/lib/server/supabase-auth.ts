import { createServerClient as createSupabaseServerClient, createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Creates a Supabase client for server-side operations with cookie handling
 * Use this in hooks, server load functions, and server actions
 */
export function createServerClient(event: RequestEvent) {
	return createSupabaseServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => {
				return event.cookies.getAll();
			},
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
}

/**
 * Creates a Supabase client for client-side operations
 * Use this in client-side components
 */
export function createBrowserClient() {
	return createSupabaseBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}

