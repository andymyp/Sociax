import { DottedSeparator } from "@/components/atoms/dotted-separator";
import { GithubButton } from "@/components/atoms/github-button";
import { GoogleButton } from "@/components/atoms/google-button";
import { GridCard } from "@/components/molecules/grid-card";
import { SignInForm } from "@/components/organisms/sign-in-form";
import Link from "next/link";

export const generateMetadata = () => {
  return { title: "Sociax - Sign In" };
};

export default function SignInPage() {
  return (
    <div className="w-screen h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-muted/50">
        <GridCard
          label="Sociax"
          title="Welcome Back"
          subTitle="Nice to see you again"
          description="Please sign in to your account by completing the necessary fields and start the adventure"
        />
      </div>
      <div className="flex items-center justify-center p-6 md:px-20 lg:px-36">
        <div className="w-full max-w-md flex flex-col gap-5">
          <h1 className="text-2xl font-semibold text-center mb-4">Sign In</h1>
          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <GoogleButton className="w-full !h-10" />
            </div>
            <div className="w-1/2">
              <GithubButton className="w-full !h-10" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <DottedSeparator />
            <p className="px-3 text-sm text-center whitespace-nowrap dark:bg-gray-dark">
              or with email password
            </p>
            <DottedSeparator />
          </div>
          <SignInForm />
          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
