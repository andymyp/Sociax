import SignInPage from "@/components/pages/auth/sign-in-page";

export const generateMetadata = () => {
  return { title: "Sociax - Sign In" };
};

export default function SignInRoute() {
  return <SignInPage />;
}
