"use client";
import React, { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { portalSession, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !portalSession) {
      router.push("/login");
    }
  }, [portalSession, loading, router]);

  if (loading || !portalSession) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="p-6 md:p-10 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
