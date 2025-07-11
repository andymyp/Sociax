"use client";

import React from "react";
import { Header } from "../organisms/header/header";
import { MobileNavbar } from "../organisms/navbar/mobile-navbar";
import { cn } from "@/lib/utils";

const SPAN_MAP: Record<number, string[]> = {
  1: ["col-span-1 md:col-span-8 p-4"],
  2: [
    "hidden md:block md:col-span-4 lg:col-span-3 p-4",
    "col-span-1 md:col-span-8 lg:col-span-9 md:p-0 md:py-4 md:pr-4 min-h-screen p-4",
  ],
  3: [
    "hidden md:block md:col-span-4 lg:col-span-3 p-4",
    "col-span-1 md:col-span-8 lg:col-span-6 md:p-0 md:py-4 md:pr-4 lg:pr-0 min-h-screen p-4",
    "hidden lg:block lg:col-span-3 p-4",
  ],
};

const DEFAULT_SPAN = "col-span-8";

export default function MainTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const childArray = React.Children.toArray(children);
  const count = childArray.length;
  const spans = SPAN_MAP[count] ?? Array(count).fill(DEFAULT_SPAN);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto mb-16 md:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-2">
          {childArray.map((child, index) => (
            <div key={index} className={cn(spans[index])}>
              {child}
            </div>
          ))}
        </div>
      </div>
      <MobileNavbar />
    </div>
  );
}
