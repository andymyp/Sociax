import SignUpPage from "@/components/pages/auth/sign-up-page";

export const generateMetadata = () => {
  return { title: "Sociax - Sign Up" };
};

export default function SignUpRoute() {
  return <SignUpPage />;
}
