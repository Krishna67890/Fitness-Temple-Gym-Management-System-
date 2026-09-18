"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function PortalGatewayPage() {
  const { userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!userData) {
        router.replace("/login?redirect=/portal");
      } else if (userData.role === "owner") {
        router.replace("/dashboard/owner");
      } else if (userData.role === "trainer") {
        router.replace("/dashboard/trainer");
      } else {
        router.replace("/dashboard/member");
      }
    }
  }, [userData, loading, router]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white px-4">
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black uppercase tracking-wider italic">
            Connecting to <span className="text-primary">Gym Portal</span>
          </h2>
          <p className="text-gray-400 text-xs font-mono">Verifying credentials & role authorization...</p>
        </div>
      </div>
    </div>
  );
}
