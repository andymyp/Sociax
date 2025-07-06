"use client";

import { z } from "zod";
import { Mail } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@/lib/schemas/auth-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../molecules/form";
import { FormButtons } from "../../molecules/form-buttons";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";
import { Input } from "../../atoms/input";

type FormValues = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutateAsync } = useForgotPassword();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutateAsync({ body: { type: 1, ...data } });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col items-center w-full gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Email"
                  rightIcon={Mail}
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
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
