export type ContactEmailPayload = {
  subject: string;
  to: string;
  from: string;
  replyTo?: string;
  text: string;
  html?: string;
};

export const sendContactEmail = async (_payload: ContactEmailPayload) => {
  // TODO: integrate with actual email provider (e.g. Resend, Postmark)
  return { id: crypto.randomUUID(), status: 'queued' as const };
};
