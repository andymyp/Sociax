"use client";

import { Form } from "@/components/molecules/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { OnboardingButtons } from "./buttons";
import { AvatarSchema } from "@/lib/schemas/user-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IUser } from "@/lib/types/auth-type";
import { AvatarUpload } from "@/components/molecules/avatar-upload";

type FormValues = z.infer<typeof AvatarSchema>;

interface Props {
  user: IUser;
  currentStep: number;
  stepLength: number;
  prevStep: () => void;
  nextStep: () => void;
}

export const OnboardingStepThree = (props: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(AvatarSchema),
    defaultValues: {
      avatar: props.user.avatar_url || "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("avatar:", data);
    props.nextStep();
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6 animate-in"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <div className="flex justify-center mb-8">
            <AvatarUpload
              image={props.user.avatar_url || undefined}
              disabled={form.formState.isSubmitting}
              setValue={(field, value) =>
                form.setValue(field as keyof FormValues, value)
              }
            />
          </div>
        </div>
        <OnboardingButtons
          type="submit"
          currentStep={props.currentStep}
          stepLength={props.stepLength}
          prevStep={props.prevStep}
          nextStep={props.nextStep}
        />
      </form>
    </Form>
  );
};
