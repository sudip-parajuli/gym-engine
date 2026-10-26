# Free-tier authentication setup

Gym Engine keeps its existing Better Auth identity and Neon account database. Email delivery and social OAuth are separate integrations. Do not turn off verification to bypass missing provider configuration.

## Production configuration — 26 October 2026

- Google project `sincere-baton-512805-m4` has one Web OAuth client, `Gym Engine Web`, with the production origin and callback below. Its external audience is published in production. Only basic identity scopes are requested by the application.
- Resend verified `auth.techwiredsolutions.com.np` using a DKIM TXT record and two DNS-only CNAME records. The sender is `Gym Engine <accounts@auth.techwiredsolutions.com.np>`; the API key has sending-only access restricted to that domain. Existing root website/mail DNS records were not changed.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `RESEND_API_KEY` are stored as production secret variables in Vercel. `MAIL_FROM` is production configuration. No provider secrets belong in this repository or local setup documents.
- The public privacy notice is `/privacy`. Microsoft and ChatGPT remain disabled until their separate provider setup is completed.
- A real user must still complete an inbox verification and Google consent round trip to confirm delivery and sign-in end to end. Configuration and deployment readiness alone do not prove inbox delivery.

## Verification and password recovery: Resend

The Resend Free plan is suitable for initial authentication traffic. Its published allowance is 3,000 emails/month with a 100/day limit; verify the current plan in the provider dashboard and leave paid overages disabled.

1. Create/sign in to your Resend account. The account owner must accept any provider terms.
2. Add a sender domain you control, preferably an authentication subdomain such as `auth.your-domain.example`. The Vercel-owned `vercel.app` domain cannot be verified as your own email sender domain.
3. Add exactly the DNS records Resend supplies. Use a dedicated sender subdomain to avoid changing existing website or mailbox records. Verify the domain in Resend.
4. Create a restricted sending API key for that domain. Enter it directly as the sensitive `RESEND_API_KEY` Vercel variable; never put it in chat, source, an issue, or a client-side variable.
5. Set `MAIL_FROM` to an address on the verified domain, for example `Gym Engine <accounts@auth.your-domain.example>`.
6. Redeploy. Verify signup, inbox delivery, verification, sign-in, resend verification, password reset, and revocation of old sessions after reset.

Provider test senders cannot be used as a substitute for public recipient delivery. Do not enable signup merely because placeholder variables are present. The app does not send authentication emails until a visitor explicitly requests the corresponding flow.

## Google sign-in

In your Google Cloud project, configure Google Auth Platform branding, audience, and a Web application OAuth client. Choose the intended app owner/support contact. No paid Google API or billing upgrade is needed for basic Google OAuth sign-in. Review any testing-user or publication requirements in the provider dashboard.

Authorized JavaScript origin:

```text
https://gym-engine.vercel.app
```

Authorized redirect URI (exact):

```text
https://gym-engine.vercel.app/api/auth/callback/google
```

For local development, use a separate registered origin and callback:

```text
http://127.0.0.1:3000
http://127.0.0.1:3000/api/auth/callback/google
```

Add `GOOGLE_CLIENT_ID` and sensitive `GOOGLE_CLIENT_SECRET` to the appropriate Vercel environment, then redeploy. The production `BETTER_AUTH_URL` stays `https://gym-engine.vercel.app`. Use basic identity scopes only; no Gmail, Drive, or Calendar access is needed. Account linking remains disabled rather than silently combining identities.

## Microsoft sign-in

Register an Entra Web app with the intended supported account types (personal Microsoft accounts and/or organizational accounts). Tenant/app creation is controlled by your Microsoft account and organization; a subscription/tenant signup or permissions step must be completed by the account owner where required. Stay on free identity features.

Exact Web redirect URI:

```text
https://gym-engine.vercel.app/api/auth/callback/microsoft
```

Set `MICROSOFT_CLIENT_ID`, sensitive `MICROSOFT_CLIENT_SECRET`, and the deliberately chosen `MICROSOFT_TENANT_ID` (the app currently defaults to `common`). Store the actual secret value securely in Vercel, not the secret's identifier. Record its expiry so it can be replaced before sign-in breaks.

## ChatGPT

The prepared provider requires approved OpenAI partner access. A normal ChatGPT subscription or API key does not provide website sign-in credentials. Keep this option disabled until approved credentials and endpoints exist; it is not a general free-tier setup path.

## Acceptance checklist

- New email/password account cannot sign in until verified.
- Verification callback returns to the account page; expired/invalid links show an error, with a resend action.
- Reset requests do not reveal whether an email is registered; a successful reset revokes previous sessions.
- Google/Microsoft return to `/my-space`; cancellation and provider errors leave a usable sign-in page.
- A second account cannot read the first account's journal.
- Public guides and one-time drafts remain anonymous.
- Account responses appear in a dismissible, keyboard-accessible modal, including invalid credentials, verification instructions, reset responses and verification callbacks.
- Password fields provide an explicit Show/Hide control without submitting the form. The public header shows My account when a session is active.
- Preview identities, provider callbacks, and credentials stay isolated from production.

## Official references

- https://resend.com/pricing
- https://resend.com/docs/dashboard/domains/introduction
- https://better-auth.com/docs/authentication/google
- https://better-auth.com/docs/authentication/microsoft
- https://better-auth.com/docs/authentication/email-password
- https://developers.google.com/identity/protocols/oauth2/web-server
