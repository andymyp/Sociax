"use client";

import { z } from "zod";
import { LockOpen } from "lucide-react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/lib/schemas/auth-schema";
import { Form, FormField } from "../molecules/form";
import { MaterialInput } from "../molecules/material-input";
import { FormButtons } from "../molecules/form-buttons";
import { toast } from "sonner";
import { useResetPassword } from "@/hooks/auth/use-reset-password";
import { useSelector } from "react-redux";
import { AppState } from "@/lib/store";

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

  const onError: SubmitErrorHandler<FormValues> = async (errors) => {
    toast.error(Object.values(errors)[0]?.message);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col items-center justify-center w-full gap-4"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <MaterialInput
              label="Password"
              type="password"
              icon={LockOpen}
              disabled={form.formState.isSubmitting}
              fieldState={fieldState}
              {...field}
              required
              toggleablePassword
            />
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field, fieldState }) => (
            <MaterialInput
              label="Confirm Password"
              type="password"
              icon={LockOpen}
              disabled={form.formState.isSubmitting}
              fieldState={fieldState}
              {...field}
              required
              toggleablePassword
            />
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
