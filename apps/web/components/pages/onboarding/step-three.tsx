"use client";

import { Form } from "@/components/molecules/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { OnboardingButtons } from "./buttons";
import { AvatarSchema } from "@/lib/schemas/user-schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarUpload } from "@/components/molecules/avatar-upload";
import { IUpdateUserRequest } from "@/lib/types/user-type";
import { useUpdateUser } from "@/hooks/user/use-update-user";

type FormValues = z.infer<typeof AvatarSchema>;

interface Props {
  userForm: IUpdateUserRequest;
  currentStep: number;
  stepLength: number;
  prevStep: () => void;
  nextStep: () => void;
}

export const OnboardingStepThree = (props: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(AvatarSchema),
    defaultValues: {
      avatar: props.userForm.avatar_url,
    },
  });

  const { mutateAsync } = useUpdateUser();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const newData = { ...props.userForm, file: data.avatar };

    await mutateAsync({ body: newData });

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
              image={props.userForm.avatar_url}
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
