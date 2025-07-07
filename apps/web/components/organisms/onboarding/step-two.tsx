import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { CustomSelect } from "@/components/molecules/custom-select";
import { DatePicker } from "@/components/molecules/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/molecules/form";
import { ProfileSchema } from "@/lib/schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, User2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { OnboardingButtons } from "./buttons";
import { IUpdateUserRequest } from "@/lib/types/user-type";
import { useUpdateUser } from "@/hooks/user/use-update-user";

type FormValues = z.infer<typeof ProfileSchema>;

interface Props {
  userForm: IUpdateUserRequest;
  setUserForm: (user: IUpdateUserRequest) => void;
  currentStep: number;
  stepLength: number;
  prevStep: () => void;
  nextStep: () => void;
}

export const OnboardingStepTwo = ({
  userForm,
  setUserForm,
  ...props
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: userForm.name,
      username: userForm.username,
      birthday: userForm.birthday ? new Date(userForm.birthday) : undefined,
      gender: userForm.gender
        ? (userForm.gender as FormValues["gender"])
        : undefined,
      bio: userForm.bio || "",
    },
  });

  const { mutateAsync } = useUpdateUser();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const newData = { ...userForm, ...data };

    await mutateAsync({ body: newData });

    setUserForm(newData);
    props.nextStep();
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 animate-in"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Full name"
                      rightIcon={User2}
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      rightIcon={AtSign}
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="birthday"
              render={({ field, fieldState }) => (
                <FormItem>
                  <DatePicker
                    placeholder="Birthday"
                    fieldState={fieldState}
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="gender"
              render={({ field, fieldState }) => (
                <FormItem>
                  <CustomSelect
                    placeholder="Gender"
                    fieldState={fieldState}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={form.formState.isSubmitting}
                    options={[
                      {
                        label: "Male",
                        value: "male",
                      },
                      {
                        label: "Female",
                        value: "female",
                      },
                    ]}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    className="resize-none"
                    disabled={form.formState.isSubmitting}
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <OnboardingButtons
          type="submit"
          currentStep={props.currentStep}
          stepLength={props.stepLength}
          prevStep={props.prevStep}
          nextStep={props.nextStep}
          isLoading={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
};
