"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  apiFetch,
  setStoredToken,
  type AdminMe,
  type ApiFeatured,
  type ApiProduct,
} from "@/lib/admin-api";
import { formatMoney } from "@/lib/money";

type Variant = {
  id: string;
  label: string;
  size?: string | null;
  weightGrams?: number | null;
  priceHalalas: number;
  quantityAvailable?: number;
  isDefault: boolean;
  isActive?: boolean;
};

type ProductRow = ApiProduct & {
  longDescription?: string;
  variants?: Variant[];
};

type ShippingMethod = {
  id: string;
  name: string;
  description: string;
  feeHalalas: number;
  etaLabel: string | null;
  isActive: boolean;
};

type Policies = {
  purchasePolicy: string;
  deliveryInstructions: string;
  shippingPolicy: string;
  returnPolicy: string;
  orderPrefix: string;
  shopWhatsAppE164: string | null;
  currencyLabel: string;
};

type Tab = "catalog" | "editor" | "shipping" | "policies" | "featured";

const emptyProduct = {
  slug: "",
  name: "",
  description: "",
  longDescription: "",
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

function sarToHalalas(sar: string): number {
  const n = Number(sar);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

function halalasToSarInput(h: number): string {
  return (h / 100).toFixed(2);
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("catalog");
  const [me, setMe] = useState<AdminMe | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [featured, setFeatured] = useState<ApiFeatured[]>([]);
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [policies, setPolicies] = useState<Policies | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [variantDrafts, setVariantDrafts] = useState<
    Record<
      string,
      {
        label: string;
        size: string;
        weightGrams: string;
        priceSar: string;
        qty: string;
        isDefault: boolean;
      }
    >
  >({});
  const [newVariant, setNewVariant] = useState({
    label: "",
    size: "",
    weightGrams: "",
    priceSar: "89.00",
    qty: "10",
    isDefault: false,
  });
  const [shipForm, setShipForm] = useState({
    name: "",
    description: "",
    feeSar: "15.00",
    etaLabel: "",
  });
  const [slotDrafts, setSlotDrafts] = useState<Record<number, string>>({
    1: "",
    2: "",
    3: "",
    4: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const editingProduct = useMemo(
    () => products.find((p) => p.id === editingId) ?? null,
    [products, editingId],
  );

  const load = useCallback(async () => {
    const profile = await apiFetch<AdminMe>("/auth/me");
    if (profile.passwordExpired) {
      router.replace("/my-access-nimda/change-password");
      return;
    }
    setMe(profile);
    const [list, feat, ship, settings] = await Promise.all([
      apiFetch<{ products: ProductRow[] }>("/products"),
      apiFetch<{ featured: ApiFeatured[] }>("/featured"),
      apiFetch<{ methods: ShippingMethod[] }>("/admin/shipping-methods"),
      apiFetch<{ settings: Policies | null }>("/admin/commerce-settings"),
    ]);
    setProducts(list.products);
    setFeatured(feat.featured);
    setMethods(ship.methods);
    if (settings.settings) {
      setPolicies({
        ...settings.settings,
        shippingPolicy: settings.settings.shippingPolicy || "",
        returnPolicy: settings.settings.returnPolicy || "",
        shopWhatsAppE164: settings.settings.shopWhatsAppE164 || "",
      });
    }
    const drafts: Record<number, string> = { 1: "", 2: "", 3: "", 4: "" };
    for (const row of feat.featured) drafts[row.position] = row.productId;
    setSlotDrafts(drafts);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load().catch(() => {
      setStoredToken(null);
      router.replace("/my-access-nimda");
    });
  }, [load, router]);

  function openEditor(p: ProductRow) {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      name: p.name,
      description: p.description,
      longDescription: p.longDescription || "",
      category: p.category,
      mediaUrl: p.mediaUrl,
      mediaType: p.mediaType,
      posterUrl: p.posterUrl || "",
      alt: p.alt,
      sortOrder: p.sortOrder,
    });
    syncVariantDrafts(p);
    setTab("editor");
    setError(null);
    setOk(null);
  }

  function startCreate() {
    setEditingId(null);
    setForm(emptyProduct);
    setVariantDrafts({});
    setTab("editor");
    setError(null);
    setOk(null);
  }

  async function saveProduct(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOk(null);
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
        setOk("Product details saved.");
      } else {
        const created = await apiFetch<{ product: ProductRow }>("/products", {
          method: "POST",
          body: payload,
        });
        setEditingId(created.product.id);
        setOk("Product created — add sizes/prices below.");
      }
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveVariant(variantId: string) {
    const d = variantDrafts[variantId];
    if (!d) return;
    setError(null);
    try {
      await apiFetch(`/admin/variants/${variantId}`, {
        method: "PATCH",
        body: {
          label: d.label,
          size: d.size || null,
          weightGrams: d.weightGrams ? Number(d.weightGrams) : null,
          priceHalalas: sarToHalalas(d.priceSar),
          quantityAvailable: Number(d.qty) || 0,
          isDefault: d.isDefault,
        },
      });
      setOk("Variant updated.");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Variant save failed");
    }
  }

  async function addVariant(e: FormEvent) {
    e.preventDefault();
    if (!editingId) {
      setError("Save the product first, then add variants.");
      return;
    }
    setError(null);
    try {
      await apiFetch(`/admin/products/${editingId}/variants`, {
        method: "POST",
        body: {
          label: newVariant.label,
          size: newVariant.size || null,
          weightGrams: newVariant.weightGrams
            ? Number(newVariant.weightGrams)
            : null,
          priceHalalas: sarToHalalas(newVariant.priceSar),
          quantityAvailable: Number(newVariant.qty) || 0,
          isDefault: newVariant.isDefault,
        },
      });
      setNewVariant({
        label: "",
        size: "",
        weightGrams: "",
        priceSar: "89.00",
        qty: "10",
        isDefault: false,
      });
      setOk("Variant added.");
      await load();
      const list = await apiFetch<{ products: ProductRow[] }>("/products");
      const p = list.products.find((x) => x.id === editingId);
      if (p) syncVariantDrafts(p);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add variant");
    }
  }

  function syncVariantDrafts(p: ProductRow) {
    const vd: typeof variantDrafts = {};
    for (const v of p.variants || []) {
      vd[v.id] = {
        label: v.label,
        size: v.size || "",
        weightGrams: v.weightGrams != null ? String(v.weightGrams) : "",
        priceSar: halalasToSarInput(v.priceHalalas),
        qty: String(v.quantityAvailable ?? 0),
        isDefault: v.isDefault,
      };
    }
    setVariantDrafts(vd);
  }

  async function deleteVariant(id: string) {
    if (!window.confirm("Delete this size/price option?")) return;
    await apiFetch(`/admin/variants/${id}`, { method: "DELETE" });
    await load();
    if (editingId) {
      const p = (await apiFetch<{ products: ProductRow[] }>("/products")).products.find(
        (x) => x.id === editingId,
      );
      if (p) syncVariantDrafts(p);
    }
  }

  async function saveFeatured() {
    setError(null);
    try {
      for (const position of [1, 2, 3, 4] as const) {
        const productId = slotDrafts[position]?.trim();
        const current = featured.find((f) => f.position === position);
        if (!productId) {
          if (current) await apiFetch(`/featured/${position}`, { method: "DELETE" });
          continue;
        }
        if (current?.productId === productId) continue;
        await apiFetch(`/featured/${position}`, {
          method: "PUT",
          body: { productId },
        });
      }
      setOk("Featured slots saved.");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Featured save failed");
    }
  }

  async function saveShipping(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch("/admin/shipping-methods", {
        method: "POST",
        body: {
          name: shipForm.name,
          description: shipForm.description,
          feeHalalas: sarToHalalas(shipForm.feeSar),
          etaLabel: shipForm.etaLabel || null,
          isActive: true,
        },
      });
      setShipForm({ name: "", description: "", feeSar: "15.00", etaLabel: "" });
      setOk("Shipping method created.");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Shipping save failed");
    }
  }

  async function savePolicies(e: FormEvent) {
    e.preventDefault();
    if (!policies) return;
    setError(null);
    try {
      await apiFetch("/admin/commerce-settings", {
        method: "PUT",
        body: {
          ...policies,
          shopWhatsAppE164: policies.shopWhatsAppE164 || null,
        },
      });
      setOk("Policies saved.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Policy save failed");
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "catalog", label: "Catalog" },
    { id: "editor", label: editingId ? "Edit product" : "New product" },
    { id: "shipping", label: "Shipping prices" },
    { id: "policies", label: "Policies" },
    { id: "featured", label: "Featured" },
  ];

  if (loading || !me) {
    return <p className="text-athaq-cream/70">Loading control panel…</p>;
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl">Products & commerce</h1>
        <p className="mt-2 text-sm text-athaq-cream/70">
          {me.admin.email} · edit prices, stock, shipping, and policies here
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-pill px-4 py-2 text-sm font-semibold ${
              tab === t.id
                ? "bg-athaq-teal text-white"
                : "border border-white/20 text-athaq-cream/80 hover:bg-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={startCreate}
          className="rounded-pill border border-athaq-teal/50 px-4 py-2 text-sm font-semibold text-athaq-teal"
        >
          + New product
        </button>
      </div>

      {error ? (
        <p className="mb-4 rounded-2xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="mb-4 rounded-2xl bg-athaq-teal/20 px-4 py-3 text-sm text-athaq-cream">
          {ok}
        </p>
      ) : null}

      {tab === "catalog" ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-display text-2xl">Catalog ({products.length})</h2>
          <p className="mt-1 text-sm text-athaq-cream/60">
            Click a product to edit sizes, weights, SAR prices, and stock.
          </p>
          <ul className="mt-5 space-y-3">
            {products.map((p) => {
              const def =
                p.variants?.find((v) => v.isDefault) ?? p.variants?.[0];
              return (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-athaq-cream/55">
                      {p.slug} · {p.variants?.length ?? 0} option(s)
                      {def
                        ? ` · from ${formatMoney(def.priceHalalas)} · stock ${def.quantityAvailable ?? 0}`
                        : " · no prices yet"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openEditor(p)}
                    className="rounded-pill bg-athaq-teal px-4 py-2 text-sm font-semibold text-white"
                  >
                    Edit prices & details
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {tab === "editor" ? (
        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-display text-2xl">
              {editingId ? "Product details" : "Create product"}
            </h2>
            <form onSubmit={saveProduct} className="mt-4 grid gap-3 md:grid-cols-2">
              {(
                [
                  ["name", "Name"],
                  ["slug", "Slug"],
                  ["category", "Category"],
                  ["mediaUrl", "Media URL"],
                  ["posterUrl", "Poster URL (optional)"],
                  ["alt", "Alt text"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="text-sm">
                  {label}
                  <input
                    required={key !== "posterUrl"}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
                  />
                </label>
              ))}
              <label className="text-sm">
                Media type
                <select
                  value={form.mediaType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      mediaType: e.target.value as "image" | "video" | "svg",
                    }))
                  }
                  className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
                >
                  <option value="image">image</option>
                  <option value="video">video</option>
                  <option value="svg">svg</option>
                </select>
              </label>
              <label className="text-sm">
                Sort order
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sortOrder: Number(e.target.value) || 0,
                    }))
                  }
                  className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
                />
              </label>
              <label className="text-sm md:col-span-2">
                Short description
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
                />
              </label>
              <label className="text-sm md:col-span-2">
                Long description (PDP)
                <textarea
                  rows={3}
                  value={form.longDescription}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, longDescription: e.target.value }))
                  }
                  className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="rounded-pill bg-athaq-teal px-6 py-2.5 font-semibold text-white md:col-span-2"
              >
                {saving ? "Saving…" : editingId ? "Save product details" : "Create product"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-athaq-teal/30 bg-athaq-teal/10 p-5">
            <h2 className="font-display text-2xl">Prices, sizes, weights & stock</h2>
            <p className="mt-1 text-sm text-athaq-cream/70">
              Enter prices in SAR (e.g. 89.00). Stock is quantity available.
              {!editingId ? " Save the product first to add options." : null}
            </p>

            {editingProduct?.variants?.length ? (
              <div className="mt-4 space-y-4">
                {editingProduct.variants.map((v) => {
                  const d = variantDrafts[v.id];
                  if (!d) return null;
                  return (
                    <div
                      key={v.id}
                      className="grid gap-2 rounded-2xl border border-white/10 bg-black/25 p-4 md:grid-cols-6"
                    >
                      <label className="text-xs md:col-span-2">
                        Label
                        <input
                          value={d.label}
                          onChange={(e) =>
                            setVariantDrafts((prev) => ({
                              ...prev,
                              [v.id]: { ...d, label: e.target.value },
                            }))
                          }
                          className="mt-1 min-h-10 w-full rounded-xl border border-white/15 bg-black/30 px-2"
                        />
                      </label>
                      <label className="text-xs">
                        Size
                        <input
                          value={d.size}
                          onChange={(e) =>
                            setVariantDrafts((prev) => ({
                              ...prev,
                              [v.id]: { ...d, size: e.target.value },
                            }))
                          }
                          className="mt-1 min-h-10 w-full rounded-xl border border-white/15 bg-black/30 px-2"
                        />
                      </label>
                      <label className="text-xs">
                        Weight (g)
                        <input
                          type="number"
                          value={d.weightGrams}
                          onChange={(e) =>
                            setVariantDrafts((prev) => ({
                              ...prev,
                              [v.id]: { ...d, weightGrams: e.target.value },
                            }))
                          }
                          className="mt-1 min-h-10 w-full rounded-xl border border-white/15 bg-black/30 px-2"
                        />
                      </label>
                      <label className="text-xs">
                        Price (SAR)
                        <input
                          value={d.priceSar}
                          onChange={(e) =>
                            setVariantDrafts((prev) => ({
                              ...prev,
                              [v.id]: { ...d, priceSar: e.target.value },
                            }))
                          }
                          className="mt-1 min-h-10 w-full rounded-xl border border-white/15 bg-black/30 px-2"
                        />
                      </label>
                      <label className="text-xs">
                        Qty available
                        <input
                          type="number"
                          min={0}
                          value={d.qty}
                          onChange={(e) =>
                            setVariantDrafts((prev) => ({
                              ...prev,
                              [v.id]: { ...d, qty: e.target.value },
                            }))
                          }
                          className="mt-1 min-h-10 w-full rounded-xl border border-white/15 bg-black/30 px-2"
                        />
                      </label>
                      <div className="flex flex-wrap items-end gap-2 md:col-span-6">
                        <label className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={d.isDefault}
                            onChange={(e) =>
                              setVariantDrafts((prev) => ({
                                ...prev,
                                [v.id]: { ...d, isDefault: e.target.checked },
                              }))
                            }
                          />
                          Default option
                        </label>
                        <button
                          type="button"
                          onClick={() => saveVariant(v.id)}
                          className="rounded-pill bg-athaq-teal px-4 py-2 text-sm font-semibold"
                        >
                          Save option
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteVariant(v.id)}
                          className="rounded-pill border border-red-400/40 px-4 py-2 text-sm text-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm text-athaq-cream/60">
                No size/price options yet.
              </p>
            )}

            <form
              onSubmit={addVariant}
              className="mt-6 grid gap-2 border-t border-white/10 pt-5 md:grid-cols-6"
            >
              <p className="text-sm font-semibold md:col-span-6">Add option</p>
              <input
                required
                placeholder="Label"
                value={newVariant.label}
                onChange={(e) =>
                  setNewVariant((f) => ({ ...f, label: e.target.value }))
                }
                className="min-h-10 rounded-xl border border-white/15 bg-black/30 px-2 md:col-span-2"
              />
              <input
                placeholder="Size"
                value={newVariant.size}
                onChange={(e) =>
                  setNewVariant((f) => ({ ...f, size: e.target.value }))
                }
                className="min-h-10 rounded-xl border border-white/15 bg-black/30 px-2"
              />
              <input
                type="number"
                placeholder="Weight g"
                value={newVariant.weightGrams}
                onChange={(e) =>
                  setNewVariant((f) => ({ ...f, weightGrams: e.target.value }))
                }
                className="min-h-10 rounded-xl border border-white/15 bg-black/30 px-2"
              />
              <input
                required
                placeholder="Price SAR"
                value={newVariant.priceSar}
                onChange={(e) =>
                  setNewVariant((f) => ({ ...f, priceSar: e.target.value }))
                }
                className="min-h-10 rounded-xl border border-white/15 bg-black/30 px-2"
              />
              <input
                type="number"
                required
                placeholder="Qty"
                value={newVariant.qty}
                onChange={(e) =>
                  setNewVariant((f) => ({ ...f, qty: e.target.value }))
                }
                className="min-h-10 rounded-xl border border-white/15 bg-black/30 px-2"
              />
              <button
                type="submit"
                className="rounded-pill bg-white/15 py-2 text-sm font-semibold md:col-span-6"
              >
                Add size / price option
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-display text-xl">Also manage from here</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTab("shipping")}
                className="rounded-pill border border-white/20 px-4 py-2 text-sm"
              >
                Shipping prices →
              </button>
              <button
                type="button"
                onClick={() => setTab("policies")}
                className="rounded-pill border border-white/20 px-4 py-2 text-sm"
              >
                Shipping & return policies →
              </button>
              <button
                type="button"
                onClick={() => setTab("featured")}
                className="rounded-pill border border-white/20 px-4 py-2 text-sm"
              >
                Featured homepage slots →
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {tab === "shipping" ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-display text-2xl">Shipping methods & fees</h2>
          <p className="mt-1 text-sm text-athaq-cream/65">
            Checkout total shipping = method fee + delivery-zone surcharge. Edit
            zones under <strong>Delivery zones</strong> in the sidebar.
          </p>
          <ul className="mt-4 space-y-2">
            {methods.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-black/20 px-4 py-3 text-sm"
              >
                <span>
                  {m.name} · {formatMoney(m.feeHalalas)}
                  {m.etaLabel ? ` · ${m.etaLabel}` : ""}
                  {!m.isActive ? " (inactive)" : ""}
                </span>
                <button
                  type="button"
                  className="text-red-200"
                  onClick={async () => {
                    await apiFetch(`/admin/shipping-methods/${m.id}`, {
                      method: "DELETE",
                    });
                    await load();
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={saveShipping} className="mt-5 grid gap-3 md:grid-cols-2">
            <input
              required
              placeholder="Method name"
              value={shipForm.name}
              onChange={(e) => setShipForm((f) => ({ ...f, name: e.target.value }))}
              className="min-h-11 rounded-2xl border border-white/15 bg-black/20 px-3"
            />
            <input
              required
              placeholder="Fee SAR (e.g. 15.00)"
              value={shipForm.feeSar}
              onChange={(e) => setShipForm((f) => ({ ...f, feeSar: e.target.value }))}
              className="min-h-11 rounded-2xl border border-white/15 bg-black/20 px-3"
            />
            <input
              placeholder="ETA label"
              value={shipForm.etaLabel}
              onChange={(e) =>
                setShipForm((f) => ({ ...f, etaLabel: e.target.value }))
              }
              className="min-h-11 rounded-2xl border border-white/15 bg-black/20 px-3 md:col-span-2"
            />
            <textarea
              placeholder="Description"
              rows={2}
              value={shipForm.description}
              onChange={(e) =>
                setShipForm((f) => ({ ...f, description: e.target.value }))
              }
              className="rounded-2xl border border-white/15 bg-black/20 px-3 py-2 md:col-span-2"
            />
            <button
              type="submit"
              className="rounded-pill bg-athaq-teal py-2.5 font-semibold md:col-span-2"
            >
              Add shipping method
            </button>
          </form>
        </section>
      ) : null}

      {tab === "policies" && policies ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-display text-2xl">Shipping & return policies</h2>
          <form onSubmit={savePolicies} className="mt-4 space-y-3">
            <label className="block text-sm">
              Delivery instructions
              <textarea
                required
                rows={3}
                value={policies.deliveryInstructions}
                onChange={(e) =>
                  setPolicies({ ...policies, deliveryInstructions: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              Shipping policy
              <textarea
                rows={4}
                value={policies.shippingPolicy}
                onChange={(e) =>
                  setPolicies({ ...policies, shippingPolicy: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              Return policy
              <textarea
                rows={4}
                value={policies.returnPolicy}
                onChange={(e) =>
                  setPolicies({ ...policies, returnPolicy: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              Purchase policy
              <textarea
                required
                rows={4}
                value={policies.purchasePolicy}
                onChange={(e) =>
                  setPolicies({ ...policies, purchasePolicy: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-white/15 bg-black/20 px-3 py-2"
              />
            </label>
            <button
              type="submit"
              className="rounded-pill bg-athaq-teal px-6 py-2.5 font-semibold"
            >
              Save policies
            </button>
          </form>
        </section>
      ) : null}

      {tab === "featured" ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-display text-2xl">Featured homepage slots</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((position) => (
              <label key={position} className="text-sm">
                {SLOT_LABELS[position]}
                <select
                  value={slotDrafts[position] || ""}
                  onChange={(e) =>
                    setSlotDrafts((d) => ({ ...d, [position]: e.target.value }))
                  }
                  className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
                >
                  <option value="">— empty —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={saveFeatured}
            className="mt-4 rounded-pill bg-athaq-teal px-6 py-2.5 font-semibold"
          >
            Save featured slots
          </button>
        </section>
      ) : null}
    </div>
  );
}
