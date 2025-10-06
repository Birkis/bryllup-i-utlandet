import type { ContactServiceOption } from '$lib/config/contact';

export type ContactRequestStage = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
export type ContactRequestSource = 'website-kontakt' | 'manual' | 'import';

export type ContactRequest = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  weddingDate?: string;
  destination?: string;
  guestCount?: number;
  services: ContactServiceOption[];
  message?: string;
  subscribe: boolean;
  stage: ContactRequestStage;
  source: ContactRequestSource;
  tags: string[];
  metadata: ContactRequestMetadata;
};

export type ContactRequestMetadata = {
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export type ContactRequestInput = {
  name: string;
  email: string;
  phone?: string;
  weddingDate?: string;
  destination?: string;
  guestCount?: number;
  services?: ContactServiceOption[];
  message?: string;
  subscribe?: boolean;
};

export type ContactRequestEvent = {
  type: 'contact.request.created';
  payload: ContactRequest;
  deliveredAt?: string;
  destination?: 'supabase' | 'webhook' | 'email' | 'crm';
};
