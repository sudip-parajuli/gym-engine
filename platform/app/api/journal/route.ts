import { trustedOrigin } from "@/lib/request-origin";
import { personalAuth, ensurePersonalStorage } from "@/lib/personal-auth";
import { personalQuery } from "@/lib/personal-store";
import { EMPTY_JOURNAL, readJournal } from "@/lib/fitness";
export const runtime = "nodejs";
const privateHeaders = { "Cache-Control": "private, no-store" };
export async function GET(request: Request) {
  try {
    await ensurePersonalStorage();
    const session = await personalAuth().api.getSession({
      headers: request.headers,
    });
    if (!session)
      return Response.json(
        { error: "Sign in to save or view personal records." },
        { status: 401, headers: privateHeaders },
      );
    const row = (
      await personalQuery<{ payload: string; revision: number }>(
        "SELECT payload,revision FROM personal_journals WHERE user_id=?",
        [session.user.id],
      )
    )[0];
    return Response.json(
      {
        journal: row ? readJournal(row.payload) : EMPTY_JOURNAL,
        revision: row?.revision || 0,
        email: session.user.email,
      },
      { headers: privateHeaders },
    );
  } catch {
    return Response.json(
      { error: "Personal storage is temporarily unavailable." },
      { status: 503, headers: privateHeaders },
    );
  }
}
export async function PUT(request: Request) {
  if (!trustedOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  try {
    await ensurePersonalStorage();
    const session = await personalAuth().api.getSession({
      headers: request.headers,
    });
    if (!session)
      return Response.json(
        { error: "Sign in to save personal records." },
        { status: 401 },
      );
    const raw = await request.text();
    if (raw.length > 1_000_000)
      return Response.json(
        { error: "Journal is too large. Export and archive older entries." },
        { status: 413 },
      );
    const body = JSON.parse(raw);
    if (!Number.isSafeInteger(body.revision) || body.revision < 0)
      return Response.json({ error: "Invalid revision." }, { status: 400 });
    let journal;
    try {
      journal = readJournal(JSON.stringify(body.journal));
    } catch {
      return Response.json({ error: "Invalid journal data." }, { status: 400 });
    }
    const payload = JSON.stringify(journal);
    const rows =
      body.revision === 0
        ? await personalQuery<{ revision: number }>(
            "INSERT INTO personal_journals(user_id,payload,revision) VALUES(?,?,1) ON CONFLICT(user_id) DO NOTHING RETURNING revision",
            [session.user.id, payload],
          )
        : await personalQuery<{ revision: number }>(
            "UPDATE personal_journals SET payload=?,revision=revision+1 WHERE user_id=? AND revision=? RETURNING revision",
            [payload, session.user.id, body.revision],
          );
    if (!rows.length)
      return Response.json(
        { error: "Records changed in another session. Reload before saving." },
        { status: 409 },
      );
    return Response.json(
      { revision: rows[0].revision },
      { headers: privateHeaders },
    );
  } catch {
    return Response.json(
      {
        error:
          "Could not save personal records. Nothing has been confirmed saved.",
      },
      { status: 503 },
    );
  }
}
