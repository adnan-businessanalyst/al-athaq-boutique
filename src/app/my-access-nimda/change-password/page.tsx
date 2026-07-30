"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ApiError,
  apiFetch,
  setStoredToken,
  type AdminMe,
} from "@/lib/admin-api";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [me, setMe] = useState<AdminMe | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<AdminMe>("/auth/me")
      .then(setMe)
      .catch(() => router.replace("/my-access-nimda"));
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch<{ token?: string }>("/auth/change-password", {
        method: "POST",
        body: { currentPassword, newPassword },
      });
      if (result.token) setStoredToken(result.token);
      router.replace("/my-access-nimda/products");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => undefined);
    setStoredToken(null);
    router.replace("/my-access-nimda");
  }

  if (!me) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-5">
        <p className="text-athaq-cream/70">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-athaq-teal">
          Security
        </p>
        <h1 className="mt-3 font-display text-3xl">Change password</h1>
        <p className="mt-2 text-sm text-athaq-cream/75">
          {me.passwordExpired
            ? "Your password is older than 5 days. Change it to continue using the control panel."
            : `Password days remaining: ${me.daysRemaining}.`}
        </p>
        <p className="mt-2 text-xs text-athaq-cream/55">
          Signed in as {me.admin.email}. Bootstrap labels on the login page are
          for initial access only after rotation.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm" htmlFor="current">
              Current password
            </label>
            <input
              id="current"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="min-h-12 w-full rounded-pill border border-white/15 bg-black/20 px-4 outline-none focus:ring-2 focus:ring-athaq-teal"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm" htmlFor="next">
              New password
            </label>
            <input
              id="next"
              type="password"
              required
              minLength={12}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="min-h-12 w-full rounded-pill border border-white/15 bg-black/20 px-4 outline-none focus:ring-2 focus:ring-athaq-teal"
            />
            <p className="mt-1 text-xs text-athaq-cream/55">
              Min 12 chars with upper, lower, number, and special character.
            </p>
          </div>
          <div>
            <label className="mb-2 block text-sm" htmlFor="confirm">
              Confirm new password
            </label>
            <input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="min-h-12 w-full rounded-pill border border-white/15 bg-black/20 px-4 outline-none focus:ring-2 focus:ring-athaq-teal"
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
            className="inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-athaq-teal font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Saving…" : "Update password"}
          </button>
        </form>

        <div className="mt-6 flex gap-4 text-sm">
          <Link href="/my-access-nimda/products" className="text-athaq-purple-tint hover:underline">
            Back to products
          </Link>
          <button type="button" onClick={logout} className="text-athaq-cream/70 hover:underline">
            Log out
          </button>
        </div>
      </div>
    </main>
  );
}
