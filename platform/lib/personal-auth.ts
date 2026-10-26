import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";
import { getMigrations } from "better-auth/db/migration";
import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { personalDatabase, createJournalSchema } from "./personal-store.ts";
function secret() {
  if (process.env.BETTER_AUTH_SECRET) return process.env.BETTER_AUTH_SECRET;
  if (process.env.NODE_ENV === "production")
    throw new Error("BETTER_AUTH_SECRET is required in production.");
  const folder = join(process.cwd(), "data");
  mkdirSync(folder, { recursive: true });
  const file = join(folder, "auth-secret");
  if (!existsSync(file))
    try {
      writeFileSync(file, randomBytes(48).toString("hex"), { flag: "wx" });
    } catch (e) {
      if (!existsSync(file)) throw e;
    }
  return readFileSync(file, "utf8");
}
async function sendMail(email: string, subject: string, url: string) {
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM)
    throw new Error("Email delivery is not configured.");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.MAIL_FROM,
      to: email,
      subject,
      text: `${subject}\n\n${url}\n\nIf you did not request this, ignore this email.`,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw new Error("Email delivery failed. Please try again later.");
}
export function configuredProviders() {
  return {
    google: !!(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ),
    microsoft: !!(
      process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET
    ),
    chatgpt: !!(
      process.env.CHATGPT_CLIENT_ID && process.env.CHATGPT_DISCOVERY_URL
    ),
  };
}
function buildAuth() {
  const configured = configuredProviders(),
    production = process.env.NODE_ENV === "production";
  return betterAuth({
    appName: "Gym Engine",
    baseURL: process.env.BETTER_AUTH_URL || "http://127.0.0.1:3000",
    secret: secret(),
    database: personalDatabase(),
    user: { modelName: "ge_user" },
    session: { modelName: "ge_session", expiresIn: 604800 },
    account: { modelName: "ge_account", accountLinking: { enabled: false } },
    verification: { modelName: "ge_verification" },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      requireEmailVerification: production,
      revokeSessionsOnPasswordReset: true,
      disableSignUp:
        production && !(process.env.RESEND_API_KEY && process.env.MAIL_FROM),
      sendResetPassword: async ({ user, url }) =>
        sendMail(user.email, "Reset your Gym Engine password", url),
    },
    emailVerification: {
      sendOnSignUp: production,
      sendVerificationEmail: async ({ user, url }) =>
        sendMail(user.email, "Verify your Gym Engine email", url),
    },
    rateLimit: { enabled: true, window: 60, max: 20 },
    socialProviders: {
      ...(configured.google
        ? {
            google: {
              clientId: process.env.GOOGLE_CLIENT_ID!,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            },
          }
        : {}),
      ...(configured.microsoft
        ? {
            microsoft: {
              clientId: process.env.MICROSOFT_CLIENT_ID!,
              clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
              tenantId: process.env.MICROSOFT_TENANT_ID || "common",
            },
          }
        : {}),
    },
    plugins: configured.chatgpt
      ? [
          genericOAuth({
            config: [
              {
                providerId: "chatgpt",
                name: "ChatGPT",
                clientId: process.env.CHATGPT_CLIENT_ID!,
                clientSecret: process.env.CHATGPT_CLIENT_SECRET,
                discoveryUrl: process.env.CHATGPT_DISCOVERY_URL!,
                requireIdTokenVerification: true,
                pkce: true,
                scopes: ["openid", "email", "profile"],
              },
            ],
          }),
        ]
      : [],
  });
}
let auth: ReturnType<typeof buildAuth>;
export function personalAuth() {
  return (auth ??= buildAuth());
}
let ready: Promise<void> | undefined;
export async function migratePersonal() {
  const migrations = await getMigrations(personalAuth().options);
  await migrations.runMigrations();
  await createJournalSchema();
}
export async function ensurePersonalStorage() {
  if (process.env.NODE_ENV === "production") return;
  if (!ready)
    ready = migratePersonal().catch((e) => {
      ready = undefined;
      throw e;
    });
  return ready;
}
