"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "../atoms/dotted-separator";
import { VerifyOtpForm } from "../organisms/verify-otp-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "@/lib/store";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { AuthAction } from "@/lib/store/slices/auth-slice";
import { Button } from "../atoms/button";
import { useSendEmailOtp } from "@/hooks/auth/use-send-email-otp";

export default function VerifyOtpPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const verify = useSelector((state: AppState) => state.auth.verify);

  const { nextResendAt, attempts } = useSelector(
    (state: AppState) => state.auth.resendOtp
  );

  const [remaining, setRemaining] = React.useState(0);

  React.useEffect(() => {
    if (!verify) {
      router.replace("/auth/sign-up");
    }
  }, [verify, router]);

  React.useEffect(() => {
    if (attempts === 0) {
      dispatch(AuthAction.startOtpCooldown());
    }
  }, [dispatch, attempts]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (nextResendAt) {
        const diff = Math.max(
          0,
          Math.floor((nextResendAt - Date.now()) / 1000)
        );
        setRemaining(diff);

        if (diff <= 0 && attempts >= 4) {
          dispatch(AuthAction.resetResendOtp());
        }
      } else {
        setRemaining(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextResendAt, attempts, dispatch]);

  const formatSeconds = (seconds: number) => {
    if (seconds >= 3600) return `${Math.floor(seconds / 60 / 60)}h`;
    if (seconds >= 60) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const { mutateAsync } = useSendEmailOtp();

  const handleResendOtp = async () => {
    dispatch(AuthAction.startOtpCooldown());
    await mutateAsync({ body: { type: verify!.type, email: verify!.email } });
  };

  const disabledResedOtp = remaining > 0 || attempts >= 4;

  if (!verify) return <Loading />;

  return (
    <div className="relative flex w-full min-h-screen items-center justify-center p-4 bg-background">
      <div className="absolute top-8 left-8 md:w-full md:left-0 md:justify-center flex gap-2">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium text-primary text-2xl"
        >
          <div className="flex size-8 items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Sociax"
              width={58}
              height={56}
              priority
            />
          </div>
          Sociax
        </Link>
      </div>
      <div className="flex flex-col m-auto justify-center items-center w-80 gap-4">
        <h1 className="font-semibold text-2xl text-center mb-3">Verify OTP</h1>
        <div className="flex items-center justify-center my-2 w-full">
          <DottedSeparator />
          <p className="block w-full min-w-fit px-2 text-center text-sm dark:bg-gray-dark">
            Enter your OTP
          </p>
          <DottedSeparator />
        </div>
        <VerifyOtpForm type={verify.type} email={verify.email} />
        <Button
          variant="link"
          size="sm"
          className="w-fit text-muted-foreground"
          onClick={handleResendOtp}
          disabled={disabledResedOtp}
        >
          {remaining > 0
            ? `Resend in ${formatSeconds(remaining)}`
            : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
}
