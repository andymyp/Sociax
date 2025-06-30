import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
});

import "@/styles/globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { LoadingProvider } from "@/components/providers/loading-provider";

import { Toaster } from "@/components/atoms/sonner";

export const metadata: Metadata = {
  title: "Sociax",
  description: "Social Media App by linkedin.com/in/andymyp",
  keywords: "Taskly, Super Taskly, Task, Task Management, To Do App",
  authors: [
    {
      name: "M. Yudistiandy Prabowo",
      url: "https://linkedin.com/in/andymyp",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${roboto.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <QueryProvider>
              <LoadingProvider>
                {children}
                <Toaster />
              </LoadingProvider>
            </QueryProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
