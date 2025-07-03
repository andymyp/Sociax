"use client";

import { z } from "zod";
import Link from "next/link";
import { LockOpen, Mail } from "lucide-react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/schemas/auth-schema";
import { Form, FormField } from "../molecules/form";
import { MaterialInput } from "../molecules/material-input";
import { FormButtons } from "../molecules/form-buttons";
import { useSignIn } from "@/hooks/auth/use-sign-in";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { AppState } from "@/lib/store";

type FormValues = z.infer<typeof SignInSchema>;

export const SignInForm = () => {
  const { device_id, device } = useSelector(
    (state: AppState) => state.auth.deviceInfo
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutateAsync } = useSignIn();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutateAsync({ body: { device_id, device, ...data } });
  };

  const onError: SubmitErrorHandler<FormValues> = async (errors) => {
    toast.error(Object.values(errors)[0]?.message);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <MaterialInput
              label="Email"
              type="text"
              icon={Mail}
              disabled={form.formState.isSubmitting}
              fieldState={fieldState}
              {...field}
            />
          )}
        />
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
              toggleablePassword
            />
          )}
        />
        <div className="flex w-full justify-end mb-2">
          <Link
            href="/auth/forgot-password"
            className="text-sm p-0 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <FormButtons
          submitLabel="Sign In"
          isLoading={form.formState.isSubmitting}
          size="lg"
        />
      </form>
    </Form>
  );
};
