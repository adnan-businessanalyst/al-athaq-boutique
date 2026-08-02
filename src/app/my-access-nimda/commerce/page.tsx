"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch, setStoredToken } from "@/lib/admin-api";

type Settings = {
  purchasePolicy: string;
  deliveryInstructions: string;
  shippingPolicy: string;
  returnPolicy: string;
  orderPrefix: string;
  shopWhatsAppE164: string | null;
  currencyLabel: string;
};

export default function AdminCommercePage() {
  const router = useRouter();
  const [form, setForm] = useState<Settings>({
    purchasePolicy: "",
    deliveryInstructions: "",
    shippingPolicy: "",
    returnPolicy: "",
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
            purchasePolicy: r.settings.purchasePolicy || "",
            deliveryInstructions: r.settings.deliveryInstructions || "",
            shippingPolicy: r.settings.shippingPolicy || "",
            returnPolicy: r.settings.returnPolicy || "",
            orderPrefix: r.settings.orderPrefix || "ATH",
            shopWhatsAppE164: r.settings.shopWhatsAppE164 || "",
            currencyLabel: r.settings.currencyLabel || "SAR",
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
    return <p className="text-athaq-cream/70">Loading…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl">Policies & settings</h1>
      <p className="mt-2 text-sm text-athaq-cream/70">
        Also editable from Products → Policies.
      </p>
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
            rows={4}
            value={form.deliveryInstructions}
            onChange={(e) =>
              setForm((f) => ({ ...f, deliveryInstructions: e.target.value }))
            }
            className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Shipping policy
          <textarea
            rows={5}
            value={form.shippingPolicy}
            onChange={(e) =>
              setForm((f) => ({ ...f, shippingPolicy: e.target.value }))
            }
            className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Return policy
          <textarea
            rows={5}
            value={form.returnPolicy}
            onChange={(e) =>
              setForm((f) => ({ ...f, returnPolicy: e.target.value }))
            }
            className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Purchase policy
          <textarea
            required
            rows={6}
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
    </div>
  );
}
