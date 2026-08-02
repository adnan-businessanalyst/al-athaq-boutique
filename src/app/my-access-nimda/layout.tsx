import type { Metadata } from "next";
import { AdminChrome } from "@/components/admin/AdminChrome";

export const metadata: Metadata = {
  title: "Admin Access",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(120%_80%_at_50%_0%,#5a3488,#2b1a4d_55%,#1a1028)] text-athaq-cream">
      <AdminChrome>{children}</AdminChrome>
    </div>
  );
}
