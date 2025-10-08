# Bryllup i Utlandet

A wedding planning website built with SvelteKit, Sanity CMS, and Supabase.

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SECRET_KEY=your-supabase-service-role-key

# Sanity CMS
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-api-token

# n8n Automation (optional)
N8N_WEBHOOK_TEST_URL=https://your-n8n-instance.com/webhook/contact-request
```

**Note:** The `N8N_WEBHOOK_TEST_URL` is optional. If not configured, contact form submissions will still work but won't trigger n8n automation workflows.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
