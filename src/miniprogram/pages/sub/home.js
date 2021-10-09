const apis = require('../../api/apis.js')
const util = require('../../utils/util.js')
const config = require('../../config.js')
const constData = require('../../assets/datas/data')
const services = require('../../utils/services')
const {
  getRecordList
} = require("../../api/childApis")

const app = getApp()

let context;
// let chart = null;
let elAvatarScale = null;

// function initChart(canvas, width, height, F2) {
//   F2.Global.setTheme({
//     colors: ['#F04864', '#D66BCA', '#8543E0', '#8E77ED', '#3436C7', '#737EE6', '#223273', '#7EA2E6'],
//     pixelRatio: 20,
//     axis: {
//       label: (text, index, total) => {
//         const cfg = {
//           textAlign: 'center',
//           fill: 'rgba(255,255,255, 0.6)',
//         };
//         return cfg;
//       }
//     }
//   });
//   chart = new F2.Chart({
//     el: canvas,
//     width,
//     height,
//     animate: true,
//     padding: [40, 10, 'auto', '25']
//   });

//   return chart;
// }

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    app: {},
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    triggered: false,
    measure: 1,
    historyList: [],
    styles: {
      line: 'var(--main-color-50)',
      bginner: 'transparent',
      bgoutside: 'transparent',
      fontColor: 'var(--main-color-80)',
      lineSelect: 'var(--main-color-100)',
      fontSize: 16
    },
    showModel: true,

    curChild: {},
    recordList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChangeMeasure: function (e) {
      const {
        measure
      } = e.currentTarget.dataset;
      this._changeMeasure(measure * 1);
    },
    _changeMeasure: function (measure) {
      if (this.data.measure === measure) {
        return;
      }
      this.setData({
        measure: measure
      });
      context.__processHistory()
    },
    go: function (e) {
      const {
        page
      } = e.currentTarget.dataset
      var myEventDetail = {
        page: page
      } // detail对象，提供给事件监听函数
      var myEventOption = {
        bubbles: true,
        composed: true
      } // 触发事件的选项
      this.triggerEvent('parentNavigateTo', myEventDetail, myEventOption)
    },
    // onRefresh() {
    //   // 监听该页面用户下拉刷新事件
    //   // 可以在触发时发起请求，请求成功后调用wx.stopPullDownRefresh()来结束下拉刷新
    //   if (this._freshing) return
    //   console.log('下拉刷新')
    //   this._freshing = true
    //   setTimeout(() => {
    //     this.setData({
    //       triggered: false,
    //     })
    //     this._freshing = false
    //   }, 3000)
    // },
    // handleScroll(e) {
    //   debugger
    //   // 防抖，优化性能
    //   // 当滚动时，滚动条位置距离页面顶部小于设定值时，触发下拉刷新
    //   // 通过将设定值尽可能小，并且初始化scroll-view组件竖向滚动条位置为设定值。来实现下拉刷新功能，但没有官方的体验好
    //   clearTimeout(this.timer)
    //   if (e.detail.scrollTop < this.data.scrollTop) {
    //     this.timer = setTimeout(() => {
    //       this.refresh()
    //     }, 350)
    //   }
    // },
    handleAddChild(e) {
      wx.navigateTo({
        url: '/pages/sub/child',
      })
    },
    handleChangeChild(e) {
      context._changeChild(e.detail.value)
    },
    async _changeChild(child) {
      util.cacheHandler.set('child_current', child, 0)
      if (child) {
        const recordList = (await getRecordList(child._id)).result || []
        child.lastRecord = recordList[0]
        context.setData({
          recordList: recordList,
          curChild: child
        })
        context.__processHistory()
      }
    },
    async _init() {
      const user = await services.user.getDetailWithCache();
      const children = await services.user.getChilds()
      if (children && children.length > 0) {
        elAvatarScale.init(children)
      }
      context._changeChild(children[0])
    },
    __processHistory() {
      const measure = context.data.measure // 1身高 2体重
      const recordList = context.data.recordList
      const list = recordList.map(m => {
        return {
          Key: m.date + `（${util.formater.formatBirthday(context.data.curChild.birthDay,new Date(m.date))}）`,
          Value: measure === 1 ? m.height : m.weight
        }
      })
      if (list.length > 5) list.length = 5
      context.setData({
        historyList: list
      })
    }
  },
  lifetimes: {
    created() {
      context = this;
      elAvatarScale = context.selectComponent('#avatar-scale')
    },
    async attached() {
      context.setData({
        app: config.application
      })
      context._init()
    },
    ready() {}
  },
  pageLifetimes: {
    show: async function () {
      if (context.data.curChild._id) {
        const children = await services.user.getChilds()
        if (children && children.length > 0) {
          elAvatarScale.init(children)
        }
        context._changeChild(context.data.curChild)
      }
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
      debugger
    }
  }
})