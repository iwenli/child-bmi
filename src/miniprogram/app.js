//app.js
const util = require('./utils/util')
const config = require('./config')

App({
  onLaunch: function () {
    wx.cloud.init({
      traceUser: true,
      env: config.envId,
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

        this.getUserOpenIdViaCloud()
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
    http: 'https://cytcrm.nestlechinese.com/ba/api/v1',
    sysInfo: {},
    authorization: '',
    openId: ''
  },
  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    if (this.globalData.openId) return
    wx.login().then(res => {
      return wx.cloud.callFunction({
        name: 'wxContext',
        data: {}
      }).then(res => {
        console.log('获取登录标识', res)
        this.globalData.openId = res.result.openid
        return res.result.openid
      })
    })

  }
})