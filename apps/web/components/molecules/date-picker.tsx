"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ControllerFieldState } from "react-hook-form";
import { FormControl } from "./form";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { Button } from "../atoms/button";
import { Calendar } from "../atoms/calendar";

interface Props {
  placeholder?: string;
  className?: string;
  required?: boolean;
  fieldState?: ControllerFieldState;
  disabled?: boolean;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

const DatePicker = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, fieldState, disabled, value, onChange, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<Date | undefined>(value);

    const handleSelect = (date: Date | undefined) => {
      onChange?.(date);
      setOpen(false);
      setSelected(date);
    };

    const handleOpenChange = (isOpen: boolean) => {
      setOpen(isOpen);
    };

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <FormControl>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              className={cn(
                "w-full h-12 justify-between font-normal !px-[14px]",
                !selected && "text-muted-foreground",
                fieldState?.error &&
                  "border-destructive focus-visible:outline-none focus-visible:ring-0",
                className
              )}
              disabled={disabled}
              {...props}
            >
              {selected ? (
                format(selected, "PPP")
              ) : (
                <span>{props.placeholder || "Pick a date"}</span>
              )}
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
        </FormControl>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={selected}
            onSelect={handleSelect}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
