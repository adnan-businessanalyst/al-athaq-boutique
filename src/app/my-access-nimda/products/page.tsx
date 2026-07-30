"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ApiError,
  apiFetch,
  setStoredToken,
  type AdminMe,
  type ApiFeatured,
  type ApiProduct,
} from "@/lib/admin-api";

const emptyForm = {
  slug: "",
  name: "",
  description: "",
  category: "",
  mediaUrl: "",
  mediaType: "image" as "image" | "video" | "svg",
  posterUrl: "",
  alt: "",
  sortOrder: 0,
};

const SLOT_LABELS: Record<number, string> = {
  1: "Slot 1 — large",
  2: "Slot 2 — wide",
  3: "Slot 3 — small",
  4: "Slot 4 — small",
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [me, setMe] = useState<AdminMe | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [featured, setFeatured] = useState<ApiFeatured[]>([]);
  const [slotDrafts, setSlotDrafts] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
    4: "",
  });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingFeatured, setSavingFeatured] = useState(false);

  const load = useCallback(async () => {
    const profile = await apiFetch<AdminMe>("/auth/me");
    if (profile.passwordExpired) {
      router.replace("/my-access-nimda/change-password");
      return;
    }
    setMe(profile);
    const [list, feat] = await Promise.all([
      apiFetch<{ products: ApiProduct[] }>("/products"),
      apiFetch<{ featured: ApiFeatured[] }>("/featured"),
    ]);
    setProducts(list.products);
    setFeatured(feat.featured);
    const drafts: Record<number, string> = { 1: "", 2: "", 3: "", 4: "" };
    for (const row of feat.featured) {
      drafts[row.position] = row.productId;
    }
    setSlotDrafts(drafts);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load().catch(() => {
      setStoredToken(null);
      router.replace("/my-access-nimda");
    });
  }, [load, router]);

  function startEdit(p: ApiProduct) {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      name: p.name,
      description: p.description,
      category: p.category,
      mediaUrl: p.mediaUrl,
      mediaType: p.mediaType,
      posterUrl: p.posterUrl || "",
      alt: p.alt,
      sortOrder: p.sortOrder,
    });
    setError(null);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      posterUrl: form.posterUrl.trim() ? form.posterUrl.trim() : null,
      sortOrder: Number(form.sortOrder) || 0,
    };
    try {
      if (editingId) {
        await apiFetch(`/products/${editingId}`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        await apiFetch("/products", { method: "POST", body: payload });
      }
      resetForm();
      const list = await apiFetch<{ products: ApiProduct[] }>("/products");
      setProducts(list.products);
    } catch (err) {
      if (err instanceof ApiError && err.code === "PASSWORD_EXPIRED") {
        router.replace("/my-access-nimda/change-password");
        return;
      }
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await apiFetch(`/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Delete failed");
    }
  }

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => undefined);
    setStoredToken(null);
    router.replace("/my-access-nimda");
  }

  async function saveFeaturedSlots() {
    setSavingFeatured(true);
    setFeaturedError(null);
    try {
      for (const position of [1, 2, 3, 4] as const) {
        const productId = slotDrafts[position]?.trim();
        const current = featured.find((f) => f.position === position);
        if (!productId) {
          if (current) {
            await apiFetch(`/featured/${position}`, { method: "DELETE" });
          }
          continue;
        }
        if (current?.productId === productId) continue;
        await apiFetch(`/featured/${position}`, {
          method: "PUT",
          body: { productId },
        });
      }
      const feat = await apiFetch<{ featured: ApiFeatured[] }>("/featured");
      setFeatured(feat.featured);
    } catch (err) {
      if (err instanceof ApiError && err.code === "PASSWORD_EXPIRED") {
        router.replace("/my-access-nimda/change-password");
        return;
      }
      setFeaturedError(
        err instanceof ApiError ? err.message : "Failed to save featured slots",
      );
    } finally {
      setSavingFeatured(false);
    }
  }

  if (loading || !me) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-5">
        <p className="text-athaq-cream/70">Loading products…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-athaq-teal">
            Al Athaq Boutique
          </p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl">Products</h1>
          <p className="mt-2 text-sm text-athaq-cream/70">
            {me.admin.email} · password days remaining: {me.daysRemaining}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/my-access-nimda/change-password"
            className="rounded-pill border border-white/20 px-4 py-2 hover:bg-white/10"
          >
            Change password
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-pill border border-white/20 px-4 py-2 hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </header>

      <section className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h2 className="font-display text-2xl">Featured (slots 1–4)</h2>
        <p className="mt-2 text-sm text-athaq-cream/70">
          Tag up to four products for the homepage featured bento. Leave a slot
          empty to clear it.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((position) => (
            <div key={position}>
              <label className="mb-1 block text-sm" htmlFor={`slot-${position}`}>
                {SLOT_LABELS[position]}
              </label>
              <select
                id={`slot-${position}`}
                value={slotDrafts[position] || ""}
                onChange={(e) =>
                  setSlotDrafts((d) => ({ ...d, [position]: e.target.value }))
                }
                className="min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3 outline-none focus:ring-2 focus:ring-athaq-teal"
              >
                <option value="">— empty —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        {featuredError ? (
          <p className="mt-4 rounded-2xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
            {featuredError}
          </p>
        ) : null}
        <button
          type="button"
          disabled={savingFeatured}
          onClick={saveFeaturedSlots}
          className="mt-5 rounded-pill bg-athaq-teal px-6 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {savingFeatured ? "Saving slots…" : "Save featured slots"}
        </button>
      </section>

      <section className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h2 className="font-display text-2xl">
          {editingId ? "Edit product" : "Create product"}
        </h2>
        <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          {(
            [
              ["slug", "Slug"],
              ["name", "Name"],
              ["category", "Category"],
              ["mediaUrl", "Media URL"],
              ["alt", "Alt text"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-sm" htmlFor={key}>
                {label}
              </label>
              <input
                id={key}
                required
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3 outline-none focus:ring-2 focus:ring-athaq-teal"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm" htmlFor="mediaType">
              Media type
            </label>
            <select
              id="mediaType"
              value={form.mediaType}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  mediaType: e.target.value as typeof form.mediaType,
                }))
              }
              className="min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3 outline-none focus:ring-2 focus:ring-athaq-teal"
            >
              <option value="image">image</option>
              <option value="video">video</option>
              <option value="svg">svg</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm" htmlFor="posterUrl">
              Poster URL (optional)
            </label>
            <input
              id="posterUrl"
              value={form.posterUrl}
              onChange={(e) => setForm((f) => ({ ...f, posterUrl: e.target.value }))}
              className="min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3 outline-none focus:ring-2 focus:ring-athaq-teal"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm" htmlFor="sortOrder">
              Sort order
            </label>
            <input
              id="sortOrder"
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))
              }
              className="min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3 outline-none focus:ring-2 focus:ring-athaq-teal"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2 outline-none focus:ring-2 focus:ring-athaq-teal"
            />
          </div>

          {error ? (
            <p className="md:col-span-2 rounded-2xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-pill bg-athaq-teal px-6 py-2.5 font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Update product" : "Create product"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-pill border border-white/20 px-6 py-2.5"
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <h2 className="font-display text-2xl">Catalog ({products.length})</h2>
        {products.length === 0 ? (
          <p className="mt-4 text-athaq-cream/70">
            No products in the database yet. Create one above.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-athaq-cream/60">
                    {p.slug} · {p.category} · order {p.sortOrder}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="rounded-pill border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    className="rounded-pill border border-red-400/40 px-3 py-1.5 text-sm text-red-200 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
