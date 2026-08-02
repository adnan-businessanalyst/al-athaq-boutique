"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch, setStoredToken } from "@/lib/admin-api";

type Settings = {
  purchasePolicy: string;
  deliveryInstructions: string;
  orderPrefix: string;
  shopWhatsAppE164: string | null;
  currencyLabel: string;
};

export default function AdminCommercePage() {
  const router = useRouter();
  const [form, setForm] = useState<Settings>({
    purchasePolicy: "",
    deliveryInstructions: "",
    orderPrefix: "ATH",
    shopWhatsAppE164: "",
    currencyLabel: "SAR",
  });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ settings: Settings | null }>("/admin/commerce-settings")
      .then((r) => {
        if (r.settings) {
          setForm({
            ...r.settings,
            shopWhatsAppE164: r.settings.shopWhatsAppE164 || "",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setStoredToken(null);
        router.replace("/my-access-nimda");
      });
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    try {
      await apiFetch("/admin/commerce-settings", {
        method: "PUT",
        body: {
          ...form,
          shopWhatsAppE164: form.shopWhatsAppE164 || null,
        },
      });
      setOk("Saved.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    }
  }

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl items-center px-5 text-athaq-cream/70">
        Loading…
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 text-athaq-cream">
      <AdminNav />
      <h1 className="mt-6 font-display text-3xl">Checkout settings</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          Order prefix
          <input
            value={form.orderPrefix}
            onChange={(e) => setForm((f) => ({ ...f, orderPrefix: e.target.value }))}
            className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
          />
        </label>
        <label className="block text-sm">
          Currency label
          <input
            value={form.currencyLabel}
            onChange={(e) => setForm((f) => ({ ...f, currencyLabel: e.target.value }))}
            className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
          />
        </label>
        <label className="block text-sm">
          Shop WhatsApp (E.164)
          <input
            value={form.shopWhatsAppE164 || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, shopWhatsAppE164: e.target.value }))
            }
            placeholder="+9665…"
            className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
          />
        </label>
        <label className="block text-sm">
          Delivery instructions
          <textarea
            required
            rows={5}
            value={form.deliveryInstructions}
            onChange={(e) =>
              setForm((f) => ({ ...f, deliveryInstructions: e.target.value }))
            }
            className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Purchase policy
          <textarea
            required
            rows={8}
            value={form.purchasePolicy}
            onChange={(e) =>
              setForm((f) => ({ ...f, purchasePolicy: e.target.value }))
            }
            className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
          />
        </label>
        {error ? <p className="text-red-200">{error}</p> : null}
        {ok ? <p className="text-athaq-teal">{ok}</p> : null}
        <button
          type="submit"
          className="rounded-pill bg-athaq-teal px-6 py-2.5 font-semibold text-white"
        >
          Save settings
        </button>
      </form>
    </main>
  );
}

function AdminNav() {
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      <Link href="/my-access-nimda/products" className="underline opacity-80">
        Products
      </Link>
      <Link href="/my-access-nimda/delivery" className="underline opacity-80">
        Delivery
      </Link>
      <Link href="/my-access-nimda/orders" className="underline opacity-80">
        Orders
      </Link>
      <Link href="/my-access-nimda/commerce" className="underline opacity-80">
        Settings
      </Link>
    </div>
  );
}
