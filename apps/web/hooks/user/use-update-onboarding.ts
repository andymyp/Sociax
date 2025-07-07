import { uploadFileApi } from "@/lib/apis/storage-api";
import { updateUserApi } from "@/lib/apis/user-api";
import { AppDispatch } from "@/lib/store";
import { setUser } from "@/lib/store/actions/auth-action";
import { AppAction } from "@/lib/store/slices/app-slice";
import { IApiError, IApiRequest, IApiResponse } from "@/lib/types/app-type";
import { IUser } from "@/lib/types/auth-type";
import { IUpdateUserRequest } from "@/lib/types/user-type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useUpdateOnboarding = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return useMutation<
    IApiResponse<IUser>,
    AxiosError<IApiError>,
    IApiRequest<IUpdateUserRequest>
  >({
    mutationFn: async ({ body }) => {
      dispatch(AppAction.setLoading(true));

      let avatar_url = body.avatar_url;

      if (body.file instanceof File) {
        const upload = await uploadFileApi({
          bucket: "avatars",
          file: body.file,
        });

        avatar_url = upload.data.url;
      } else {
        avatar_url = body.file;
      }

      const data = await updateUserApi(body.id, { ...body, avatar_url });
      return data;
    },
    onSuccess: async ({ data }) => {
      delete data.created_at;
      delete data.updated_at;

      await dispatch(setUser(data));

      toast.success("Welcome " + data.name);
      router.replace("/");
    },
    onError: (err) => toast.error(err.response?.data.error.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });
};
