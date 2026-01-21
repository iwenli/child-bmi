const util = require('../../utils/util')

Page({
  data: {
    PageCur: 'home',
    ActionColor: 'main-color-100',
    DefaultColor: 'main-color-60',
    barItems: [{
      key: 'home',
      name: '数据',
      icon: 'home',
      action: false
    }, {
      key: '',
      name: '记录',
      icon: 'add',
      action: true,
      actionName: 'handleRecord'
    }, {
      key: 'my',
      name: '设置',
      icon: 'settings',
      action: false
    }]
  },
  onLoad(options) {
    if (options.hasOwnProperty('page')) {
      this._go(options.page)
    }
  },
  _go(page) {
    this.setData({
      PageCur: page
    })
  },
  go(e) {
    this._go(e.detail.page)
  },
  NavChange(e) {
    this._go(e.currentTarget.dataset.cur)
  },
  handleRecord(e) {
    const child = util.cacheHandler.get('child_current')
    if (!child) {
      wx.showToast({
        title: '请先添加宝贝信息',
        icon: 'error'
      })
      return;
    }
    wx.navigateTo({
      url: `/pages/sub/record`,
    })
  }
})