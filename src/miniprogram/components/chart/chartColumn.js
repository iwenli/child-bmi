// components/chart/chartColumn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [{
        "StartDate": 0,
        "Key": "雀巢怡养益护因子中老年配方奶粉（蓝听，850克）",
        "Value": 318599.36,
        "Value1": 0.0
      }, {
        "StartDate": 0,
        "Key": "雀巢怡养健心中老年配方奶粉（绿听，800克）",
        "Value": 232782.78,
        "Value1": 0.0
      }, {
        "StartDate": 0,
        "Key": "雀巢怡养金装2合1中老年配方奶粉（金听，800克）",
        "Value": 87197.35,
        "Value1": 0.0
      }, {
        "StartDate": 0,
        "Key": "雀巢怡养中老年奶粉（蓝袋，400克）",
        "Value": 72236.77,
        "Value1": 0.0
      }, {
        "StartDate": 0,
        "Key": "雀巢怡养熠畅LiveATwo中老年配方奶粉（金听，750克）",
        "Value": 26662.38,
        "Value1": 0.0
      }, {
        "StartDate": 0,
        "Key": "雀巢怡养脑力加油站中老年配方奶粉（金听，800克）",
        "Value": 19824.80,
        "Value1": 0.0
      }, {
        "StartDate": 0,
        "Key": "雀巢怡养健心中老年奶粉（绿袋，400克）",
        "Value": 19353.77,
        "Value1": 0.0
      }, {
        "StartDate": 0,
        "Key": "雀巢怡养益护因子中老年配方奶粉（蓝听，700克）",
        "Value": 7539.83,
        "Value1": 0.0
      }]
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    cur: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tap: function (e) {
      const {
        index
      } = e.currentTarget.dataset;
      this.setData({
        cur: index
      })
    }
  },
  lifetimes: {
    created() {},
    attached() {

    },
    ready() {}
  }
})