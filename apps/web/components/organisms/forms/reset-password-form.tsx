"use client";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/lib/schemas/auth-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../molecules/form";
import { FormButtons } from "../../molecules/form-buttons";
import { useResetPassword } from "@/hooks/auth/use-reset-password";
import { useSelector } from "react-redux";
import { AppState } from "@/lib/store";
import { Input } from "../../atoms/input";

type FormValues = z.infer<typeof ResetPasswordSchema>;

interface Props {
  email: string;
}

export const ResetPasswordForm = ({ email }: Props) => {
  const { device_id, device } = useSelector(
    (state: AppState) => state.auth.deviceInfo
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirm_password: "" },
  });

  const { mutateAsync } = useResetPassword();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutateAsync({ body: { device_id, device, email, ...data } });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col items-center justify-center w-full gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Password"
                  type="password"
                  disabled={form.formState.isSubmitting}
                  toggleablePassword
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Confirm password"
                  type="password"
                  disabled={form.formState.isSubmitting}
                  toggleablePassword
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormButtons
          submitLabel="Save Password"
          isLoading={form.formState.isSubmitting}
          size="lg"
          className="mt-6 w-fit"
        />
      </form>
    </Form>
  );
};
