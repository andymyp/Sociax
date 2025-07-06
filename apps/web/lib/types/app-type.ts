export interface IApiRequest<T = unknown, U = undefined> {
  body: T;
  query?: Partial<U>;
}

export interface IApiResponse<T> {
  code: number;
  data: T;
}

export interface IApiError {
  error: {
    code: number;
    message: string;
  };
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropPoint {
  x: number;
  y: number;
}
