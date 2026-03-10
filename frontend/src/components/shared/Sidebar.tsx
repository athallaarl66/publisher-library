"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Users, Building2, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/authors", label: "Authors", icon: Users },
  { href: "/publishers", label: "Publishers", icon: Building2 },
  { href: "/books", label: "Books", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  // Hindari hydration mismatch — baca store setelah mount di client
  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const user = useAuthStore.getState().user;
    setUserName(user?.name ?? "");
  }, []);

  // Tutup mobile menu kalau navigasi
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    logout();
    router.push("/login");
  };

  const SidebarContent = () => (
    <aside className="w-64 h-full bg-sidebar flex flex-col">
      <div className="px-6 py-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          📚 Publishing
        </h1>
        <p className="text-xs text-sidebar-foreground/60 mt-0.5">
          Platform Manajemen
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-sidebar-foreground/60">Logged in as</p>
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {userName}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block min-h-screen w-64 shrink-0">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-bold text-sidebar-foreground">
          📚 Publishing
        </h1>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-sidebar-foreground"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed top-0 left-0 h-full z-50 w-64">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
}
