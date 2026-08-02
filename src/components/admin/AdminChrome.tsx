"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { usePathname } from "next/navigation";

/** Wraps authenticated CMS pages with sidebar navigation (skips login). */
export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/my-access-nimda") return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}
