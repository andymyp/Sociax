"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ControllerFieldState } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "./form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/select";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { fallbackAvatarColor, fallbackAvatarName } from "@/lib/avatar";

interface Option {
  label: string;
  value: string;
  image?: string;
}

interface Props extends React.ComponentProps<typeof Select> {
  options: Option[];
  withImage?: boolean;
  className?: string;
  label?: string;
  fieldState?: ControllerFieldState;
  withErrorMessege?: boolean;
  required?: boolean;
}

const MaterialSelect = React.forwardRef<HTMLButtonElement, Props>(
  (
    { className, label, options, withImage, required, fieldState, withErrorMessege, ...props },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [filled, setFilled] = React.useState(!!props.value);

    const handleFocus = () => setFocused(true);

    const handleBlur = () => {
      setFocused(false);
    };

    const handleValueChange = (value: string) => {
      setFilled(!!value);
      props.onValueChange?.(value);
    };

    return (
      <FormItem className="relative w-full">
        <Select {...props} onValueChange={handleValueChange}>
          <FormControl>
            <SelectTrigger
              ref={ref}
              className={cn(
                "w-full !h-10",
                focused && "border-primary focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
                fieldState?.error &&
                  "border-destructive focus-visible:outline-none focus-visible:ring-0",
                className
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => {
              const fallbackName = fallbackAvatarName(option.label!);
              const fallbackColor = fallbackAvatarColor(option.label!);

              return (
                <SelectItem key={option.value} value={option.value} className="w-full">
                  {withImage && (
                    <Avatar className="size-6 flex items-center justify-center">
                      <AvatarImage
                        src={option.image}
                        alt={option.label}
                        className="size-6"
                      />
                      <AvatarFallback
                        className={cn(
                          "size-6",
                          fallbackColor && `${fallbackColor} text-white`
                        )}
                      >
                        {fallbackName}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <FormLabel
          className={cn(
            "absolute -top-0 left-3 pointer-events-none text-muted-foreground",
            "transition-all duration-200",
            focused || filled
              ? "-translate-y-2 -translate-x-1 text-xs"
              : "translate-y-[13px]",
            (focused || filled) && "px-1 bg-background",
            focused && "text-primary",
            fieldState?.error && "text-destructive"
          )}
        >
          {label}
          {required && <span className="text-destructive -ml-1">*</span>}
        </FormLabel>
        {withErrorMessege && <FormMessage className="text-xs" />}
      </FormItem>
    );
  }
);
MaterialSelect.displayName = "MaterialSelect";

export { MaterialSelect };
