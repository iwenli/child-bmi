const util = require("../../utils/util");
// const {
//   addRecord
// } = require('../../api/childApis')

const app = getApp()
let that;
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    minWeight: 0,
    maxWeight: 100,
    minHeight: 30,
    maxHeight: 260,
    styles: {
      line: 'var(--main-color-50)',
      bginner: 'transparent',
      bgoutside: 'transparent',
      fontColor: 'var(--main-color-80)',
      lineSelect: 'var(--main-color-100)',
      fontSize: 16
    },

    child: null,
    height: 0,
    weight: 0,
    date: '',
  },
  onLoad() {
    that = this
    const child = util.cacheHandler.get('child_current')
    that.setData({
      date: util.dateHandler.formatDate(new Date(), '-'),
      child: child,
      height: child.lastRecord.height || 50,
      weight: child.lastRecord.weight || 3,
    })
  },
  bindvalue(e) { //滑动回调
    const value = e.detail.value;
    const key = e.currentTarget.id;
    const data = {};
    data[key] = value;
    this.setData(data);
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  async handleSubmit(e) {
    if (!that.data.child) {
      wx.showModal({
        content: '系统异常，请联系客服',
        showCancel: false
      })
      return
    }
    const data = {
      childId: that.data.child._id,
      height: that.data.height * 1,
      weight: that.data.weight * 1,
      date: that.data.date,
    }
    const res = await addRecord(data)
    if (res.code === 0) {
      setTimeout(() => {
        wx.navigateBack({
          delta: 0,
        })
      }, 1500);
    }
  }
})