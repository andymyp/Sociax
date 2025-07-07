"use client";

import { z } from "zod";
import Link from "next/link";
import { Mail } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/schemas/auth-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../molecules/form";
import { FormButtons } from "../../molecules/form-buttons";
import { useSignIn } from "@/hooks/auth/use-sign-in";
import { useSelector } from "react-redux";
import { AppState } from "@/lib/store";
import { Input } from "../../atoms/input";

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

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
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
