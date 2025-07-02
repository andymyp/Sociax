"use client";

import { z } from "zod";
import { Mail } from "lucide-react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/lib/schemas/auth-schema";
import { Form, FormField } from "../molecules/form";
import { MaterialInput } from "../molecules/material-input";
import { FormButtons } from "../molecules/form-buttons";

type FormValues = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
  };

  const onError: SubmitErrorHandler<FormValues> = async (errors) => {
    console.log(errors);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col items-center justify-center w-full gap-4"
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
              required
            />
          )}
        />
        <FormButtons
          submitLabel="Send Request"
          isLoading={form.formState.isSubmitting}
          size="lg"
          className="mt-6 w-fit"
        />
      </form>
    </Form>
  );
};
