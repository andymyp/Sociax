import { signInApi } from "@/lib/apis/auth-api";
import { AppDispatch } from "@/lib/store";
import { setUser } from "@/lib/store/actions/auth-action";
import { AppAction } from "@/lib/store/slices/app-slice";
import { setAccessToken } from "@/lib/token";
import { IApiError, IApiRequest, IApiResponse } from "@/lib/types/app-type";
import { IAuthResponse, ISignInRequest, IUser } from "@/lib/types/auth-type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useSignIn = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return useMutation<
    IApiResponse<IAuthResponse>,
    AxiosError<IApiError>,
    IApiRequest<ISignInRequest>
  >({
    mutationFn: async ({ body }) => {
      dispatch(AppAction.setLoading(true));

      const data = await signInApi(body);
      return data;
    },
    onSuccess: async ({ data }) => {
      const user = jwtDecode<IUser>(data.access_token);

      setAccessToken(data.access_token);
      await dispatch(setUser(user));

      toast.success("Welcome " + user.name);

      if (!user.boarded) {
        router.replace("/onboarding");
      } else {
        router.replace("/");
      }
    },
    onError: (err) => toast.error(err.response?.data.error.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });
};
