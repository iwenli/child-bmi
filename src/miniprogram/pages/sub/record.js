const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,

    weight: 70,
    height: 180,
    styles: {
      line: 'var(--main-color-50)',
      bginner: 'transparent',
      bgoutside: 'transparent',
      fontColor: 'var(--main-color-80)',
      lineSelect: 'var(--main-color-100)',
      fontSize: 16
    }
  },
  bindvalue(e) { //滑动回调
    const value = e.detail.value;
    const key = e.currentTarget.id;
    const data = {};
    data[key] = value;
    this.setData(data);
  }
})