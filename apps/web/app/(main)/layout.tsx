/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Loading } from "@/components/templates/loading";
import { axiosClient } from "@/lib/axios";
import { AppDispatch, AppState } from "@/lib/store";
import { setUser, setVerify } from "@/lib/store/actions/auth-action";
import { getAccessToken, setAccessToken } from "@/lib/token";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: AppState) => state.auth.user);
  const verify = useSelector((state: AppState) => state.auth.verify);

  React.useEffect(() => {
    const token = getAccessToken();
    if (!user && !token) {
      router.replace("/auth/sign-in");
    }
  }, [router, user]);

  React.useEffect(() => {
    if (user && verify) {
      dispatch(setVerify(null));
    }
  }, [dispatch, user, verify]);

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
          dispatch(setUser(null));
          router.replace("/auth/sign-in");
        }
      }
    };

    restoreAccessToken();
  }, [dispatch, router, user]);

  if (!user) return <Loading />;

  return (
    <main className="min-h-screen">
      <div className="flex w-full min-h-screen justify-center items-center bg-muted">
        {children}
      </div>
    </main>
  );
}
