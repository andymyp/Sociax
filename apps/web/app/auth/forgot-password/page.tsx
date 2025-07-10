import ForgotPasswordPage from "@/components/pages/auth/forgot-password-page";

export const generateMetadata = () => {
  return { title: "Sociax - Forgot Password" };
};

export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
