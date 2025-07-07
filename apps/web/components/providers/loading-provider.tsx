"use client";

import { AppProgressProvider } from "@bprogress/next";
import { ProgressProvider } from "./progress-provider";

interface Props {
  children: React.ReactNode;
}

export const LoadingProvider = ({ children }: Props) => {
  return (
    <AppProgressProvider
      height="5px"
      color="#6d28d9"
      options={{ showSpinner: true }}
      shallowRouting
    >
      <ProgressProvider>{children}</ProgressProvider>
    </AppProgressProvider>
  );
};
