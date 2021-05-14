const apis = require('../../api/apis.js')
const util = require('../../utils/util.js')
const config = require('../../config.js')
const constData = require('../../assets/datas/data')
const app = getApp()

let context;
let chart = null;

function initChart(canvas, width, height, F2) {
  chart = new F2.Chart({
    el: canvas,
    width,
    height,
    animate: false,
    padding: [40, 10, 'auto', 25]
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
    curBaby: {},
    babies: []
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
      // apis.getTrends(1, context.data.measure).then((data) => {
      //   this.setData({
      //     trends: data.result
      //   });
      //   context.__render()
      // })
      context.__render()
    },
    __getData() {
      let data = constData.BOY_7_HEIGHT.data

      let minList = data.map(m => {
        return {
          Type: '最小值',
          Id: m.key,
          Key: m.key,
          Value: m.valueSD3_,
          // y: '最小值',
          // x: m.key,
          // value: m.valueSD3_
        }
      })
      let maxList = data.map(m => {
        return {
          Type: '最大值',
          Id: m.key,
          Key: m.key,
          Value: m.valueSD3,
          // y: '最大值',
          // x: m.key,
          // value: m.valueSD3
        }
      })


      let list = data.map(m => {
        return {
          Type: '中位数',
          Id: m.key,
          Key: m.key,
          Value: m.value,
          // y: '中位数',
          // x: m.key,
          // value: m.value
        }
      })

      return [...list, ...maxList, ...minList]
    },
    __render: function (type) {
      if (!chart) return
      chart.clear(); // 清除
      let data = context.__getData()
      debugger
      let tickCount = 6 * 2;
      let max = data[data.length - 1].Id;
      let min = data[data.length - 1 - tickCount].Id;
      let values = data.map(m => m.Key);
      chart.source(data);
      chart.scale('Id', {
        max: max,
        min: min,
        formatter: (id) => {
          let res = data.filter(m => m.Id === id);
          if (res && res.length === 2) return res[0].Key || 'NAN'
          return ''
        },
        tickCount: 4,
        alias: '日期'
      });
      chart.tooltip({
        showCrosshairs: true,
        showXTip: true,
        crosshairsStyle: {
          stroke: 'rgba(79,134,247, 0.6)',
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
          fontSize: 14,
        },
        valueStyle: {
          fill: '#4F86F7',
          fontSize: 14,
        },
        onShow(ev) {
          const items = ev.items;
          items[0].value = (items[0].value * 1000000) + '';
          items[1].value = (items[1].value * 1000000) + '';
          // items[0].name = '发放';
          // items[1].name = '消耗';
          ev.items.length = 2;
        }
      });

      chart.area().position('Id*Value').color('Type', ['l(-90) 0:#ffffff 0.5:#4F86F7 1:#4F86F7', 'l(-90) 0:#ffffff 0.5:#FF6A5E 1:#FF6A5E']).shape('smooth');
      chart.line().position('Id*Value').color('Type', ['#4F86F7', '#FF6A5E']).shape('smooth');

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
  },
  lifetimes: {
    created() {
      context = this;
    },
    attached() {
      context.setData({
        app: config.application
      })
      debugger
      this._getTrends()
    },
    ready() {
    }
  }
})