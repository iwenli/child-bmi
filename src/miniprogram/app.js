//app.js
const util = require('./utils/util')

import logger from './common/logger';
import updateManager from './common/updateManager';
import userStore from './store/userStore';
App({
  globalData: {
    userStore,
    user: {},

    CustomBar: 0,
    StatusBar: 0,
    Custom: {}
  },
  async onLaunch() {
    // 注册异常
    wx.onUnhandledRejection((res) => {
      logger.error('全局未处理Promise异常', res.reason);
    });

    // 根据设备信息初始化自定义头部尺寸
    const winInfo = wx.getWindowInfo()
    this.globalData.StatusBar = winInfo.statusBarHeight;
    let capsule = wx.getMenuButtonBoundingClientRect();
    if (capsule) {
      this.globalData.Custom = capsule;
      this.globalData.CustomBar = capsule.bottom + capsule.top - this.globalData.StatusBar;
      console.log(this.globalData.CustomBar)
    } else {
      this.globalData.CustomBar = this.globalData.StatusBar + 50;
    }

    // 登录
    this.globalData.userStore = userStore
    this.globalData.user = await userStore.login()

    // 加载字体
    util.wxPro.loadFontFace({
      global: true,
      family: 'TTQinYuanJ-W4',
      source: 'url("https://btx-1252047676.cos.ap-beijing.myqcloud.com/miniapp/image/member/hFhOZOLk7wzV23f8085d3c6dd7b4ad3814ebb06980c6.ttf")',
    }).then(console.log, console.log);
  },
  onShow(options) {
    updateManager();
  }
})