import { DottedSeparator } from "@/components/atoms/dotted-separator";
import { Card, CardContent } from "@/components/molecules/card";
import { VerifyOtpForm } from "@/components/organisms/verify-otp-form";
import Image from "next/image";
import Link from "next/link";

export const generateMetadata = () => {
  return { title: "Sociax - Verify OTP" };
};

export default function VerifyOtpPage() {
  return (
    <div className="relative flex w-full min-h-screen items-center justify-center p-4">
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
      <Card className="w-full h-full md:w-[500px] border-none shadow-sm !py-0">
        <CardContent className="flex flex-col w-full items-center p-10 gap-4">
          <h1 className="font-semibold text-2xl text-center mb-3">
            Verify OTP
          </h1>
          <div className="flex items-center justify-center my-2 w-full">
            <DottedSeparator />
            <p className="block w-full min-w-fit px-2 text-center text-sm dark:bg-gray-dark">
              Enter your OTP
            </p>
            <DottedSeparator />
          </div>
          <VerifyOtpForm />
        </CardContent>
      </Card>
    </div>
  );
}