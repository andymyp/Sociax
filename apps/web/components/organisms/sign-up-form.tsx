"use client";

import { z } from "zod";
import { Mail, User2 } from "lucide-react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/lib/schemas/auth-schema";
import { Form, FormField } from "../molecules/form";
import { MaterialInput } from "../molecules/material-input";
import { FormButtons } from "../molecules/form-buttons";
import { useState } from "react";
import { Button } from "../atoms/button";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MaterialDatePicker } from "../molecules/material-date-picker";
import { MaterialSelect } from "../molecules/material-select";
import { useSignUp } from "@/hooks/auth/use-sign-in";
import { toast } from "sonner";

const variants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "right" ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: "left" | "right") => ({
    x: direction === "right" ? -300 : 300,
    opacity: 0,
  }),
};

type FormValues = z.infer<typeof SignUpSchema>;

export const SignUpForm = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const next = () => {
    setDirection("right");
    if (step < 1) setStep(step + 1);
  };

  const prev = () => {
    setDirection("left");
    if (step > 0) setStep(step - 1);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { name: "", gender: undefined, email: "", password: "", confirm_password: "" },
  });

  const { mutateAsync } = useSignUp();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutateAsync({ body: data });
  };

  const onError: SubmitErrorHandler<FormValues> = async (errors) => {
    toast.error(Object.values(errors)[0]?.message);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4 overflow-x-hidden"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <div className="relative w-full min-h-[190px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {step === 0 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="absolute w-full flex flex-col gap-4 px-1 py-1.5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <MaterialInput
                      label="Name"
                      type="text"
                      icon={User2}
                      disabled={form.formState.isSubmitting}
                      fieldState={fieldState}
                      {...field}
                      required
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field, fieldState }) => (
                    <MaterialDatePicker
                      label="Birthday"
                      disabled={form.formState.isSubmitting}
                      fieldState={fieldState}
                      {...field}
                      required
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field, fieldState }) => (
                    <MaterialSelect
                      label="Gender"
                      disabled={form.formState.isSubmitting}
                      fieldState={fieldState}
                      onValueChange={field.onChange}
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
                      required
                    />
                  )}
                />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="absolute w-full flex flex-col gap-4 px-1 py-1.5"
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <MaterialInput
                      label="Password"
                      type="password"
                      disabled={form.formState.isSubmitting}
                      fieldState={fieldState}
                      {...field}
                      toggleablePassword
                      required
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
                      disabled={form.formState.isSubmitting}
                      fieldState={fieldState}
                      {...field}
                      toggleablePassword
                      required
                    />
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex justify-between items-center mt-1 px-1">
          <Button
            variant="outline"
            size="lg"
            disabled={step === 0 || form.formState.isSubmitting}
            onClick={prev}
            className="w-[100px]"
          >
            Back
          </Button>
          <div className="flex items-center gap-2" aria-label="Step indicator">
            {[0, 1].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300",
                  i === step ? "bg-primary scale-125" : "bg-muted"
                )}
              />
            ))}
          </div>
          {step < 1 ? (
            <Button
              size="lg"
              variant="outline"
              onClick={next}
              className="w-[100px] border-primary text-primary hover:bg-primary/10 hover:text-primary"
            >
              Next
            </Button>
          ) : (
            <FormButtons
              submitLabel="Sign Up"
              isLoading={form.formState.isSubmitting}
              size="lg"
              className="w-[100px]"
            />
          )}
        </div>
      </form>
    </Form>
  );
};
