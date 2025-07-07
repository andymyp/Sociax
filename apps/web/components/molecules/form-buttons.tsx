import { cn } from "@/lib/utils";
import { Button } from "../atoms/button";
import { Spinner } from "../atoms/spinner";

interface Props extends React.ComponentProps<typeof Button> {
  submitLabel: string;
  cancelLabel?: string;
  isLoading: boolean;
  className?: string;
  onCancel?: () => void;
}

export const FormButtons = ({ submitLabel, cancelLabel, isLoading, className, onCancel, ...props }: Props) => {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={onCancel}
          {...props}
        >
          {cancelLabel ? cancelLabel : "Cancel"}
        </Button>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className={onCancel ? "w-fit" : "w-full"}
        {...props}
      >
        {isLoading && (
          <Spinner
            size={16}
            textColor="text-primary-foreground/30"
            fillColor="fill-primary-foreground"
          />
        )}
        {submitLabel}
      </Button>
    </div>
  );
};
