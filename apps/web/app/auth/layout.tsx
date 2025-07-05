"use client";

import { Loading } from "@/components/templates/loading";
import { AppState } from "@/lib/store";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth.user);

  React.useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [router, user]);

  if (user) return <Loading />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      <div className="flex w-full justify-center items-center">{children}</div>
    </main>
  );
}
