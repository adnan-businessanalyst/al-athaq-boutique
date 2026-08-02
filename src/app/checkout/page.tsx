"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { formatMoney } from "@/lib/money";
import {
  StoreApiError,
  getCustomerToken,
  setCustomerToken,
  storeFetch,
} from "@/lib/store-api";

type Zone = {
  id: string;
  name: string;
  city: string;
  district: string | null;
  country: string;
  shippingFeeHalalas: number;
  etaLabel: string | null;
  leadTimeDaysMin: number;
  slots: { id: string; label: string }[];
};

type CommerceSettings = {
  purchasePolicy: string;
  deliveryInstructions: string;
  shippingPolicy: string;
  returnPolicy: string;
  currencyLabel: string;
};

type ShippingMethod = {
  id: string;
  name: string;
  description: string;
  feeHalalas: number;
  etaLabel: string | null;
};

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const [mode, setMode] = useState<"guest" | "account">("guest");
  const [settings, setSettings] = useState<CommerceSettings | null>(null);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [shippingMethodId, setShippingMethodId] = useState("");
  const [zones, setZones] = useState<Zone[]>([]);
  const [matchedZones, setMatchedZones] = useState<Zone[]>([]);
  const [customer, setCustomer] = useState<{
    email: string;
    name: string | null;
    phone: string | null;
  } | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("Riyadh");
  const [district, setDistrict] = useState("Olaya");
  const [country, setCountry] = useState("SA");
  const [zoneId, setZoneId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [locationMsg, setLocationMsg] = useState<string | null>(null);

  useEffect(() => {
    storeFetch<{ settings: CommerceSettings }>("/catalog/commerce-settings")
      .then((r) => setSettings(r.settings))
      .catch(() => setSettings(null));
    storeFetch<{ zones: Zone[] }>("/delivery/zones")
      .then((r) => setZones(r.zones))
      .catch(() => setZones([]));
    storeFetch<{ methods: ShippingMethod[] }>("/catalog/shipping-methods")
      .then((r) => {
        setShippingMethods(r.methods);
        if (r.methods[0]) setShippingMethodId(r.methods[0].id);
      })
      .catch(() => setShippingMethods([]));
    storeFetch<{ customer: typeof customer }>("/customer/me")
      .then((r) => {
        if (r.customer) {
          setCustomer(r.customer);
          setMode("account");
          setEmail(r.customer.email);
          setFullName(r.customer.name || "");
          setPhone(r.customer.phone || "");
        }
      })
      .catch(() => undefined);

    const t = new Date();
    t.setDate(t.getDate() + 1);
    setDeliveryDate(t.toISOString().slice(0, 10));
  }, []);

  const selectedZone = useMemo(
    () => matchedZones.find((z) => z.id === zoneId) ?? null,
    [matchedZones, zoneId],
  );

  const selectedMethod =
    shippingMethods.find((m) => m.id === shippingMethodId) ?? null;
  const shipping =
    (selectedMethod?.feeHalalas ?? 0) + (selectedZone?.shippingFeeHalalas ?? 0);
  const estTotal = cart.subtotalHalalas + shipping;

  async function validateLocation() {
    setError(null);
    setLocationMsg(null);
    try {
      const result = await storeFetch<{
        ok: boolean;
        verified: boolean;
        message: string;
        zones: Zone[];
      }>("/delivery/validate", {
        method: "POST",
        body: { country, city, district: district || null },
      });
      setMatchedZones(result.zones || []);
      setLocationMsg(result.message);
      if (result.zones?.[0]) {
        setZoneId(result.zones[0].id);
        setSlotId(result.zones[0].slots[0]?.id || "");
      } else {
        setZoneId("");
        setSlotId("");
      }
    } catch (err) {
      setMatchedZones([]);
      setError(err instanceof StoreApiError ? err.message : "Validation failed");
    }
  }

  async function onAuth(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // If already logged in, skip
      if (customer) {
        setBusy(false);
        return;
      }
      const useRegister = mode === "account" && password.length >= 8 && !getCustomerToken();
      // Prefer login when mode account; register via toggle below
      const result = await storeFetch<{
        token?: string;
        customer: { email: string; name: string | null; phone: string | null };
      }>(useRegister ? "/customer/register" : "/customer/login", {
        method: "POST",
        body: useRegister
          ? { email, password, name: fullName, phone }
          : { email, password },
      });
      if (result.token) setCustomerToken(result.token);
      setCustomer(result.customer);
      setFullName(result.customer.name || fullName);
      setPhone(result.customer.phone || phone);
    } catch (err) {
      // try register if login failed
      if (mode === "account") {
        try {
          const result = await storeFetch<{
            token?: string;
            customer: { email: string; name: string | null; phone: string | null };
          }>("/customer/register", {
            method: "POST",
            body: { email, password, name: fullName, phone },
          });
          if (result.token) setCustomerToken(result.token);
          setCustomer(result.customer);
        } catch (err2) {
          setError(err2 instanceof StoreApiError ? err2.message : "Auth failed");
        }
      } else {
        setError(err instanceof StoreApiError ? err.message : "Auth failed");
      }
    } finally {
      setBusy(false);
    }
  }

  async function placeOrder(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!policyAccepted) {
      setError("Please accept the purchase policy.");
      return;
    }
    if (!zoneId || !slotId || !deliveryDate || !shippingMethodId) {
      setError(
        "Select a verified zone, shipping method, delivery date, and time slot.",
      );
      return;
    }
    if (cart.lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setBusy(true);
    try {
      const payload = {
        items: cart.lines.map((l) => ({
          variantId: l.variantId,
          quantity: l.quantity,
        })),
        guest: customer
          ? { email: customer.email, phone, fullName }
          : { email, phone, fullName },
        address: {
          line1,
          line2: line2 || null,
          city,
          district: district || null,
          country,
          notes: notes || null,
        },
        zoneId,
        slotId,
        shippingMethodId,
        deliveryDate,
        policyAccepted: true as const,
        customerNotes: notes || null,
      };

      const result = await storeFetch<{
        order: { confirmationNumber: string };
      }>("/orders", { method: "POST", body: payload });

      cart.clear();
      router.push(`/order/confirm/${result.order.confirmationNumber}`);
    } catch (err) {
      setError(err instanceof StoreApiError ? err.message : "Order failed");
    } finally {
      setBusy(false);
    }
  }

  if (cart.hydrated && cart.lines.length === 0) {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-athaq-cream px-5 pt-28">
          <div className="mx-auto max-w-lg rounded-3xl border border-athaq-ink/10 bg-white/60 p-8">
            <h1 className="font-display text-3xl">Checkout</h1>
            <p className="mt-3">Your cart is empty.</p>
            <Link href="/#products" className="mt-4 inline-block text-athaq-teal underline">
              Browse products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-athaq-cream px-5 pb-20 pt-28">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="font-display text-4xl text-athaq-ink">Checkout</h1>
            <p className="mt-2 text-athaq-ink/70">
              Delivery only — no online payment in this demo. Orders are saved as UNPAID.
            </p>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setMode("guest")}
                className={`rounded-pill px-4 py-2 text-sm font-semibold ${mode === "guest" ? "bg-athaq-purple text-white" : "border border-athaq-ink/15"}`}
              >
                Guest
              </button>
              <button
                type="button"
                onClick={() => setMode("account")}
                className={`rounded-pill px-4 py-2 text-sm font-semibold ${mode === "account" ? "bg-athaq-purple text-white" : "border border-athaq-ink/15"}`}
              >
                Account
              </button>
            </div>

            {mode === "account" && !customer ? (
              <form onSubmit={onAuth} className="mt-6 space-y-3 rounded-3xl border border-athaq-ink/10 bg-white/60 p-5">
                <p className="text-sm text-athaq-ink/70">
                  Login or register (same form — we try login, then register).
                </p>
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
                />
                <input
                  required
                  type="password"
                  placeholder="Password (min 8 to register)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
                />
                <input
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
                />
                <input
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-pill bg-athaq-teal px-5 py-2.5 font-semibold text-white"
                >
                  Continue with account
                </button>
              </form>
            ) : null}

            {customer ? (
              <p className="mt-4 rounded-2xl bg-athaq-teal/10 px-4 py-3 text-sm">
                Signed in as <strong>{customer.email}</strong>
              </p>
            ) : null}

            <form onSubmit={placeOrder} className="mt-6 space-y-4 rounded-3xl border border-athaq-ink/10 bg-white/60 p-5">
              <h2 className="font-display text-2xl">Contact & address</h2>
              {!customer ? (
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
                />
              ) : null}
              <input
                required
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
              />
              <input
                required
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
              />
              <input
                required
                placeholder="Address line 1"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className="min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
              />
              <input
                placeholder="Address line 2"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className="min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="min-h-11 rounded-2xl border border-athaq-ink/15 px-3"
                />
                <input
                  placeholder="District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="min-h-11 rounded-2xl border border-athaq-ink/15 px-3"
                />
                <input
                  required
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="min-h-11 rounded-2xl border border-athaq-ink/15 px-3"
                />
              </div>
              <button
                type="button"
                onClick={validateLocation}
                className="rounded-pill border border-athaq-teal px-5 py-2 text-sm font-semibold text-athaq-teal"
              >
                Validate delivery location
              </button>
              {locationMsg ? (
                <p className="text-sm text-athaq-ink/70">{locationMsg}</p>
              ) : null}

              {matchedZones.length > 0 ? (
                <>
                  <label className="block text-sm">
                    Delivery zone
                    <select
                      required
                      value={zoneId}
                      onChange={(e) => {
                        setZoneId(e.target.value);
                        const z = matchedZones.find((x) => x.id === e.target.value);
                        setSlotId(z?.slots[0]?.id || "");
                      }}
                      className="mt-1 min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
                    >
                      {matchedZones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} · ship {formatMoney(z.shippingFeeHalalas)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    Shipping method
                    <select
                      required
                      value={shippingMethodId}
                      onChange={(e) => setShippingMethodId(e.target.value)}
                      className="mt-1 min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
                    >
                      {shippingMethods.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} · {formatMoney(m.feeHalalas)}
                          {m.etaLabel ? ` · ${m.etaLabel}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    Delivery date
                    <input
                      required
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="mt-1 min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
                    />
                  </label>
                  <label className="block text-sm">
                    Time slot
                    <select
                      required
                      value={slotId}
                      onChange={(e) => setSlotId(e.target.value)}
                      className="mt-1 min-h-11 w-full rounded-2xl border border-athaq-ink/15 px-3"
                    >
                      {(selectedZone?.slots || []).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                <p className="text-sm text-athaq-ink/60">
                  Available demo zones:{" "}
                  {zones.map((z) => `${z.city}${z.district ? ` / ${z.district}` : ""}`).join(" · ") ||
                    "load API"}
                </p>
              )}

              <textarea
                placeholder="Delivery notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-2xl border border-athaq-ink/15 px-3 py-2"
              />

              {settings ? (
                <div className="space-y-3 rounded-2xl bg-athaq-cream/80 p-4 text-sm leading-relaxed text-athaq-ink/80">
                  <div>
                    <p className="font-semibold text-athaq-ink">Delivery instructions</p>
                    <p className="mt-1 whitespace-pre-line">{settings.deliveryInstructions}</p>
                  </div>
                  {settings.shippingPolicy ? (
                    <div>
                      <p className="font-semibold text-athaq-ink">Shipping policy</p>
                      <p className="mt-1 max-h-32 overflow-y-auto whitespace-pre-line">
                        {settings.shippingPolicy}
                      </p>
                    </div>
                  ) : null}
                  {settings.returnPolicy ? (
                    <div>
                      <p className="font-semibold text-athaq-ink">Return policy</p>
                      <p className="mt-1 max-h-32 overflow-y-auto whitespace-pre-line">
                        {settings.returnPolicy}
                      </p>
                    </div>
                  ) : null}
                  <div>
                    <p className="font-semibold text-athaq-ink">Purchase policy</p>
                    <p className="mt-1 max-h-40 overflow-y-auto whitespace-pre-line">
                      {settings.purchasePolicy}
                    </p>
                  </div>
                </div>
              ) : null}

              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={policyAccepted}
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                  className="mt-1"
                />
                <span>I accept the purchase policy and delivery instructions.</span>
              </label>

              {error ? (
                <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-800">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={
                  busy ||
                  !policyAccepted ||
                  !zoneId ||
                  !slotId ||
                  !shippingMethodId
                }
                className="w-full rounded-pill bg-athaq-purple py-3 font-semibold text-athaq-cream disabled:opacity-50"
              >
                {busy ? "Placing order…" : "Place order (no payment)"}
              </button>
            </form>
          </div>

          <aside className="h-fit rounded-3xl border border-athaq-ink/10 bg-white/70 p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl">Order summary</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {cart.lines.map((l) => (
                <li key={l.variantId} className="flex justify-between gap-3">
                  <span>
                    {l.productName} × {l.quantity}
                    <span className="block text-athaq-ink/50">{l.variantLabel}</span>
                  </span>
                  <span className="font-medium">
                    {formatMoney(l.unitPriceHalalas * l.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-athaq-ink/10 pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(cart.subtotalHalalas)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{selectedZone ? formatMoney(shipping) : "—"}</span>
              </div>
              <div className="flex justify-between font-display text-xl">
                <span>Total est.</span>
                <span>{formatMoney(estTotal)}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
