import { LoginOutput } from ".";
import { httpGet, httpPost } from "./request";

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


const common = {
  /**
   * 阿里云oss post上传 表单信息
   * @param durationSeconds 有效期，最大1小时(单位秒)
   */
  async aliyunOssFormdata(durationSeconds: number = 60) {
    return httpPost<any>("v1/common/file/aliyunoss/formdata", { durationSeconds }, { loading: false });
  }
};
export default {
  user,
  common
};
