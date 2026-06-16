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
      if (userData?.role === 'owner') {
        router.replace('/dashboard/owner');
      } else if (userData?.role === 'trainer') {
        router.replace('/dashboard/trainer');
      } else {
        router.replace('/dashboard/member');
      }
    }
  }, [userData, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );
};

export default DashboardPage;
