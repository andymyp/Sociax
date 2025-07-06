import { Button } from "@/components/atoms/button";
import { Spinner } from "@/components/atoms/spinner";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  type: "button" | "submit";
  currentStep: number;
  stepLength: number;
  prevStep: () => void;
  nextStep: () => void;
  isLoading?: boolean;
}

export const OnboardingButtons = ({
  type,
  currentStep,
  stepLength,
  prevStep,
  nextStep,
  isLoading,
}: Props) => {
  return (
    <div className="flex justify-between pt-6">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={prevStep}
        disabled={currentStep === 0 || isLoading}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {type === "submit" ? (
        <Button size="lg" type={type} disabled={isLoading}>
          {currentStep === stepLength - 1 ? "Get Started" : "Continue"}
          {isLoading ? (
            <Spinner
              size={16}
              textColor="text-primary-foreground/30"
              fillColor="fill-primary-foreground"
            />
          ) : (
            <ArrowRight className="w-4 h-4 ml-2" />
          )}
        </Button>
      ) : (
        <Button size="lg" type={type} onClick={nextStep} disabled={isLoading}>
          {currentStep === stepLength - 1 ? "Get Started" : "Continue"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
};
