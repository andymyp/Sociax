"use client";

import { AppState } from "@/lib/store";
import { useProgress } from "@bprogress/next";
import React from "react";
import { useSelector } from "react-redux";

export const ProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { start, stop } = useProgress();

  const isLoading = useSelector((state: AppState) => state.app.isLoading);

  React.useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop]);

  return <>{children}</>;
};
