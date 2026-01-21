/**
 * 微信小程序权限管理工具
 * 支持 camera、microphone、userInfo、location 等权限
 */

import { showModal } from "./util";

type AuthScope =
  | "scope.userInfo"
  | "scope.userLocation"
  | "scope.camera"
  | "scope.record"
  | "scope.writePhotosAlbum"
  | "scope.address"
  | "scope.invoice"
  | "scope.invoiceTitle"
  | "scope.werun"
  | "scope.bluetooth";

const AuthScopeMap: Record<AuthScope, string> = {
  "scope.userInfo": "用户信息（昵称、头像等）",
  "scope.userLocation": "地理位置",
  "scope.camera": "摄像头",
  "scope.record": "麦克风",
  "scope.writePhotosAlbum": "保存图片或视频到相册",
  "scope.address": "收货地址",
  "scope.invoice": "发票",
  "scope.invoiceTitle": "发票抬头",
  "scope.werun": "微信运动数据",
  "scope.bluetooth": "蓝牙"
};
class AuthUtil {
  /**
   * 查询权限状态
   */
  static async getAuth(scope: AuthScope): Promise<boolean | null> {
    const setting = await wx.getSetting();
    return setting.authSetting[scope] ?? null;
    // true: 已授权, false: 拒绝, null: 未询问
  }

  /**
   * 请求权限
   */
  static async requestAuth(scope: AuthScope): Promise<boolean> {
    try {
      const res = await wx.authorize({ scope });
      return res.errMsg.includes("ok");
    } catch (e) {
      return false; // 用户拒绝
    }
  }

  /**
   * 核心：确保权限可用
   * - 若未询问 → 请求授权
   * - 若拒绝 → 打开设置页
   * - 若永久拒绝 → 提示用户去设置页开启
   */
  static async ensureAuth(scope: AuthScope): Promise<boolean> {
    const status = await AuthUtil.getAuth(scope);

    if (status === null) {
      const ok = await AuthUtil.requestAuth(scope);
      if (ok) return true;
    }

    if (status === true) return true;

    const dialogConfig = {
      title: '权限请求',
      closeOnOverlayClick: true,
      content: `当前功能需要开启${AuthScopeMap[scope]}权限，是否前往设置？`,
      confirmBtn: { content: '去设置', variant: 'base', theme: 'default' },
      cancelBtn: '取消',
    };

    const res = await Dialog.confirm(dialogConfig)
    if (res.trigger == "confirm") {
      const res = await wx.openSetting();
      return res.authSetting[scope] === true;
    }
    return false;
  }

  static async ensureAuths(scopes: AuthScope[]): Promise<boolean> {
    // 先一次性查询所有权限状态
    const statusList = await Promise.all(scopes.map(scope => AuthUtil.getAuth(scope)));
  
    // 判断是否都已授权
    const allGranted = statusList.every(s => s === true);
  
    if (allGranted) return true;
  
    // 存在未授权的情况 → 先尝试主动授权（requestAuth）
    for (let i = 0; i < scopes.length; i++) {
      const scope = scopes[i];
      const status = statusList[i];
  
      if (status === null) {
        // null 代表未处理，需要弹框
        const ok = await AuthUtil.requestAuth(scope);
        if (!ok) {
          // 如果 requestAuth 被用户拒绝，则跳过继续统一弹最终授权
          continue;
        }
      }
    }
  
    // 再检查一次
    const finalStatus = await Promise.all(scopes.map(s => AuthUtil.getAuth(s)));
    const finalAllGranted = finalStatus.every(s => s === true);
  
    if (finalAllGranted) return true;
  
    // 仍有未授权 → 统一弹出说明，跳“去设置”
    const names = scopes.map(s => AuthScopeMap[s]).join('、');
  
    const dialogConfig = {
      title: '权限请求',
      closeOnOverlayClick: true,
      content: `当前功能需要您开启【${names}】权限，是否前往设置？`,
      confirmBtn: { content: '去设置', variant: 'base', theme: 'default' },
      cancelBtn: '取消',
    };
  
    const res = await Dialog.confirm(dialogConfig);
    if (res.trigger === 'confirm') {
      const setting = await wx.openSetting();
      return scopes.every(s => setting.authSetting[s] === true);
    }
  
    return false;
  }
}

export default AuthUtil;
