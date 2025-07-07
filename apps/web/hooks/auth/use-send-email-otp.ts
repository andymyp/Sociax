import { sendEmailOtpApi } from "@/lib/apis/auth-api";
import { AppDispatch } from "@/lib/store";
import { setVerify } from "@/lib/store/actions/auth-action";
import { AppAction } from "@/lib/store/slices/app-slice";
import { IApiError, IApiRequest, IApiResponse } from "@/lib/types/app-type";
import { IEmailResponse } from "@/lib/types/auth-type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useSendEmailOtp = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation<
    IApiResponse<IEmailResponse>,
    AxiosError<IApiError>,
    IApiRequest<IEmailResponse>
  >({
    mutationFn: async ({ body }) => {
      dispatch(AppAction.setLoading(true));

      const data = await sendEmailOtpApi(body);
      return data;
    },
    onSuccess: async ({ data }) => {
      await dispatch(setVerify(data));
      toast.success("OTP send to " + data.email);
    },
    onError: (err) => toast.error(err.response?.data.error.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });
};
