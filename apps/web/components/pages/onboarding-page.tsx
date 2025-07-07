"use client";

import React from "react";
import { AppState } from "@/lib/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Loading } from "../templates/loading";
import { Check, Sparkles, User, Users } from "lucide-react";
import { OnboardingStepOne } from "../organisms/onboarding/step-one";
import { OnboardingStepTwo } from "../organisms/onboarding/step-two";
import { OnboardingStepThree } from "../organisms/onboarding/step-three";
import { OnboardingStepFour } from "../organisms/onboarding/step-four";
import { IUpdateUserRequest } from "@/lib/types/user-type";

const steps = [
  {
    title: "Welcome to Sociax",
    subtitle: "Let's get you set up in just a few steps",
    icon: Sparkles,
  },
  {
    title: "Create Your Profile",
    subtitle: "Tell us about yourself",
    icon: User,
  },
  {
    title: "Your Picture",
    subtitle: "Upload your picture",
    icon: User,
  },
  {
    title: "Find Your Community",
    subtitle: "Connect with like-minded people",
    icon: Users,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth.user);

  const [userForm, setUserForm] = React.useState<IUpdateUserRequest>();

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    if (user && user.boarded) {
      router.replace("/");
    }

    if (user) {
      setUserForm(user);
    }
  }, [router, user]);

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!user || user.boarded) return <Loading />;

  return (
    <div className="w-full max-w-2xl p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                index <= currentStep
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 border-violet-600 text-white"
                  : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
              }`}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-violet-600 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="animate-in">
        <div className="text-center pb-6">
          <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {steps[currentStep].title}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {steps[currentStep].subtitle}
          </p>
        </div>

        <div className="space-y-6">
          {currentStep === 0 && (
            <OnboardingStepOne
              currentStep={currentStep}
              stepLength={steps.length}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}

          {currentStep === 1 && (
            <OnboardingStepTwo
              userForm={userForm!}
              setUserForm={setUserForm}
              currentStep={currentStep}
              stepLength={steps.length}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}

          {currentStep === 2 && (
            <OnboardingStepThree
              userForm={userForm!}
              setUserForm={setUserForm}
              currentStep={currentStep}
              stepLength={steps.length}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}

          {currentStep === 3 && (
            <OnboardingStepFour
              userForm={userForm!}
              currentStep={currentStep}
              stepLength={steps.length}
              prevStep={prevStep}
              nextStep={nextStep}
            />
          )}
        </div>
      </div>
    </div>
  );
}
