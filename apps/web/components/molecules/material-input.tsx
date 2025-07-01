"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ControllerFieldState } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "../atoms/input";

interface Props extends React.ComponentProps<typeof Input> {
  label?: string;
  icon?: LucideIcon;
  fieldState?: ControllerFieldState;
  withErrorMessege?: boolean;
}

const MaterialInput = React.forwardRef<HTMLInputElement, Props>(
  ({ className, label, icon, required, fieldState, withErrorMessege, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [filled, setFilled] = React.useState(!!props.value);

    const handleFocus = () => setFocused(true);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setFilled(!!e.target.value);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilled(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <FormItem className="relative w-full">
        <FormControl>
          <Input
            {...props}
            className={cn(
              fieldState?.error &&
                "border-destructive focus-visible:outline-none focus-visible:ring-0",
              className
            )}
            rightIcon={icon}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            ref={ref}
          />
        </FormControl>
        <FormLabel
          className={cn(
            "absolute top-1 left-4 pointer-events-none text-muted-foreground",
            "transition-all duration-200",
            focused || filled
              ? "-translate-y-3 -translate-x-1 text-xs"
              : "translate-y-[13px]",
            (focused || filled) && "px-1 bg-background",
            focused && "text-primary",
            fieldState?.error && "text-destructive"
          )}
        >
          {label}
          {required && <span className="text-destructive -ml-1">*</span>}
        </FormLabel>
        {withErrorMessege && (<FormMessage className="text-xs" />)}
      </FormItem>
    );
  }
);
MaterialInput.displayName = "MaterialInput";

export { MaterialInput };
