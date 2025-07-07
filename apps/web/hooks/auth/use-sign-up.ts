import { signUpApi } from "@/lib/apis/auth-api";
import { AppDispatch } from "@/lib/store";
import { setVerify } from "@/lib/store/actions/auth-action";
import { AppAction } from "@/lib/store/slices/app-slice";
import { IApiError, IApiRequest, IApiResponse } from "@/lib/types/app-type";
import { IEmailResponse, ISignUpRequest } from "@/lib/types/auth-type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useSignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return useMutation<
    IApiResponse<IEmailResponse>,
    AxiosError<IApiError>,
    IApiRequest<ISignUpRequest>
  >({
    mutationFn: async ({ body }) => {
      dispatch(AppAction.setLoading(true));

      const data = await signUpApi(body);
      return data;
    },
    onSuccess: async ({ data }) => {
      await dispatch(setVerify(data));

      toast.success("OTP send to " + data.email);
      router.push("/auth/verify-otp");
    },
    onError: (err) => toast.error(err.response?.data.error.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });
};
