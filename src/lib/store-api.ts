function normalizeApiUrl(raw: string | undefined): string {
  const fallback = "http://localhost:4000";
  const value = (raw || fallback).trim().replace(/\/$/, "");
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return fallback;
  }
}

export const STORE_API_URL = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL);

const CUSTOMER_TOKEN_KEY = "al_athaq_customer_token";

export function getCustomerToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function setCustomerToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.sessionStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  else window.sessionStorage.removeItem(CUSTOMER_TOKEN_KEY);
}

export class StoreApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function storeFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  const token = options.token ?? getCustomerToken();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${STORE_API_URL}${path}`, {
      method: options.method || "GET",
      headers,
      credentials: "include",
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new StoreApiError(`Cannot reach API at ${STORE_API_URL}`, 0);
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new StoreApiError(
      typeof data.error === "string" ? data.error : "Request failed",
      res.status,
    );
  }
  return data as T;
}
