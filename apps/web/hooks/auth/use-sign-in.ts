import { signUpApi } from "@/lib/apis/auth-api";
import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { AuthAction } from "@/lib/store/slices/auth-slice";
import { IApiError, IApiRequest, IApiResponse } from "@/lib/types/app-type";
import { IEmailResponse, ISignUpRequest } from "@/lib/types/auth-type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useSignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return useMutation<IApiResponse<IEmailResponse>, IApiError, IApiRequest<ISignUpRequest>>({
    mutationFn: async ({ body }) => {
      dispatch(AppAction.setLoading(true));

      const data = await signUpApi(body);
      return data;
    },
    onSuccess: ({ data }) => {
      dispatch(AuthAction.setVerify(data))
      toast.success("Success. OTP send to " + data.email);
      return router.push("/auth/verify-otp");
    },
    onError: (error) => console.log("error:", error),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });
};
