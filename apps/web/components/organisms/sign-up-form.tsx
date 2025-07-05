"use client";

import { z } from "zod";
import { Mail, User2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/lib/schemas/auth-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../molecules/form";
import { FormButtons } from "../molecules/form-buttons";
import { useSignUp } from "@/hooks/auth/use-sign-up";
import { Input } from "../atoms/input";

type FormValues = z.infer<typeof SignUpSchema>;

export const SignUpForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const { mutateAsync } = useSignUp();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutateAsync({ body: data });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Full name" rightIcon={User2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" rightIcon={Mail} {...field} />
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
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Confirm password"
                  type="password"
                  toggleablePassword
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormButtons
          submitLabel="Sign Up"
          isLoading={form.formState.isSubmitting}
          size="lg"
          className="mt-2"
        />
      </form>
    </Form>
  );
};
