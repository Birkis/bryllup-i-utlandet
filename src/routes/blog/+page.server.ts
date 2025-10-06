import type { PageServerLoad } from './$types';
import { blogPostsQuery } from '$lib/sanity/queries';
import { sanityClient } from '$lib/server/sanity';
import type { BlogPostListItem } from '$lib/types/blog-post';

export const load = (async () => {
  const posts = await sanityClient.fetch<BlogPostListItem[]>(blogPostsQuery);

  return {
    posts,
  };
}) satisfies PageServerLoad;

