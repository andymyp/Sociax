"use client"

import { AppProgressProvider } from "@bprogress/next";
import { Loading } from "../atoms/loading";

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
      <Loading />
      {children}
    </AppProgressProvider>
  );
};