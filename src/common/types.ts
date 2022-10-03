export type FieldErrors<T> = { [K in keyof Partial<T>]: string };

export interface APIError {
  status: number;
  message: string;
};

export interface ValidationFailedResponse<T> extends APIError {
  fields: FieldErrors<T>;
};
