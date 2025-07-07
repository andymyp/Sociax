/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInOauthApi } from "@/lib/apis/auth-api";
import { signInOauth } from "@/lib/oauth";
import { AppDispatch } from "@/lib/store";
import { setUser } from "@/lib/store/actions/auth-action";
import { AppAction } from "@/lib/store/slices/app-slice";
import { setAccessToken } from "@/lib/token";
import { IApiError, IApiRequest, IApiResponse } from "@/lib/types/app-type";
import { ISignInOauthRequest, IUser } from "@/lib/types/auth-type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useSignInOauth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return useMutation<
    IApiResponse<{ url: string }>,
    AxiosError<IApiError>,
    IApiRequest<ISignInOauthRequest>
  >({
    mutationFn: async ({ body }) => {
      dispatch(AppAction.setLoading(true));

      const data = await signInOauthApi(body);
      return data;
    },
    onSuccess: async ({ data }) => {
      try {
        const res = await signInOauth(data.url);

        const user = jwtDecode<IUser>(res.access_token);

        delete user.created_at;
        delete user.updated_at;

        setAccessToken(res.access_token);
        await dispatch(setUser(user));

        if (!user.boarded) {
          router.replace("/onboarding");
        } else {
          toast.success("Welcome " + user.name);
          router.replace("/");
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    },
    onError: (err) => toast.error(err.response?.data.error.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });
};
