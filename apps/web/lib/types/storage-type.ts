export interface IUploadFileRequest {
  bucket: string;
  file: File;
}

export interface IUploadFileResponse {
  url: string;
}
