import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "../atoms/dotted-separator";
import { ForgotPasswordForm } from "../organisms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex w-full min-h-screen items-center justify-center p-4  bg-background">
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
      <div className="flex flex-col m-auto w-80 gap-4">
        <h1 className="font-semibold text-2xl text-center mb-3">
          Forgot Password
        </h1>
        <div className="flex items-center justify-center my-2 w-full">
          <DottedSeparator />
          <p className="block w-full min-w-fit px-2 text-center text-sm dark:bg-gray-dark">
            Enter your registered email
          </p>
          <DottedSeparator />
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
