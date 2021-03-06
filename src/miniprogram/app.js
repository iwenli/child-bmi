//app.js
const util = require('./utils/util')
const config = require('./config')
App({
  onLaunch: async function () {
    wx.cloud.init({
      traceUser: true,
      env: config.envId
    })


    wx.getSystemInfo({
      success: e => {
        console.log(e)
        this.globalData.sysInfo = e
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
          console.log(this.globalData.CustomBar)
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    });
    // 加载字体
    util.wxPro.loadFontFace({
      global: true,
      family: 'TTQinYuanJ-W4',
      source: 'url("https://btx-1252047676.cos.ap-beijing.myqcloud.com/miniapp/image/member/hFhOZOLk7wzV23f8085d3c6dd7b4ad3814ebb06980c6.ttf")',
    }).then(console.log, console.log);
    // util.wxPro.loadFontFace({
    //   global: true,
    //   family: 'JetBrains Mono',
    //   source: 'url("https://btx-1252047676.cos.ap-beijing.myqcloud.com/miniapp/image/member/iX8lyR6CWdMC0189ed701950c39aca7664f1e9c3781f.ttf")',
    // }).then(console.log);
  },
  globalData: {
    http: 'https://host',
    sysInfo: {},
    authorization: '',
    openId: ''
  }
})