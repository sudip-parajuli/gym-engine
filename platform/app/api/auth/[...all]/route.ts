import { personalAuth, ensurePersonalStorage } from "@/lib/personal-auth";
export const runtime = "nodejs";
async function handler(request: Request) {
  try {
    await ensurePersonalStorage();
    return await personalAuth().handler(request);
  } catch {
    return Response.json(
      {
        message:
          "Personal accounts need a configured database, auth secret, and migrations. See the deployment setup guide.",
      },
      { status: 503 },
    );
  }
}
export const GET = handler;
export const POST = handler;
