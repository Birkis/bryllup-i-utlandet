# Admin Authentication Setup

This guide explains how to set up and manage admin users for the Bryllup i Utlandet admin panel.

## Prerequisites

- Supabase project with Email authentication enabled
- Environment variables configured (see below)

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Existing variables (keep these)
SUPABASE_URL=your-supabase-url
SUPABASE_SECRET_KEY=your-service-role-key

# New public variables (add these)
PUBLIC_SUPABASE_URL=your-supabase-url
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings:
1. Go to **Settings** → **API**
2. Copy the **Project URL** for `SUPABASE_URL` and `PUBLIC_SUPABASE_URL`
3. Copy the **service_role** key for `SUPABASE_SECRET_KEY`
4. Copy the **anon** key for `PUBLIC_SUPABASE_ANON_KEY`

## Creating the First Admin User

### Option 1: Via Supabase Dashboard (Recommended)

1. Navigate to your Supabase project dashboard
2. Go to **Authentication** → **Users**
3. Click the **Add User** button (top right)
4. Select **Create new user**
5. Enter the admin email address
6. Enter a secure password
7. **(Optional but recommended)** Disable email confirmation:
   - Uncheck "Send user a confirmation email"
   - This allows immediate login without email verification
8. Click **Create user**

### Option 2: Via SQL (Advanced)

If you prefer to create the user via SQL:

```sql
-- Insert a new user with email and encrypted password
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('your-secure-password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

## Accessing the Admin Panel

1. Navigate to `/login` on your website
2. Enter the admin email and password
3. Click **Logg inn**
4. You'll be redirected to `/admin`

## Managing Admin Users

### Adding Additional Admins

Follow the same process as creating the first admin user via the Supabase Dashboard.

### Resetting an Admin Password

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Find the user and click the **•••** menu
3. Select **Reset password**
4. Choose to either:
   - Send a password reset email to the user
   - Set a new password directly

### Removing Admin Access

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Find the user and click the **•••** menu
3. Select **Delete user**

## Security Considerations

### Password Requirements

- Supabase enforces a minimum password length of 6 characters by default
- It's recommended to use strong passwords with a mix of uppercase, lowercase, numbers, and special characters
- Consider using a password manager to generate and store admin passwords

### Email Confirmation

For production environments, you may want to:
- Enable email confirmation for new admin users
- Configure custom email templates in Supabase
- Set up a proper SMTP provider for reliable email delivery

### Session Management

- Admin sessions are managed via secure HTTP-only cookies
- Sessions expire based on your Supabase project settings (default: 1 week)
- Users can log out using the logout functionality, which clears the session

## Troubleshooting

### "Invalid email or password" Error

- Verify the email and password are correct
- Check that the user exists in Supabase Dashboard → Authentication → Users
- If email confirmation is enabled, verify the email has been confirmed

### Redirected to Login When Trying to Access Admin

- Ensure environment variables are properly set
- Verify the user session is valid (try logging in again)
- Check browser console for any authentication errors

### Environment Variables Not Working

- Restart the development server after adding new environment variables
- For production (Vercel), ensure environment variables are set in project settings
- Make sure `PUBLIC_` prefix is used for client-accessible variables

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [SvelteKit Environment Variables](https://kit.svelte.dev/docs/modules#$env-static-private)

