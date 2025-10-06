import type { PageLoad } from './$types';
import { CONTACT_SERVICE_OPTIONS } from '$lib/config/contact';

export const load = (async ({ depends }) => {
	depends('contact:messages');

	return {
		serviceOptions: CONTACT_SERVICE_OPTIONS,
	};
}) satisfies PageLoad;