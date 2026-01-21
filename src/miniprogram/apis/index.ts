
export interface IStore<T = any> {
  [key: string]: T & any;
}
export interface IApiResponse<T = IStore> {
  success: boolean;
  code: number;
  data: T;
  message?: string;
  extras: any;
  timestamp: number;
}
export interface LoginOutput {
  id: number;
  account: string;
  /**
   *   状态-正常_0、停用_1、删除_2
   */
  status: 0 | 1 | 2;
  openId: string;
  unionId: string;
  mobile: string;
  email: string;
  nickName: string;
  avatar: string;
  createdTime?: Date;
}
