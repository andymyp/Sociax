import Link from "next/link";
import { GridCard } from "../molecules/grid-card";
import Image from "next/image";
import { GoogleButton } from "../atoms/google-button";
import { GithubButton } from "../atoms/github-button";
import { DottedSeparator } from "../atoms/dotted-separator";
import { SignInForm } from "../organisms/sign-in-form";

export default function SignInPage() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex bg-muted/50">
        <GridCard
          label="Sociax"
          title="Welcome Back"
          subTitle="Nice to see you again"
          description="Please sign in to your account by completing the necessary fields and start the adventure"
        />
      </div>
      <div className="relative flex items-center justify-center p-8 md:px-20">
        <div className="absolute top-8 left-8 flex md:hidden gap-2">
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
        <div className="w-full max-w-xs flex flex-col gap-5 pt-20 mb-10 md:pt-0 md:mb-0">
          <h1 className="text-2xl font-semibold text-center m-0 mb-4">
            Sign In
          </h1>
          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <GoogleButton className="w-full !h-11" />
            </div>
            <div className="w-1/2">
              <GithubButton className="w-full !h-11" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <DottedSeparator />
            <p className="px-3 text-sm text-center whitespace-nowrap dark:bg-gray-dark">
              OR
            </p>
            <DottedSeparator />
          </div>
          <SignInForm />
          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
