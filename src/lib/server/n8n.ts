import { env } from '$env/dynamic/private';

type N8nContactPayload = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string | null;
  wedding_date?: string | null;
  destination?: string | null;
  guest_count?: number | null;
  services: string[];
  message?: string | null;
  subscribe: boolean;
  stage: string;
  source: string;
  tags: string[];
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
};

/**
 * Sends contact request data to n8n webhook for async processing.
 * This is a fire-and-forget operation that won't block the response.
 * Failures are logged but don't throw errors to ensure graceful degradation.
 */
export const sendToN8n = (contactRequest: N8nContactPayload): void => {
  const webhookUrl = env.N8N_WEBHOOK_TEST_URL;

  // Skip if webhook URL is not configured (e.g., in development)
  if (!webhookUrl) {
    console.info('[n8n] Webhook URL (N8N_WEBHOOK_TEST_URL) not configured, skipping automation');
    return;
  }

  // Fire-and-forget: don't await the promise
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contactRequest),
  })
    .then((response) => {
      if (!response.ok) {
        console.error(`[n8n] Webhook failed with status ${response.status}`);
      } else {
        console.info(`[n8n] Successfully sent contact request ${contactRequest.id} to automation`);
      }
    })
    .catch((error) => {
      console.error('[n8n] Failed to send webhook:', error);
    });
};

