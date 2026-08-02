"use client";

import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { formatMoney } from "@/lib/money";

export default function CartPage() {
  const cart = useCart();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-athaq-cream px-5 pb-20 pt-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl text-athaq-ink">Your cart</h1>
          <p className="mt-2 text-athaq-ink/70">
            Prices shown in SAR. Totals are recalculated on the server at checkout.
          </p>

          {!cart.hydrated ? (
            <p className="mt-10 text-athaq-ink/60">Loading cart…</p>
          ) : cart.lines.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-athaq-ink/10 bg-white/50 p-8">
              <p>Your cart is empty.</p>
              <Link
                href="/#products"
                className="mt-4 inline-flex rounded-pill bg-athaq-teal px-5 py-2.5 font-semibold text-white"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-8 space-y-4">
                {cart.lines.map((line) => (
                  <li
                    key={line.variantId}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-athaq-ink/10 bg-white/60 px-5 py-4"
                  >
                    <div>
                      <p className="font-display text-xl">{line.productName}</p>
                      <p className="text-sm text-athaq-ink/60">
                        {line.variantLabel} · {formatMoney(line.unitPriceHalalas)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center rounded-pill border border-athaq-ink/15">
                        <button
                          type="button"
                          className="min-h-10 min-w-10"
                          onClick={() =>
                            cart.setQty(line.variantId, line.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="min-h-10 min-w-10"
                          onClick={() =>
                            cart.setQty(line.variantId, line.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="min-w-[5.5rem] text-end font-semibold">
                        {formatMoney(line.unitPriceHalalas * line.quantity)}
                      </p>
                      <button
                        type="button"
                        className="text-sm text-red-700/80"
                        onClick={() => cart.removeItem(line.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-athaq-ink/10 bg-white/70 p-6">
                <div>
                  <p className="text-sm text-athaq-ink/60">Subtotal (est.)</p>
                  <p className="font-display text-3xl">
                    {formatMoney(cart.subtotalHalalas)}
                  </p>
                </div>
                <Link
                  href="/checkout"
                  className="inline-flex min-h-12 items-center rounded-pill bg-athaq-purple px-8 font-semibold text-athaq-cream"
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
