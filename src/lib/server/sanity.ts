import { createClient } from '@sanity/client';
import { env } from '$env/dynamic/private';

const projectId = env.SANITY_PROJECT_ID;
const dataset = env.SANITY_DATASET;
const token = env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error('Missing Sanity configuration in environment variables.');
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-09-01',
  token,
  useCdn: false,
});

