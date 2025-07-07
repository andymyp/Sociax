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
  const didRunRef = React.useRef(false);

  React.useEffect(() => {
    const token = getAccessToken();
    if (!user && !token) {
      router.replace("/auth/sign-in");
    }

    if (user && !user.boarded) {
      router.replace("/onboarding");
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

    if (didRunRef && didRunRef.current) return;

    const restoreAccessToken = async () => {
      didRunRef.current = true;

      try {
        const res = await axiosClient.get("/auth/refresh-token");
        const newToken = res.data.data.access_token;
        setAccessToken(newToken);
      } catch (err: any) {
        if (err.status === 410) {
          dispatch(setUser(null));
          router.replace("/auth/sign-in");
        }
      }
    };

    restoreAccessToken();
  }, [dispatch, router, user]);

  if (!user) return <Loading />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950">
      <div className="flex w-full justify-center items-center">{children}</div>
    </main>
  );
}
