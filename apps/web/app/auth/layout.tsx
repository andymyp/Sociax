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
    <main className="min-h-screen">
      <div className="flex w-full min-h-screen justify-center items-center bg-muted">
        {children}
      </div>
    </main>
  );
}
