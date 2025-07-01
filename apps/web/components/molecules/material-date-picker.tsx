"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../atoms/button";
import { Calendar } from "../atoms/calendar";
import { FormControl, FormItem, FormLabel, FormMessage } from "./form";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { ControllerFieldState } from "react-hook-form";

interface Props {
  label?: string;
  className?: string;
  required?: boolean;
  fieldState?: ControllerFieldState;
  disabled?: boolean;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  withErrorMessege?: boolean;
}

const MaterialDatePicker = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      className,
      label,
      required,
      fieldState,
      disabled,
      value,
      onChange,
      withErrorMessege,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const [filled, setFilled] = React.useState(!!value);
    const [open, setOpen] = React.useState(false);

    const [selected, setSelected] = React.useState<Date | undefined>(value);
    const [month, setMonth] = React.useState<Date | undefined>(selected);

    const handleFocus = () => setFocused(true);

    const handleBlur = () => {
      setFocused(false);
    };

    const handleSelect = (date: Date | undefined) => {
      setFilled(!!date);
      onChange?.(date);
      setOpen(false);
      setSelected(date);
    };

    const handleOpenChange = (isOpen: boolean) => {
      setFocused(isOpen);
      setOpen(isOpen);
    };

    return (
      <FormItem className="relative w-full">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <FormControl>
            <PopoverTrigger asChild>
              <Button
                size="lg"
                ref={ref}
                variant="outline"
                className={cn(
                  "w-full justify-between text-left font-normal !px-[11px]",
                  !selected && "justify-end text-muted-foreground",
                  focused &&
                    open &&
                    "border-primary focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
                  fieldState?.error &&
                    "border-destructive focus-visible:outline-none focus-visible:ring-0",
                  className
                )}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                {...props}
              >
                {selected && format(selected, "PPP")}
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
          </FormControl>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              selected={selected}
              onSelect={handleSelect}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
        <FormLabel
          className={cn(
            "absolute -top-0 left-3 pointer-events-none text-muted-foreground",
            "transition-all duration-200",
            focused || filled
              ? "-translate-y-2 -translate-x-1 text-xs"
              : "translate-y-[13px]",
            (focused || filled) && "px-1 bg-background",
            focused && open && "text-primary",
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
MaterialDatePicker.displayName = "MaterialDatePicker";

export { MaterialDatePicker };
