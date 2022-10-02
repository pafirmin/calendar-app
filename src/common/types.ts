export type FieldErrors<T> = { [K in keyof Partial<T>]: string };

export interface ValidationFailedResponse<T> {
  status: number;
  message: string;
  fields: FieldErrors<T>;
};
