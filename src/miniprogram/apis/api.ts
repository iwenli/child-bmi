import { LoginOutput } from ".";
import { getCurrentPageUrlWithArgs } from "../common/util";
import { httpDel, httpGet, httpPost } from "./request";

// api-doc https://app.wenlis.com/swagger/index.html

const user = {
  async login(data: { code: string }) {
    return httpPost<any>("v1/identity/mini/login", data, { loading: false });
  },
  async getUserInfo() {
    return httpGet<LoginOutput>("v1/identity/user", {}, { loading: false });
  },
  async logout() {
    return httpGet<any>("v1/identity/logout", {}, { loading: true });
  }
};

const child = {
  list: async () => httpGet<any>("v1/children", {}, { loading: false }),
  add: async (data: any) => httpPost<any>("v1/children", data, { loading: true }),
  getDetail: async (id: number) => httpGet<any>(`v1/children/${id}`, {}, { loading: false }),
  delete: async (id: number) => httpDel<any>(`v1/children/${id}`, {}, { loading: false }),

  record: {
    list: async (childId: number) => httpGet<any>(`v1/children/${childId}/growth-records`, {}, { loading: false }),
    add: async (childId: number, data: any) => httpPost<any>(`v1/children/${childId}/growth-records`, data, { loading: true }),
    delete: async (childId: number) => httpDel<any>(`v1/children/${childId}/growth-records`, {}, { loading: false }),
  },

  dashboard: {
    summary: async () => httpGet<any>(`v1/children/dashboard/summary`, {}, { loading: false }),
  }
}

const common = {
  /**
   * 阿里云oss post上传 表单信息
   * @param durationSeconds 有效期，最大1小时(单位秒)
   */
  async aliyunOssFormdata(durationSeconds: number = 60) {
    return httpPost<any>("v1/common/file/aliyunoss/formdata", { durationSeconds }, { loading: false });
  }
};

const subscribeTemplateMsg = {
  list: async (appId: string) => httpGet<any>(`v1/mini/subscribe/templates`, { appId }, { loading: false }),
  confirm: async (data: any) => httpPost<any>(`v1/mini/subscribe/confirm`, data, { loading: false }),
}
export default {
  user,
  common,
  child,
  subscribeTemplateMsg
};
