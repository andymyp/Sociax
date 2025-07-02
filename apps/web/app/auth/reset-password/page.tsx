import ResetPasswordPage from "@/components/pages/reset-password-page";

export const generateMetadata = () => {
  return { title: "Sociax - Reset Password" };
};

export default function ResetPasswordRoute() {
  return <ResetPasswordPage />
}