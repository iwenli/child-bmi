// miniprogram/pages/sub/child.js
const service = require("../../utils/services")

let that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    that = this
  },
  async onShow() {
    const childs = await service.user.getChilds()
    that.setData({
      list: childs
    })
  },
  handleDetail(e) {
    const id = e.currentTarget.dataset.id || ''
    wx.navigateTo({
      url: '/pages/sub/childDetail?id=' + id,
    })
  }
})