"use client";

import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, theme, role")
        .eq("id", user.id)
        .single();
      setProfile(profile);
    }
    getData();
  }, []);

  if (!user) return null;

  const userData = {
    id: user.id,
    email: user.email,
    full_name: profile?.full_name ?? undefined,
    avatar_url: profile?.avatar_url ?? undefined,
  };

  const isAdmin = profile?.role === "admin";

  return (
    <div className="dashboard-wrapper">
      <Sidebar isAdmin={isAdmin} isMobileOpen={isMobileOpen} />
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <div className="dashboard-main">
        <TopNav user={userData} onMenuClick={() => setIsMobileOpen(true)} />
        <main className="dashboard-content" onClick={() => setIsMobileOpen(false)}>{children}</main>
      </div>
    </div>
  );
}
