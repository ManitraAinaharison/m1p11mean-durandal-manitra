export interface ApiSuccess {
  success: boolean;
  payload: any;
}

export interface ApiError {
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  payload: T;
}