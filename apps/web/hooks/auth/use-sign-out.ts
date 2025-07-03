import { signOutApi } from "@/lib/apis/auth-api";
import { AppDispatch, persistor } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { setAccessToken } from "@/lib/token";
import { IApiError, IApiRequest, IApiResponse } from "@/lib/types/app-type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useSignOut = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return useMutation<
    IApiResponse<{ message: string }>,
    AxiosError<IApiError>,
    IApiRequest
  >({
    mutationFn: async () => {
      dispatch(AppAction.setLoading(true));

      const data = await signOutApi();
      return data;
    },
    onSuccess: async () => {
      dispatch({ type: "RESET" });
      await persistor.purge();

      setAccessToken(null);

      router.replace("/auth/sign-in");
    },
    onError: (err) => toast.error(err.response?.data.error.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });
};
