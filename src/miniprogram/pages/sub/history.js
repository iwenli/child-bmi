const util = require("../../utils/util");
// const {
//   getRecordList
// } = require('../../api/childApis')
const app = getApp()
let that;
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    tableArr: ["日期", "身高", "体重"],
    itemArr: []
  },
  async onLoad() {
    that = this
    const child = util.cacheHandler.get('child_current')
    const recordList = (await getRecordList(child._id)).result || []
    const list = recordList.map(m => {
      return {
        Key: m.date, // + `（${util.formater.formatBirthday(child.birthDay,new Date(m.date))}）`,
        Height: m.height + 'cm',
        Weight: m.weight + 'kg',
      }
    })
    that.setData({
      child: child,
      itemArr: list
    })
  },
})