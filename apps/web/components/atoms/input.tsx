import * as React from "react"
import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon, LucideIcon } from "lucide-react";

interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  toggleablePassword?: boolean;
}

function Input({
  className,
  type,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  toggleablePassword = false,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordType = type === "password" && toggleablePassword;

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative flex items-center w-full">
      {LeftIcon && (
        <LeftIcon className="absolute left-[15px] h-4 w-4 text-muted-foreground pointer-events-none" />
      )}
      <input
        type={isPasswordType ? (showPassword ? "text" : "password") : type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-md border bg-transparent px-4 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          LeftIcon && "pl-9",
          RightIcon && "pr-9",
          className
        )}
        {...props}
      />
      {isPasswordType ? (
        <button
          type="button"
          onClick={handleTogglePassword}
          className="absolute right-[14px] text-muted-foreground hover:text-foreground cursor-pointer"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOffIcon className="h-4.5 w-4.5" />
          ) : (
            <EyeIcon className="h-4.5 w-4.5" />
          )}
        </button>
      ) : (
        RightIcon && (
          <RightIcon className="absolute right-[15px] h-4 w-4 text-muted-foreground pointer-events-none" />
        )
      )}
    </div>
  );
}

export { Input }
