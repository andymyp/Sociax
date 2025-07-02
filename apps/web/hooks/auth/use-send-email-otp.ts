import { sendEmailOtpApi } from "@/lib/apis/auth-api";
import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { AuthAction } from "@/lib/store/slices/auth-slice";
import { IApiError, IApiRequest, IApiResponse } from "@/lib/types/app-type";
import { IEmailResponse } from "@/lib/types/auth-type";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useSendEmailOtp = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation<
    IApiResponse<IEmailResponse>,
    IApiError,
    IApiRequest<IEmailResponse>
  >({
    mutationFn: async ({ body }) => {
      dispatch(AppAction.setLoading(true));

      const data = await sendEmailOtpApi(body);
      return data;
    },
    onSuccess: ({ data }) => {
      dispatch(AuthAction.setVerify(data));
      toast.success("OTP send to " + data.email);
    },
    onError: (error) => console.log("error:", error),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });
};
