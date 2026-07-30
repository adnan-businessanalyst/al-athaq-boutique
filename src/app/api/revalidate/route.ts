import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand ISR revalidation triggered by the Express API after product mutations.
 * Protect with REVALIDATE_SECRET (shared with the API).
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET not configured" },
      { status: 503 },
    );
  }

  const header = request.headers.get("x-revalidate-secret");
  let bodySecret: string | undefined;
  try {
    const body = (await request.json()) as { secret?: string };
    bodySecret = body.secret;
  } catch {
    bodySecret = undefined;
  }

  if (header !== secret && bodySecret !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
