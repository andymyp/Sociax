import { Heart, Sparkles, Users } from "lucide-react";
import { OnboardingButtons } from "./buttons";

interface Props {
  currentStep: number;
  stepLength: number;
  prevStep: () => void;
  nextStep: () => void;
}

export const OnboardingStepOne = (props: Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-6 animate-slide-in">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4 text-violet-600 dark:text-violet-400">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Connect</span>
            </div>
            <div className="w-2 h-2 bg-violet-400 rounded-full" />
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </div>
            <div className="w-2 h-2 bg-violet-400 rounded-full" />
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Discover</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Join a community where your voice matters. Share your thoughts,
            connect with others, and discover amazing content tailored just for
            you.
          </p>
        </div>
      </div>
      <OnboardingButtons
        type="button"
        currentStep={props.currentStep}
        stepLength={props.stepLength}
        prevStep={props.prevStep}
        nextStep={props.nextStep}
      />
    </div>
  );
};
