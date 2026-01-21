import config from '../config';
import log from '../common/logger';
import userStore from '../store/userStore';
import util, { showModal } from '../common/util'
import { IApiResponse, IStore } from '.';

const httpRequest = <T = any>(
  path = "",
  params = {},
  options: IStore = {}
): Promise<any> => {
  const url = `${options.apiURL || config.apiUrl}/${path}`;
  console.log(url + " 请求：", params);

  let AuthorizationObj: any = {
    authorization: 'Bearer ' + userStore.state.accessToken,
  };
  if (options.noAuth) {
    AuthorizationObj = {};
  }

  options.loading && util.loading.open();

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      header: {
        ...AuthorizationObj,
        ...options.headers,
        "Cache-Control": "no-cache",
        "x-appid": config.appId,
      },
      responseType: options.responseType || "text",
      method: options.method,
      data: params,

      success: function (res:any) {
        console.log(url + " 原始响应：", res);
        resolve(res);
      },

      fail: function (e:any) {
        reject(e);
      },

      complete: function () {
        options.loading && util.loading.close();
      },
    });
  });
};


export const httpJson = async <T = any>(
  path = "",
  params = {},
  options: IStore = {}
): Promise<IApiResponse<T>> => {
  const res = await httpRequest<T>(path, params, {
    ...options,
    responseType: "text",
  });

  const { data }: any = res;
  console.log(path + " 业务响应：", data);

  if (!data.success) {
    showModal(data.message, "", { showCancel: false });
    throw new Error(data.errmsg);
  }
  return data as IApiResponse<T>;
};

export const httpArrayBuffer = async (
  path = "",
  params = {},
  options: IStore = {}
): Promise<ArrayBuffer> => {
  const res = await httpRequest(path, params, {
    ...options,
    responseType: "arraybuffer",
  });

  console.log(path + " 图片流响应");

  return res.data as ArrayBuffer;
};

export const httpPost = <T>(path = "", params = {}, options: IStore = {}) => {
  options.method = "POST"
  return httpJson<T>(path, params, options)
}

export const httpGet = <T>(path = "", params = {}, options: IStore = {}) => {
  options.method = "GET"
  return httpJson<T>(path, params, options)
}

export const httpDel = <T>(path = "", params = {}, options: IStore = {}) => {
  options.method = "DELETE"
  return httpJson<T>(path, params, options)
}

export const httpPut = <T>(path = "", params = {}, options: IStore = {}) => {
  options.method = "PUT"
  return httpJson<T>(path, params, options)
}