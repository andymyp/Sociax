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
import { IUser } from "@/lib/types/auth-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, User2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { OnboardingButtons } from "./buttons";

type FormValues = z.infer<typeof ProfileSchema>;

interface Props {
  user: IUser;
  currentStep: number;
  stepLength: number;
  prevStep: () => void;
  nextStep: () => void;
}

export const OnboardingStepTwo = ({ user, ...props }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name,
      username: user.username,
      birthday: user.birthday || undefined,
      gender: user.gender ? (user.gender as FormValues["gender"]) : undefined,
      bio: user.bio || "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("profile:", data);
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
