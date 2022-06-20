export type FieldErrors<T> = { [K in keyof Partial<T>]: string };
