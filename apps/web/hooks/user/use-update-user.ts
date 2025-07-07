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
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const useUpdateUser = () => {
  const dispatch = useDispatch<AppDispatch>();

  return useMutation<
    IApiResponse<IUser>,
    AxiosError<IApiError>,
    IApiRequest<IUpdateUserRequest>
  >({
    mutationFn: async ({ body }) => {
      dispatch(AppAction.setLoading(true));

      if (body.file instanceof File) {
        const upload = await uploadFileApi({
          bucket: "avatars",
          file: body.file,
        });

        body.avatar_url = upload.data.url;
      }

      if (typeof body.file === "string" && body.file === "") {
        body.avatar_url = body.file;
      }

      const data = await updateUserApi(body.id, body);
      return data;
    },
    onSuccess: async ({ data }) => {
      delete data.created_at;
      delete data.updated_at;

      await dispatch(setUser(data));
    },
    onError: (err) => toast.error(err.response?.data.error.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });
};
