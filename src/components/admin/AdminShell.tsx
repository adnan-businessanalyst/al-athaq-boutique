"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch, setStoredToken } from "@/lib/admin-api";

const NAV = [
  { href: "/my-access-nimda/products", label: "Products & pricing", match: "/products" },
  { href: "/my-access-nimda/shipping", label: "Shipping methods", match: "/shipping" },
  { href: "/my-access-nimda/delivery", label: "Delivery zones", match: "/delivery" },
  { href: "/my-access-nimda/commerce", label: "Policies & settings", match: "/commerce" },
  { href: "/my-access-nimda/orders", label: "Orders", match: "/orders" },
  { href: "/my-access-nimda/change-password", label: "Change password", match: "/change-password" },
] as const;

export function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/my-access-nimda";

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => undefined);
    setStoredToken(null);
    router.replace("/my-access-nimda");
  }

  if (isLogin) return <>{children}</>;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
      <aside className="shrink-0 md:w-56">
        <div className="sticky top-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-athaq-teal">
            Control panel
          </p>
          <p className="mt-1 font-display text-xl text-athaq-cream">Al Athaq</p>
          <nav className="mt-5 flex flex-col gap-1" aria-label="Admin">
            {NAV.map((item) => {
              const active = pathname.includes(item.match);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-pill px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-athaq-teal text-white"
                      : "text-athaq-cream/80 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={logout}
            className="mt-4 w-full rounded-pill border border-white/20 px-3 py-2 text-sm text-athaq-cream/80 hover:bg-white/10"
          >
            Log out
          </button>
          <Link
            href="/"
            className="mt-2 block text-center text-xs text-athaq-cream/50 hover:underline"
          >
            View storefront
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1 pb-16">
        {title ? (
          <header className="mb-6">
            <h1 className="font-display text-3xl text-athaq-cream md:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-athaq-cream/70">{subtitle}</p>
            ) : null}
          </header>
        ) : null}
        {children}
      </div>
    </div>
  );
}
