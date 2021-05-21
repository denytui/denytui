export interface ResponseData<T> {
  code: number;
  message: string;
  data: T | any;
}

export const successResp = (data, message = 'Success'): ResponseData<any> => {
  return { code: 200, data: data, message };
};
export const errorResp = (e): ResponseData<any> => {
  return {
    code: 403,
    data: null,
    message: e.response?.message || e.toString(),
  };
};
