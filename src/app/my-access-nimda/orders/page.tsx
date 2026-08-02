"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch, setStoredToken } from "@/lib/admin-api";
import { formatMoney } from "@/lib/money";

type OrderRow = {
  id: string;
  confirmationNumber: string;
  fullName: string;
  email: string;
  totalHalalas: number;
  currencyLabel: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  locationVerificationStatus: string;
  createdAt: string;
  zone: { name: string };
  slot: { label: string };
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const r = await apiFetch<{ orders: OrderRow[] }>("/admin/orders");
    setOrders(r.orders);
  }

  useEffect(() => {
    load().catch(() => {
      setStoredToken(null);
      router.replace("/my-access-nimda");
    });
  }, [router]);

  async function openDetail(id: string) {
    setSelected(id);
    const r = await apiFetch<{ order: Record<string, unknown> }>(
      `/admin/orders/${id}`,
    );
    setDetail(r.order);
  }

  async function patchStatus(
    id: string,
    patch: Record<string, string>,
  ) {
    setError(null);
    try {
      await apiFetch(`/admin/orders/${id}/status`, {
        method: "PATCH",
        body: patch,
      });
      await load();
      if (selected === id) await openDetail(id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Update failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl">Orders</h1>
      {error ? <p className="mt-3 text-red-200">{error}</p> : null}

      <ul className="mt-6 space-y-3">
        {orders.map((o) => (
          <li
            key={o.id}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{o.confirmationNumber}</p>
                <p className="text-xs text-athaq-cream/60">
                  {o.fullName} · {o.email} · {formatMoney(o.totalHalalas, o.currencyLabel)} ·{" "}
                  {o.fulfillmentStatus} · {o.locationVerificationStatus}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openDetail(o.id)}
                  className="rounded-pill border border-white/20 px-3 py-1.5 text-sm"
                >
                  Detail
                </button>
                <button
                  type="button"
                  onClick={() =>
                    patchStatus(o.id, { fulfillmentStatus: "CONFIRMED" })
                  }
                  className="rounded-pill border border-white/20 px-3 py-1.5 text-sm"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() =>
                    patchStatus(o.id, {
                      locationVerificationStatus: "NEEDS_REVIEW",
                    })
                  }
                  className="rounded-pill border border-white/20 px-3 py-1.5 text-sm"
                >
                  Flag location
                </button>
              </div>
            </div>
            {selected === o.id && detail ? (
              <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-black/40 p-3 text-xs">
                {JSON.stringify(detail, null, 2)}
              </pre>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
