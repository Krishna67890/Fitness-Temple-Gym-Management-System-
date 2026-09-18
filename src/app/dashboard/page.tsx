"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const DashboardPage = () => {
  const { userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!userData) {
        router.replace('/login');
        return;
      }

      if (userData.role === 'owner') {
        router.replace('/dashboard/owner');
      } else if (userData.role === 'trainer') {
        router.replace('/dashboard/trainer');
      } else {
        router.replace('/dashboard/member');
      }
    }
  }, [userData, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/50 animate-pulse">
          Authenticating Neural Link...
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
