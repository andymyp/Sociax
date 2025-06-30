"use client"

import { AppState } from "@/store";
import { useProgress } from "@bprogress/next";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const Loading = () => {
  const { start, stop } = useProgress();

  const isLoading = useSelector((state: AppState) => state.app.isLoading);

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop]);

  return null;
}