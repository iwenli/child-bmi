// components/chart/chartColumn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
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