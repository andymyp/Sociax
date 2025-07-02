"use client";

import { z } from "zod";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyOtpSchema } from "@/lib/schemas/auth-schema";
import { Form, FormControl, FormField, FormItem } from "../molecules/form";
import { FormButtons } from "../molecules/form-buttons";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../molecules/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useVerifyOtp } from "@/hooks/auth/use-verify-otp";
import { v4 as uuidv4 } from "uuid";

type FormValues = z.infer<typeof VerifyOtpSchema>;

interface Props {
  type: number;
  email: string;
}

export const VerifyOtpForm = ({ type, email }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: { otp: "" },
  });

  const { mutateAsync } = useVerifyOtp();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutateAsync({
      body: { device_id: uuidv4(), device: "web", type, email, ...data },
    });
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
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
            </FormItem>
          )}
        />
        <FormButtons
          submitLabel="Verify"
          isLoading={form.formState.isSubmitting}
          size="lg"
          className="mt-6 w-[120px]"
        />
      </form>
    </Form>
  );
};
