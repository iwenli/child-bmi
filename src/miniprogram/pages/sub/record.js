const util = require("../../utils/util");

const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    date: '',
    weight: 19.9,
    minWeight: 0,
    maxWeight: 100,
    height: 108.6,
    minHeight: 30,
    maxHeight: 260,
    styles: {
      line: 'var(--main-color-50)',
      bginner: 'transparent',
      bgoutside: 'transparent',
      fontColor: 'var(--main-color-80)',
      lineSelect: 'var(--main-color-100)',
      fontSize: 16
    }
  },
  onLoad() {
    this.setData({
      date: util.dateHandler.formatDate(new Date(), '-')
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
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  handleSubmit:function(e){
    wx.navigateBack({
      delta: 0,
    })
  }
})