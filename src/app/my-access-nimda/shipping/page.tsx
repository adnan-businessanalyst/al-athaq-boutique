"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch, setStoredToken } from "@/lib/admin-api";
import { formatMoney } from "@/lib/money";

function sarToHalalas(sar: string): number {
  const n = Number(sar);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function halalasToSar(h: number): string {
  return (h / 100).toFixed(2);
}

type Method = {
  id: string;
  name: string;
  description: string;
  feeHalalas: number;
  etaLabel: string | null;
  isActive: boolean;
  sortOrder: number;
};

export default function AdminShippingPage() {
  const router = useRouter();
  const [methods, setMethods] = useState<Method[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    feeSar: "15.00",
    etaLabel: "",
    isActive: true,
    sortOrder: 0,
  });

  async function load() {
    const r = await apiFetch<{ methods: Method[] }>("/admin/shipping-methods");
    setMethods(r.methods);
  }

  useEffect(() => {
    load().catch(() => {
      setStoredToken(null);
      router.replace("/my-access-nimda");
    });
  }, [router]);

  function startEdit(m: Method) {
    setEditingId(m.id);
    setForm({
      name: m.name,
      description: m.description || "",
      feeSar: halalasToSar(m.feeHalalas),
      etaLabel: m.etaLabel || "",
      isActive: m.isActive,
      sortOrder: m.sortOrder,
    });
  }

  function reset() {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      feeSar: "15.00",
      etaLabel: "",
      isActive: true,
      sortOrder: 0,
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const body = {
      name: form.name,
      description: form.description,
      feeHalalas: sarToHalalas(form.feeSar),
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
      etaLabel: form.etaLabel || null,
    };
    try {
      if (editingId) {
        await apiFetch(`/admin/shipping-methods/${editingId}`, {
          method: "PATCH",
          body,
        });
      } else {
        await apiFetch("/admin/shipping-methods", { method: "POST", body });
      }
      reset();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this shipping method?")) return;
    try {
      await apiFetch(`/admin/shipping-methods/${id}`, { method: "DELETE" });
      if (editingId === id) reset();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl">Shipping methods</h1>
      <p className="mt-2 text-sm text-athaq-cream/70">
        Checkout fee = method fee + zone surcharge. Enter fees in SAR. You can
        also manage these from Products → Shipping prices.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 md:grid-cols-2"
      >
        <h2 className="font-display text-xl md:col-span-2">
          {editingId ? "Edit method" : "Create method"}
        </h2>
        <label className="text-sm md:col-span-2">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
          />
        </label>
        <label className="text-sm md:col-span-2">
          Description
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Fee (SAR)
          <input
            required
            value={form.feeSar}
            onChange={(e) =>
              setForm((f) => ({ ...f, feeSar: e.target.value }))
            }
            className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
          />
          <span className="mt-1 block text-xs text-athaq-cream/50">
            = {formatMoney(sarToHalalas(form.feeSar))}
          </span>
        </label>
        <label className="text-sm">
          ETA label
          <input
            value={form.etaLabel}
            onChange={(e) => setForm((f) => ({ ...f, etaLabel: e.target.value }))}
            className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
          />
        </label>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
          Active
        </label>
        {error ? (
          <p className="text-red-200 md:col-span-2">{error}</p>
        ) : null}
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="submit"
            className="rounded-pill bg-athaq-teal px-6 py-2.5 font-semibold"
          >
            {editingId ? "Update" : "Create"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-pill border border-white/20 px-6 py-2.5"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <ul className="mt-8 space-y-3">
        {methods.map((m) => (
          <li
            key={m.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
          >
            <div>
              <p className="font-medium">
                {m.name}{" "}
                {!m.isActive ? (
                  <span className="text-xs text-athaq-cream/50">(inactive)</span>
                ) : null}
              </p>
              <p className="text-xs text-athaq-cream/60">
                {formatMoney(m.feeHalalas)}
                {m.etaLabel ? ` · ${m.etaLabel}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(m)}
                className="rounded-pill border border-white/20 px-3 py-1.5 text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(m.id)}
                className="rounded-pill border border-red-400/40 px-3 py-1.5 text-sm text-red-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
