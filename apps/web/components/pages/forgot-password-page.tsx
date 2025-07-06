import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "../atoms/dotted-separator";
import { ForgotPasswordForm } from "../organisms/forms/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="relative flex flex-col w-full min-h-screen items-center justify-center p-8">
      <div className="absolute top-8 left-8 flex gap-2">
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
      <div className="flex flex-col max-w-xs w-full gap-4 pt-20 mb-10 md:pt-0 md:mb-0">
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
