const util = require("../../utils/util");
const {
  BOY_7_HEIGHT,
  BOY_7_WEIGHT,
  BOY_7_HEAD,
  BOY_7_HW_1,
  BOY_7_HW_2,
  GRIL_7_HEIGHT,
  GRIL_7_WEIGHT,
  GRIL_7_HEAD,
  GRIL_7_HW_1,
  GRIL_7_HW_2,
} = require('../../assets/datas/data')
const app = getApp()
let that;
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    tableArr: ["月龄", "-3SD", "-2SD", "-1SD", "中位数", "1SD", "2SD", "3SD"],
    tables: []
  },
  async onLoad() {
    that = this
    that.setData({
      tables: {
        BOY_7_HEIGHT,
        BOY_7_WEIGHT,
        BOY_7_HEAD,
        BOY_7_HW_1,
        BOY_7_HW_2,
        GRIL_7_HEIGHT,
        GRIL_7_WEIGHT,
        GRIL_7_HEAD,
        GRIL_7_HW_1,
        GRIL_7_HW_2,
      }
    })
  },
})