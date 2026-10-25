import { trustedOrigin } from "@/lib/request-origin";
import { researchAnswer, explainWithAI } from "@/lib/coach";
const requests = new Map<string, { count: number; until: number }>();
export async function POST(request: Request) {
  if (!trustedOrigin(request))
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  const key = request.headers.get("x-forwarded-for")?.split(",")[0] || "local",
    now = Date.now();
  if (requests.size > 5000)
    for (const [k, v] of requests) if (v.until < now) requests.delete(k);
  let slot = requests.get(key);
  if (!slot || slot.until < now) {
    slot = { count: 0, until: now + 60000 };
    requests.set(key, slot);
  }
  if (++slot.count > 10)
    return Response.json(
      { error: "Please wait a minute before asking again." },
      { status: 429 },
    );
  try {
    const raw = await request.text();
    if (raw.length > 5000)
      return Response.json(
        { error: "Please ask a shorter question." },
        { status: 413 },
      );
    const { question, aiConsent } = JSON.parse(raw);
    if (
      typeof question !== "string" ||
      question.trim().length < 3 ||
      question.length > 1000
    )
      return Response.json(
        { error: "Ask a question of 3–1000 characters." },
        { status: 400 },
      );
    return Response.json(
      aiConsent === true
        ? await explainWithAI(question)
        : researchAnswer(question),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      {
        error:
          "The research helper is unavailable. The public guides are still accessible.",
      },
      { status: 503 },
    );
  }
}
