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

type Slot = {
  id: string;
  label: string;
  startTime: string | null;
  endTime: string | null;
  isActive: boolean;
  sortOrder: number;
};

type Zone = {
  id: string;
  name: string;
  country: string;
  city: string;
  district: string | null;
  shippingFeeHalalas: number;
  leadTimeDaysMin: number;
  leadTimeDaysMax: number;
  etaLabel: string | null;
  isActive: boolean;
  slots: Slot[];
};

export default function AdminDeliveryPage() {
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [zoneForm, setZoneForm] = useState({
    name: "",
    country: "SA",
    city: "",
    district: "",
    surchargeSar: "25.00",
    leadTimeDaysMin: 1,
    leadTimeDaysMax: 3,
    etaLabel: "",
  });
  const [slotForm, setSlotForm] = useState({
    zoneId: "",
    label: "",
    startTime: "",
    endTime: "",
  });

  async function load() {
    const r = await apiFetch<{ zones: Zone[] }>("/admin/zones");
    setZones(r.zones);
    if (!slotForm.zoneId && r.zones[0]) {
      setSlotForm((s) => ({ ...s, zoneId: r.zones[0].id }));
    }
  }

  useEffect(() => {
    load().catch(() => {
      setStoredToken(null);
      router.replace("/my-access-nimda");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function createZone(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch("/admin/zones", {
        method: "POST",
        body: {
          ...zoneForm,
          district: zoneForm.district || null,
          etaLabel: zoneForm.etaLabel || null,
          shippingFeeHalalas: sarToHalalas(zoneForm.surchargeSar),
        },
      });
      setZoneForm({
        name: "",
        country: "SA",
        city: "",
        district: "",
        surchargeSar: "25.00",
        leadTimeDaysMin: 1,
        leadTimeDaysMax: 3,
        etaLabel: "",
      });
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed");
    }
  }

  async function createSlot(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch("/admin/slots", {
        method: "POST",
        body: {
          zoneId: slotForm.zoneId,
          label: slotForm.label,
          startTime: slotForm.startTime || null,
          endTime: slotForm.endTime || null,
        },
      });
      setSlotForm((s) => ({ ...s, label: "", startTime: "", endTime: "" }));
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl md:text-4xl">Delivery zones & slots</h1>
      <p className="mt-2 text-sm text-athaq-cream/70">
        Zone surcharge is added on top of the shipping method fee at checkout.
      </p>
      {error ? <p className="mt-3 text-red-200">{error}</p> : null}

      <form onSubmit={createZone} className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
        <h2 className="md:col-span-2 font-display text-xl">Add zone</h2>
        {(
          [
            ["name", "Name"],
            ["city", "City"],
            ["district", "District"],
            ["country", "Country"],
            ["etaLabel", "ETA label"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="text-sm">
            {label}
            <input
              required={key === "name" || key === "city" || key === "country"}
              value={zoneForm[key]}
              onChange={(e) => setZoneForm((f) => ({ ...f, [key]: e.target.value }))}
              className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
            />
          </label>
        ))}
        <label className="text-sm">
          Zone surcharge (SAR)
          <input
            required
            value={zoneForm.surchargeSar}
            onChange={(e) =>
              setZoneForm((f) => ({
                ...f,
                surchargeSar: e.target.value,
              }))
            }
            className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
          />
          <span className="mt-1 block text-xs text-athaq-cream/50">
            = {formatMoney(sarToHalalas(zoneForm.surchargeSar))}
          </span>
        </label>
        <button type="submit" className="md:col-span-2 rounded-pill bg-athaq-teal py-2.5 font-semibold">
          Create zone
        </button>
      </form>

      <form onSubmit={createSlot} className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
        <h2 className="md:col-span-2 font-display text-xl">Add slot</h2>
        <label className="text-sm md:col-span-2">
          Zone
          <select
            required
            value={slotForm.zoneId}
            onChange={(e) => setSlotForm((s) => ({ ...s, zoneId: e.target.value }))}
            className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm md:col-span-2">
          Label
          <input
            required
            value={slotForm.label}
            onChange={(e) => setSlotForm((s) => ({ ...s, label: e.target.value }))}
            className="mt-1 min-h-11 w-full rounded-2xl border border-white/15 bg-black/20 px-3"
          />
        </label>
        <button type="submit" className="md:col-span-2 rounded-pill bg-athaq-teal py-2.5 font-semibold">
          Create slot
        </button>
      </form>

      <ul className="mt-8 space-y-4">
        {zones.map((z) => (
          <li key={z.id} className="rounded-3xl border border-white/10 bg-black/20 p-5">
            <p className="font-medium">
              {z.name} · {z.city}
              {z.district ? ` / ${z.district}` : ""} ·{" "}
              {formatMoney(z.shippingFeeHalalas)}
            </p>
            <ul className="mt-2 text-sm text-athaq-cream/70">
              {z.slots.map((s) => (
                <li key={s.id}>• {s.label}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
