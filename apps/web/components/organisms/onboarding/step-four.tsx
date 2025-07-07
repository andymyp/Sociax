"use client";

import { Check } from "lucide-react";
import { OnboardingButtons } from "./buttons";
import { IUpdateUserRequest } from "@/lib/types/user-type";
import { useUpdateOnboarding } from "@/hooks/user/use-update-onboarding";

interface Props {
  userForm: IUpdateUserRequest;
  currentStep: number;
  stepLength: number;
  prevStep: () => void;
  nextStep: () => void;
}

export const OnboardingStepFour = (props: Props) => {
  const { mutateAsync, isPending } = useUpdateOnboarding();

  const submitForm = async () => {
    const body = props.userForm;

    delete body.created_at;
    delete body.updated_at;

    await mutateAsync({ body: { ...body, boarded: true } });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 animate-slide-in">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Welcome to Sociax, {props.userForm.name}!<br />
            Your profile is ready.
          </p>
        </div>
      </div>
      <OnboardingButtons
        type="button"
        onClick={submitForm}
        currentStep={props.currentStep}
        stepLength={props.stepLength}
        prevStep={props.prevStep}
        nextStep={props.nextStep}
        isLoading={isPending}
      />
    </div>
  );
};
