"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Toggle } from "../atoms/toggle";

const iconSizeMap = {
  default: "!h-[16px] !w-[16px]",
  sm: "!h-[14px] !w-[14px]",
  lg: "!h-[18px] !w-[18px]",
  xl: "!h-[18px] !w-[18px]",
} as const;

export function ModeToggle({
  size = "default",
  ...props
}: React.ComponentProps<typeof Toggle>) {
  const { resolvedTheme, setTheme } = useTheme();
  const [pressed, setPressed] = React.useState(false);

  React.useEffect(() => {
    if (resolvedTheme === "dark") {
      setPressed(true);
    } else {
      setPressed(false);
    }
  }, [resolvedTheme, setPressed]);

  const iconSize = iconSizeMap[size as keyof typeof iconSizeMap];

  return (
    <Toggle
      variant="outline"
      size={size}
      pressed={pressed}
      onPressedChange={(press) => setTheme(press ? "dark" : "light")}
      {...props}
    >
      <Sun
        className={`${iconSize} h-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`}
      />
      <Moon
        className={`${iconSize} absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`}
      />
    </Toggle>
  );
}
