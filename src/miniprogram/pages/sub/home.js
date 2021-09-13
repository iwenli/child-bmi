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
let chart = null;
let elAvatarScale = null;

function initChart(canvas, width, height, F2) {
  F2.Global.setTheme({
    colors: ['#F04864', '#D66BCA', '#8543E0', '#8E77ED', '#3436C7', '#737EE6', '#223273', '#7EA2E6'],
    pixelRatio: 20,
    axis: {
      label: (text, index, total) => {
        const cfg = {
          textAlign: 'center',
          fill: 'rgba(255,255,255, 0.6)',
        };
        return cfg;
      }
    }
  });
  chart = new F2.Chart({
    el: canvas,
    width,
    height,
    animate: true,
    padding: [40, 10, 'auto', '25']
  });

  return chart;
}

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
    opts: {
      onInit: initChart
    },
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

      this._getTrends()
    },
    _getTrends: function () {
      context.__render()
    },
    __getData() {
      let data = constData.BOY_7_HEIGHT.data

      let minList = data.map((m, i) => {
        return {
          type: '最小值',
          id: i,
          x: m.key,
          y: m.valueSD3_,
        }
      })
      let maxList = data.map((m, i) => {
        return {
          type: '最大值',
          id: i,
          x: m.key,
          y: m.valueSD3,
        }
      })
      return [...maxList, ...minList]
    },
    __render: function () {
      if (!chart) return
      chart.clear(); // 清除
      let data = context.__getData()
      let tickCount = 4;
      let max = data[data.length - 1].id;
      let min = data[data.length - 1 - tickCount].id;
      chart.source(data);

      chart.scale('id', {
        max: max,
        min: min,
        formatter: (id) => {
          let res = data.filter(m => m.id === id);
          if (res && res.length === 2) return (res[0].x + '周') || 'NAN'
          return ''
        },
      });
      // chart.axis('id', false)
      // chart.axis('y', false)
      //       chart.axis('id', {
      //   label: (text, index, total) => {
      //     const cfg = {
      //       textAlign: 'center',
      //       fill: 'rgba(255,255,255, 0.6)',
      //     };
      //     // 第一个点左对齐，最后一个点右对齐，其余居中，只有一个点时左对齐
      //     if (index === 0) {
      //       cfg.textAlign = 'start';
      //     }
      //     if (index > 0 && index === total - 1) {
      //       cfg.textAlign = 'end';
      //     }
      //     // cfg.text 支持文本格式化处理
      //       // let res = data.filter(m => m.id === text*1);
      //       //     if (res && res.length === 2) cfg.text = ( res[0].x+'周' )|| ''
      //     return cfg;
      //   }
      // });
      // chart.axis('y', {
      //   label: (text, index, total) => {
      //     const cfg = {
      //       textAlign: 'center',
      //       fill: 'rgba(255,255,255, 0.6)',
      //     };
      //     return cfg;
      //   }
      // });



      chart.tooltip({
        showCrosshairs: true,
        showXTip: true,
        crosshairsStyle: {
          stroke: 'rgba(255,255,255, 0.6)',
          lineWidth: 1
        }, // 配置辅助线的样式
        showItemMarker: false,
        background: {
          radius: 16,
          fill: '#FFFFFF',
          padding: [9, 16],
        },
        nameStyle: {
          fill: '#4F86F7',
          fontSize: 11,
        },
        valueStyle: {
          fill: '#4F86F7',
          fontSize: 11,
        },
        onShow(ev) {
          ev.items.length = 2;
        }
      });

      chart.area().position('id*y').color('type', ['l(-90) 0:#08B464 0.6:#4F86F7 1:#4F86F7', 'l(-90) 0:#08B464 0.8:#08B464 1:#FF6A5E']).shape('smooth');
      chart.line().position('id*y').color('type', ['#4F86F7', '#FF6A5E']).shape('smooth');

      chart.interaction('pan');
      // 定义进度条
      // chart.scrollBar({
      //   mode: 'x',
      //   xStyle: {
      //     offsetY: -1
      //   }
      // });
      chart.render();
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
    onRefresh() {
      // 监听该页面用户下拉刷新事件
      // 可以在触发时发起请求，请求成功后调用wx.stopPullDownRefresh()来结束下拉刷新
      if (this._freshing) return
      console.log('下拉刷新')
      this._freshing = true
      setTimeout(() => {
        this.setData({
          triggered: false,
        })
        this._freshing = false
      }, 3000)
    },
    handleScroll(e) {
      debugger
      // 防抖，优化性能
      // 当滚动时，滚动条位置距离页面顶部小于设定值时，触发下拉刷新
      // 通过将设定值尽可能小，并且初始化scroll-view组件竖向滚动条位置为设定值。来实现下拉刷新功能，但没有官方的体验好
      clearTimeout(this.timer)
      if (e.detail.scrollTop < this.data.scrollTop) {
        this.timer = setTimeout(() => {
          this.refresh()
        }, 350)
      }
    },
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
      }
      setTimeout(() => {
        context._getTrends()
      }, 500);
    },
    async _init() {
      const user = await services.user.getDetailWithCache();
      const children = await services.user.getChilds()
      if (children && children.length > 0) {
        elAvatarScale.init(children)
      }
      context._changeChild(children[0])
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
    show: function () {
      debugger
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