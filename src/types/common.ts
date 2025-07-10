
export type Locale = "ar" | "en";
export interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
  }
  export type Response<T> = {
    data: T;
    message: string;
    code: number;
    unread_total?: string;
    pagination?: Pagination;
  };
  export type ResponseData<T> = {
    data: T[];
    message: string;
    code: number;
  };
  
  export const phoneRegExp =
    /^^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$$/;
  