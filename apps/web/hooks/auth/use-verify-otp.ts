import { verifyOtpApi } from "@/lib/apis/auth-api";
import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { AuthAction } from "@/lib/store/slices/auth-slice";
import { IApiError, IApiRequest, IApiResponse } from "@/lib/types/app-type";
import { IAuthResponse, IUser, IVerifyRequest } from "@/lib/types/auth-type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { AxiosError } from "axios";

export const useVerifyOtp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return useMutation<
    IApiResponse<IAuthResponse>,
    AxiosError<IApiError>,
    IApiRequest<IVerifyRequest>
  >({
    mutationFn: async ({ body }) => {
      dispatch(AppAction.setLoading(true));

      const data = await verifyOtpApi(body);
      return data;
    },
    onSuccess: ({ data }) => {
      if (data.type && data.type === 1) {
        router.replace("/auth/reset-password");
      } else {
        const user = jwtDecode<IUser>(data.access_token);

        dispatch(AuthAction.setToken(data.access_token));
        dispatch(AuthAction.setUser(user));

        toast.success("Welcome " + user.name);
        router.replace("/");

        dispatch(AuthAction.resetResendOtp());
        dispatch(AuthAction.setVerify(null));
      }
    },
    onError: (err) => toast.error(err.response?.data.error.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });
};
