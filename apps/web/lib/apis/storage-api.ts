import { axiosClient } from "../axios";
import { IApiResponse } from "../types/app-type";
import { IUploadFileRequest, IUploadFileResponse } from "../types/storage-type";

export async function uploadFileApi(
  payload: IUploadFileRequest
): Promise<IApiResponse<IUploadFileResponse>> {
  const formData = new FormData();
  formData.append("file", payload.file);

  const { data } = await axiosClient.postForm(
    `/storage/upload/${payload.bucket}`,
    formData
  );
  return data;
}
