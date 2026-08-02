"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { formatMoney } from "@/lib/money";
import { StoreApiError, storeFetch } from "@/lib/store-api";

type ConfirmOrder = {
  confirmationNumber: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  locationVerificationStatus: string;
  subtotalHalalas: number;
  shippingFeeHalalas: number;
  totalHalalas: number;
  currencyLabel: string;
  deliveryDate: string;
  fullName: string;
  email: string;
  zone: { name: string };
  slot: { label: string };
  items: {
    productName: string;
    variantLabel: string;
    quantity: number;
    lineTotalHalalas: number;
  }[];
  emailStubSentAt: string | null;
  whatsappUrl: string | null;
};

export default function OrderConfirmPage({
  params,
}: {
  params: { confirmationNumber: string };
}) {
  const [order, setOrder] = useState<ConfirmOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storeFetch<{ order: ConfirmOrder }>(
      `/orders/confirm/${encodeURIComponent(params.confirmationNumber)}`,
    )
      .then((r) => setOrder(r.order))
      .catch((err) =>
        setError(err instanceof StoreApiError ? err.message : "Not found"),
      );
  }, [params.confirmationNumber]);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-athaq-cream px-5 pb-20 pt-28">
        <div className="mx-auto max-w-2xl rounded-3xl border border-athaq-ink/10 bg-white/70 p-8">
          {!order && !error ? <p>Loading confirmation…</p> : null}
          {error ? (
            <>
              <h1 className="font-display text-3xl">Order not found</h1>
              <p className="mt-2 text-athaq-ink/70">{error}</p>
              <Link href="/" className="mt-4 inline-block text-athaq-teal underline">
                Home
              </Link>
            </>
          ) : null}
          {order ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-athaq-teal">
                Confirmed
              </p>
              <h1 className="mt-2 font-display text-4xl text-athaq-ink">
                Thank you, {order.fullName}
              </h1>
              <p className="mt-3 text-athaq-ink/75">
                Your confirmation number is{" "}
                <strong className="text-athaq-purple">{order.confirmationNumber}</strong>.
                Payment status: <strong>{order.paymentStatus}</strong> (no charge
                captured in this demo).
              </p>

              <div className="mt-6 space-y-2 text-sm">
                <p>
                  Delivery: {String(order.deliveryDate).slice(0, 10)} ·{" "}
                  {order.slot.label}
                </p>
                <p>Zone: {order.zone.name}</p>
                <p>Location: {order.locationVerificationStatus}</p>
                <p>Fulfillment: {order.fulfillmentStatus}</p>
              </div>

              <ul className="mt-6 space-y-2 border-t border-athaq-ink/10 pt-4 text-sm">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span>
                      {item.productName} ({item.variantLabel}) × {item.quantity}
                    </span>
                    <span>{formatMoney(item.lineTotalHalalas, order.currencyLabel)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatMoney(order.subtotalHalalas, order.currencyLabel)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatMoney(order.shippingFeeHalalas, order.currencyLabel)}</span>
                </div>
                <div className="flex justify-between font-display text-2xl">
                  <span>Total</span>
                  <span>{formatMoney(order.totalHalalas, order.currencyLabel)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-3 rounded-2xl bg-athaq-cream/80 p-4 text-sm">
                <p>
                  <strong>Email stub:</strong>{" "}
                  {order.emailStubSentAt
                    ? `Logged confirmation for ${order.email} (Mailgun not called).`
                    : "Pending stub log."}
                </p>
                {order.whatsappUrl ? (
                  <a
                    href={order.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-pill bg-[#25D366] px-5 py-2.5 font-semibold text-white"
                  >
                    Open WhatsApp (deep link stub)
                  </a>
                ) : (
                  <p>WhatsApp number not configured in admin settings.</p>
                )}
              </div>

              <Link
                href="/#products"
                className="mt-8 inline-flex rounded-pill bg-athaq-teal px-6 py-3 font-semibold text-white"
              >
                Continue shopping
              </Link>
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
