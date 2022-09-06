export interface APIMetaData {
  current_page: number;
  first_page: number;
  last_page: number;
  total_records: number;
  page_size: number;
}

export interface BaseAPIQuery<T> {
  page?: number;
  page_size?: number;
  sort?: keyof T
};
