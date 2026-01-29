// miniprogram/pages/sub/child.js
const { default: api } = require("../../apis/api");

let that;

Page({

  data: {
    list: []
  },

  onLoad(options) {
    that = this
  },
  async onShow() {
    const childRes =  await api.child.list()
    that.setData({
      list: [...childRes.data]
    })
  },
  handleDetail(e) {
    const id = e.currentTarget.dataset.id || ''
    wx.navigateTo({
      url: '/pages/sub/childDetail?id=' + id,
    })
  }
})