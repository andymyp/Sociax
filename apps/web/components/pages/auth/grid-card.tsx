"use client";

import Image from "next/image";
import Link from "next/link";
import { GridPattern } from "../../atoms/grid-pattern";

interface Props {
  label: string;
  title: string;
  subTitle: string;
  description: string;
}

export const GridCard = ({ label, title, subTitle, description }: Props) => {
  return (
    <div className="relative flex flex-col w-full min-h-screen p-8">
      <div className="absolute flex gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium text-primary text-2xl"
        >
          <div className="flex size-8 items-center justify-center">
            <Image
              src="/logo.svg"
              alt={label}
              width={58}
              height={56}
              priority
            />
          </div>
          {label}
        </Link>
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <div className="flex flex-1 flex-col w-full items-center justify-center text-center px-16">
          <p className="mb-2">{subTitle}</p>
          <h1 className="mb-1 text-3xl font-bold">{title.toUpperCase()}</h1>
          <div className="mb-4 w-8 h-1 bg-primary rounded-sm" />
          <p className="py-2 px-0 lg:px-12">{description}</p>
        </div>
      </div>
      <GridPattern
        width={50}
        height={50}
        x={-1}
        y={-1}
        strokeDasharray="4 2"
        className="[mask-image:linear-gradient(to_top_left,white,transparent)]"
      />
    </div>
  );
};
