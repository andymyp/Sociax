"use client";

import React from "react";
import { AppState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Loading } from "../templates/loading";

export default function OnboardingPage() {
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth.user);

  React.useEffect(() => {
    if (user && user.boarded) {
      router.replace("/");
    }
  }, [router, user]);

  if (user && user.boarded) return <Loading />;

  return (
    <div>
      <h1>On Boarding</h1>
    </div>
  );
}
