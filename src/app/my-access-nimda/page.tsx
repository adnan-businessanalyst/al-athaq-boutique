"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  apiFetch,
  setStoredToken,
  type AdminMe,
} from "@/lib/admin-api";

const BOOTSTRAP_EMAIL = "adnan.akhonbay@gmail.com";
const BOOTSTRAP_PASSWORD = "alathaqboutique@1234";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(BOOTSTRAP_EMAIL);
  const [password, setPassword] = useState(BOOTSTRAP_PASSWORD);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    apiFetch<AdminMe>("/auth/me")
      .then((me) => {
        if (me.passwordExpired) router.replace("/my-access-nimda/change-password");
        else router.replace("/my-access-nimda/products");
      })
      .catch(() => setChecking(false));
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await apiFetch<{
        ok: boolean;
        passwordExpired?: boolean;
        token?: string;
      }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      if (result.token) setStoredToken(result.token);
      if (result.passwordExpired) {
        router.replace("/my-access-nimda/change-password");
      } else {
        router.replace("/my-access-nimda/products");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-5">
        <p className="text-athaq-cream/70">Checking session…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-athaq-teal">
          Control panel
        </p>
        <h1 className="mt-3 font-display text-3xl text-athaq-cream">
          Admin login
        </h1>
        <p className="mt-2 text-sm text-athaq-cream/70">
          No public signup. Use your seeded admin credentials. Bootstrap labels
          are for initial access only.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-medium text-athaq-cream"
            >
              Email ({BOOTSTRAP_EMAIL})
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-12 w-full rounded-pill border border-white/15 bg-black/20 px-4 text-athaq-cream outline-none ring-athaq-teal focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm font-medium text-athaq-cream"
            >
              Password ({BOOTSTRAP_PASSWORD})
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-12 w-full rounded-pill border border-white/15 bg-black/20 px-4 text-athaq-cream outline-none ring-athaq-teal focus:ring-2"
            />
          </div>

          {error ? (
            <p className="rounded-2xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-athaq-teal px-6 font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
