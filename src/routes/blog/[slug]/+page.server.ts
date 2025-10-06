import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { blogPostBySlugQuery } from '$lib/sanity/queries';
import { sanityClient } from '$lib/server/sanity';

export const load = (async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    throw error(400, 'Blog post slug mangler.');
  }

  const post = await sanityClient.fetch(blogPostBySlugQuery, { slug });

  if (!post) {
    throw error(404, 'Fant ikke blogginnlegg.');
  }

  return {
    post,
  };
}) satisfies PageServerLoad;

