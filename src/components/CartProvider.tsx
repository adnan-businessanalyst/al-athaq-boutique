"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clampQty } from "@/lib/money";

export type CartLine = {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantLabel: string;
  unitPriceHalalas: number;
  mediaUrl: string | null;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotalHalalas: number;
  hydrated: boolean;
  addItem: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "al_athaq_cart_v1";
const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((l) => l?.variantId && l.quantity > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotalHalalas = lines.reduce(
      (n, l) => n + l.unitPriceHalalas * l.quantity,
      0,
    );

    return {
      lines,
      itemCount,
      subtotalHalalas,
      hydrated,
      addItem(line, qty = 1) {
        const quantity = clampQty(qty);
        setLines((prev) => {
          const idx = prev.findIndex((l) => l.variantId === line.variantId);
          if (idx === -1) return [...prev, { ...line, quantity }];
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            quantity: clampQty(next[idx].quantity + quantity),
          };
          return next;
        });
      },
      setQty(variantId, quantity) {
        const q = Math.floor(quantity);
        setLines((prev) => {
          if (q <= 0) return prev.filter((l) => l.variantId !== variantId);
          return prev.map((l) =>
            l.variantId === variantId ? { ...l, quantity: clampQty(q) } : l,
          );
        });
      },
      removeItem(variantId) {
        setLines((prev) => prev.filter((l) => l.variantId !== variantId));
      },
      clear() {
        setLines([]);
      },
    };
  }, [lines, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
