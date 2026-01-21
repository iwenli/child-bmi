// const {
//   summaryData,
//   subscribe
// } = require("../../api/childApis")

const { default: config } = require("../../config");

let that = null

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    app: {},
    userCount: 0,
    babyCount: 0,
    subCount: 0,
  },
  async attached() {
    that = this;

    that.setData({
      app: config.application
    })

    const resp = await summaryData();
    
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
          userCount: that.coutNum(resp.result.userCount),
          babyCount: that.coutNum(resp.result.childCount),
          subCount: that.coutNum(resp.result.subscribeCount)
        })
      }
    }
  },
  methods: {
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(2) + 'K'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(2) + 'W'
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
      wx.previewImage({
        urls: [config.appreciationCode],
        current: config.appreciationCode
      })
    },
    async handleSubscribe() {
      const id = 'WgfQr0MqXhAxJ7WCOg3yeRSxDnp5QXaMkignXOsa5FY'
      const subRes = await wx.requestSubscribeMessage({
        tmplIds: [id]
      })
      if (subRes[id] === 'accept') {
        // 订阅消息
        await subscribe({tmpId:id})
      }
    },
  }
})