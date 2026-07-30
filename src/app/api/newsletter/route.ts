import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `newsletter:${ip}`;
}

function assertSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const limited = rateLimit(clientKey(request), 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(limited.retryAfterMs / 1000)),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid email", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Prefer Express + Mailgun when API URL is configured
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  if (apiUrl) {
    try {
      const upstream = await fetch(`${apiUrl}/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(request.headers.get("origin")
            ? { Origin: request.headers.get("origin")! }
            : {}),
        },
        body: JSON.stringify({ email: parsed.data.email }),
      });
      const data = await upstream.json().catch(() => ({}));
      return NextResponse.json(data, { status: upstream.status });
    } catch {
      return NextResponse.json(
        { error: "Newsletter service unavailable" },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks for subscribing.",
  });
}
