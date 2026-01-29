// const {
//   summaryData,
//   subscribe
// } = require("../../api/childApis")

import api from '../../apis/api'

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
    const resp = await api.child.dashboard.summary()

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
          userCount: that.coutNum(resp.data.userCount),
          babyCount: that.coutNum(resp.data.childCount),
          subCount: that.coutNum(resp.data.subscribeCount)
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
      const res = await api.subscribeTemplateMsg.list(config.appId)

      const tmpls = [...res.data]
      if (!tmpls.length) return

      const subRes = await wx.requestSubscribeMessage({
        tmplIds: tmpls.map(m => m.templateId)
      })
      tmpls.forEach(tmpl => {
        if (subRes[tmpl.templateId] === 'accept') {
          // 订阅消息
          api.subscribeTemplateMsg.confirm(tmpl)
        }
      });

    },
  }
})