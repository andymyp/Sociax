"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ControllerFieldState } from "react-hook-form";
import { fallbackAvatarColor, fallbackAvatarName } from "@/lib/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/select";
import { FormControl } from "./form";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface Option {
  label: string;
  value: string;
  image?: string;
}

interface Props extends React.ComponentProps<typeof Select> {
  options: Option[];
  withImage?: boolean;
  className?: string;
  placeholder?: string;
  fieldState?: ControllerFieldState;
}

const CustomSelect = React.forwardRef<HTMLButtonElement, Props>(
  (
    { className, placeholder, options, withImage, fieldState, ...props },
    ref
  ) => {
    const handleValueChange = (value: string) => {
      props.onValueChange?.(value);
    };

    return (
      <Select {...props} onValueChange={handleValueChange}>
        <FormControl>
          <SelectTrigger
            ref={ref}
            className={cn(
              "w-full !h-12 !px-[14px]",
              fieldState?.error &&
                "border-destructive focus-visible:outline-none focus-visible:ring-0",
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map((option) => {
            const fallbackName = fallbackAvatarName(option.label!);
            const fallbackColor = fallbackAvatarColor(option.label!);

            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-x-2">
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
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }
);
CustomSelect.displayName = "CustomSelect";

export { CustomSelect };
