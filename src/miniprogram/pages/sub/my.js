const config = require('../../config.js')

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    app: {},
    userCount: 0,
    babyCount: 0,
    subCount: 0,
  },
  attached() {
    console.log("success")
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })

    this.setData({
      app: config.application
    })

    let i = 0;
    numDH();

    function numDH() {
      if (i < 20) {
        setTimeout(function () {
          that.setData({
            userCount: i,
            babyCount: i,
            subCount: i
          })
          i++
          numDH();
        }, 20)
      } else {
        that.setData({
          userCount: that.coutNum(3000),
          babyCount: that.coutNum(484),
          subCount: that.coutNum(24000)
        })
      }
    }
    wx.hideLoading()
  },
  methods: {
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    showQrcode() {
      debugger
      wx.previewImage({
        urls: [config.appreciationCode],
        current: config.appreciationCode
      })
    },
    handleSubscribe() {
      const self = this
      wx.requestSubscribeMessage({
        tmplIds: ['WgfQr0MqXhAxJ7WCOg3yeRSxDnp5QXaMkignXOsa5FY'],
        success(res) {
          console.log(res)
          if (res.errMsg === 'requestSubscribeMessage:ok') {
            self.handleSubscribeMessageSend()
          }
        },
        complete(res) {
          console.log(res)
        }
      })
    },
    handleSubscribeMessageSend() {
      let param = {
        "touser": "",
        "template_id": "WgfQr0MqXhAxJ7WCOg3yeRSxDnp5QXaMkignXOsa5FY",
        "page": "pages/index/index",
        "data": {
          "time1": {
            "value": '2020-08-20 8:00'
          },
          "thing2": {
            "value": "身高体重记录"
          },
          "thing3": {
            "value": "请您按时给宝宝记录数据，养成良好习惯"
          }
        }
      }
      wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'sendSubscribeMessage',
          param: param
        },
        success: res => {
          console.warn('[云函数] [openapi] subscribeMessage.send 调用成功：', res)
          wx.showModal({
            title: '订阅成功',
            content: '请返回微信主界面查看',
            showCancel: false,
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [openapi] subscribeMessage.send 调用失败：', err)
        }
      })
    },
  }
})