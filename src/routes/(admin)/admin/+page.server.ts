import type { Actions, PageServerLoad } from './$types';
import { supabase } from '$lib/server/supabase';
import type { ContactRequest, ContactRequestStage } from '$lib/types/contact-request';
import { fail } from '@sveltejs/kit';

const ITEMS_PER_PAGE = 20;

export const load = (async ({ url }) => {
	// Get query parameters
	const search = url.searchParams.get('search') || '';
	const stage = url.searchParams.get('stage') || '';
	const page = Math.max(1, Number.parseInt(url.searchParams.get('page') || '1', 10));
	const sortBy = url.searchParams.get('sortBy') || 'created_at';
	const sortOrder = url.searchParams.get('sortOrder') || 'desc';

	// Build query
	let query = supabase.from('contact_requests').select('*', { count: 'exact' });

	// Apply search filter
	if (search) {
		const searchPattern = `%${search.replace(/%/g, '\\%')}%`;
		query = query.or(
			`name.ilike."${searchPattern}",email.ilike."${searchPattern}",destination.ilike."${searchPattern}",phone.ilike."${searchPattern}"`
		);
	}

	// Apply stage filter
	if (stage && ['new', 'contacted', 'qualified', 'won', 'lost'].includes(stage)) {
		query = query.eq('stage', stage);
	}

	// Apply sorting
	const ascending = sortOrder === 'asc';
	if (sortBy === 'name') {
		query = query.order('name', { ascending });
	} else if (sortBy === 'email') {
		query = query.order('email', { ascending });
	} else if (sortBy === 'stage') {
		query = query.order('stage', { ascending });
	} else {
		query = query.order('created_at', { ascending });
	}

	// Apply pagination
	const from = (page - 1) * ITEMS_PER_PAGE;
	const to = from + ITEMS_PER_PAGE - 1;
	query = query.range(from, to);

	const { data, error, count } = await query;

	if (error) {
		console.error('Failed to fetch contact requests:', error);
		return {
			contactRequests: [] as ContactRequest[],
			pagination: {
				page: 1,
				totalPages: 1,
				totalItems: 0,
				itemsPerPage: ITEMS_PER_PAGE
			},
			filters: {
				search: '',
				stage: '',
				sortBy: 'created_at',
				sortOrder: 'desc'
			},
			error: error.message
		};
	}

	// Transform the database records to match our ContactRequest type
	const contactRequests: ContactRequest[] = (data || []).map((row) => ({
		id: row.id,
		createdAt: row.created_at,
		name: row.name,
		email: row.email,
		phone: row.phone || undefined,
		weddingDate: row.wedding_date || undefined,
		destination: row.destination || undefined,
		guestCount: row.guest_count || undefined,
		services: row.services || [],
		message: row.message || undefined,
		subscribe: row.subscribe || false,
		stage: row.stage || 'new',
		source: row.source || 'website-kontakt',
		tags: row.tags || [],
		metadata: row.metadata || {}
	}));

	const totalItems = count || 0;
	const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

	return {
		contactRequests,
		pagination: {
			page,
			totalPages,
			totalItems,
			itemsPerPage: ITEMS_PER_PAGE
		},
		filters: {
			search,
			stage,
			sortBy,
			sortOrder
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	updateStage: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const stage = formData.get('stage')?.toString() as ContactRequestStage | null;

		if (!id || !stage) {
			return fail(400, { error: 'Missing id or stage' });
		}

		if (!['new', 'contacted', 'qualified', 'won', 'lost'].includes(stage)) {
			return fail(400, { error: 'Invalid stage' });
		}

		const { error } = await supabase.from('contact_requests').update({ stage }).eq('id', id);

		if (error) {
			console.error('Failed to update stage:', error);
			return fail(500, { error: 'Failed to update stage' });
		}

		return { success: true };
	}
} satisfies Actions;
