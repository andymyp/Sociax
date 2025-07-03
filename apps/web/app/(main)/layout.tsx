/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loading } from "@/components/templates/loading";
import { axiosClient } from "@/lib/axios";
import { AppState } from "@/lib/store";
import { getAccessToken, setAccessToken } from "@/lib/token";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth.user);

  React.useEffect(() => {
    const token = getAccessToken();
    if (!user && !token) {
      router.replace("/auth/sign-in");
    }
  }, [router, user]);

  React.useEffect(() => {
    if (!user) return;

    const token = getAccessToken();
    if (token) return;

    const restoreAccessToken = async () => {
      try {
        const res = await axiosClient.get("/auth/refresh-token");
        const newToken = res.data.data.access_token;
        setAccessToken(newToken);
      } catch (err: any) {
        if (err.response?.status === 410) {
          router.replace("/auth/sign-in");
        }
      }
    };

    restoreAccessToken();
  }, [router, user]);

  if (!user) return <Loading />;

  return (
    <main className="min-h-screen">
      <div className="flex w-full min-h-screen justify-center items-center bg-muted">
        {children}
      </div>
    </main>
  );
}
