const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(
  /\/$/,
  "",
);

export type AdminMe = {
  admin: { id: string; email: string };
  passwordExpired: boolean;
  daysRemaining: number;
  passwordChangedAt?: string;
};

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  mediaUrl: string;
  mediaType: "image" | "video" | "svg";
  posterUrl: string | null;
  alt: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ApiOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem("al_athaq_admin_token");
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.sessionStorage.setItem("al_athaq_admin_token", token);
  else window.sessionStorage.removeItem("al_athaq_admin_token");
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const token = options.token ?? getStoredToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method || "GET",
      headers,
      credentials: "include",
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError(
      `Cannot reach API at ${API_URL}. Is the Express server running (npm run dev:api)?`,
      0,
      "NETWORK",
    );
  }

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new ApiError(
      typeof data.error === "string" ? data.error : "Request failed",
      res.status,
      typeof data.code === "string" ? data.code : undefined,
    );
  }
  return data as T;
}

export { API_URL };
