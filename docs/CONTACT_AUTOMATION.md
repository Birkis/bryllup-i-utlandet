# Contact Request Automation Guide

This document describes the data model and integration points for automating workflows based on contact form submissions.

## Database Schema

### `contact_requests` Table

Stores all contact form submissions with rich metadata for tracking and automation.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `created_at` | TIMESTAMPTZ | Submission timestamp (auto-generated) |
| `name` | TEXT | Contact's full name (required) |
| `email` | TEXT | Contact's email address (required) |
| `phone` | TEXT | Optional phone number |
| `wedding_date` | TEXT | Desired wedding date (free text) |
| `destination` | TEXT | Desired location/destination |
| `guest_count` | INTEGER | Approximate number of guests |
| `services` | TEXT[] | Array of selected service types |
| `message` | TEXT | Free-form message from contact |
| `subscribe` | BOOLEAN | Newsletter subscription opt-in |
| `stage` | TEXT | Lead stage: `new`, `contacted`, `qualified`, `won`, `lost` |
| `source` | TEXT | Traffic source (default: `website-kontakt`) |
| `tags` | TEXT[] | Array of tags for categorization |
| `metadata` | JSONB | Rich tracking metadata (see below) |

#### Metadata Structure

The `metadata` JSONB field contains:

```json
{
  "ipAddress": "string (optional)",
  "userAgent": "string (optional)",
  "referrer": "string (optional)",
  "utmSource": "string (optional)",
  "utmMedium": "string (optional)",
  "utmCampaign": "string (optional)"
}
```

### `contact_request_events` Table

Tracks automation events and integrations for audit trails and debugging.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `created_at` | TIMESTAMPTZ | Event timestamp |
| `contact_request_id` | UUID | Foreign key to `contact_requests` |
| `event_type` | TEXT | Event identifier (e.g., `contact.request.created`) |
| `payload` | JSONB | Event-specific data |
| `delivered_at` | TIMESTAMPTZ | When the event was processed |
| `destination` | TEXT | Target system (e.g., `email`, `webhook`, `crm`) |

## Integration Points

### 1. Real-time Webhooks

Listen for new submissions by querying `contact_request_events`:

```sql
SELECT * FROM contact_request_events
WHERE event_type = 'contact.request.created'
  AND delivered_at IS NULL
ORDER BY created_at ASC;
```

After processing, mark as delivered:

```sql
UPDATE contact_request_events
SET delivered_at = NOW(), destination = 'your-system'
WHERE id = $1;
```

### 2. Email Notification

Currently handled by `sendContactEmail()` in `src/lib/server/email.ts`. To integrate a real provider:

1. Replace the stub with your email service (Resend, Postmark, SendGrid, etc.)
2. Update the `CONTACT_EMAIL_TO` environment variable for recipient
3. Consider templating for richer notifications

### 3. CRM Integration

Recommended workflow:

1. Poll or webhook-listen for new `contact.request.created` events
2. Map fields to your CRM's lead/contact schema
3. Use `stage`, `services`, and `tags` for segmentation
4. Track UTM parameters for attribution
5. Store the `contact_request_id` as external reference

### 4. Marketing Automation

For subscribers (`subscribe = true`):

1. Query contacts with `subscribe = true`
2. Sync to your email marketing platform
3. Segment by `services`, `destination`, `guest_count`
4. Use `tags` for dynamic list building

### 5. Stage Management

Update lead stages as your team progresses:

```sql
UPDATE contact_requests
SET stage = 'contacted'
WHERE id = $1;
```

Possible stages:
- `new` - Fresh submission
- `contacted` - Initial outreach complete
- `qualified` - Matches service criteria
- `won` - Converted to booking
- `lost` - Not a fit or declined

## Example Queries

### Recent Leads by Service

```sql
SELECT name, email, services, created_at
FROM contact_requests
WHERE 'Bryllup i utlandet' = ANY(services)
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

### UTM Attribution Report

```sql
SELECT
  metadata->>'utmSource' as source,
  metadata->>'utmMedium' as medium,
  COUNT(*) as leads
FROM contact_requests
WHERE metadata->>'utmSource' IS NOT NULL
GROUP BY source, medium
ORDER BY leads DESC;
```

### Newsletter Subscribers

```sql
SELECT email, name, created_at
FROM contact_requests
WHERE subscribe = true
ORDER BY created_at DESC;
```

## Security & Compliance

- **RLS Policies**: Tables have Row Level Security enabled; service role bypasses restrictions
- **PII**: Store minimal personal data; consider anonymization for analytics
- **GDPR**: Implement data deletion endpoints for user requests
- **Audit**: All events logged in `contact_request_events` for compliance

## Future Enhancements

- **Webhooks**: Add a `webhooks` table to register and deliver events automatically
- **API**: Expose REST/GraphQL endpoints for external integrations
- **Triggers**: Use Postgres triggers or Supabase Edge Functions for real-time processing
- **Analytics**: Create materialized views for dashboard metrics

