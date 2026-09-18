"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MemberRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/member");
  }, [router]);

  return null;
}
