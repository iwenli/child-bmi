const apis = require('../../api/apis.js')
const util = require('../../utils/util.js')
const app = getApp()
let context;

let chart = null;

function initChart(canvas, width, height, F2) {
  chart = new F2.Chart({
    el: canvas,
    width,
    height,
    animate: false,
    padding: [70, 10, 'auto', 20]
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
    homeData: {},
    measure: 3,
    trends: [],

    opts: {
      onInit: initChart
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _getTrends: function () {
      apis.getTrends(4, context.data.measure).then((data) => {
        this.setData({
          trends: data.result
        });
        context.__render()
      })
    },
    __getData: function () {
      let data = context.data.trends;
      let res = [];
      for (let index = 0; index < data.length; index++) {
        let key = data[index].Key.toString();
        if (key.length === 6) {
          key = key.replace(/^(.{4})(.{2})/, '$1-$2');
        } else if (key.length === 8) {
          key = key.replace(/^(.{4})(.*)(.{2})/, '$1-$2-$3');
        } else {
          // data[index].Key = key + '周'
          data[index].Key = util.formater.dateToWeek(data[index].StartDate)
        }
        data[index].Id = index

        res.push({
          Type: '积分发放',
          Id: index,
          Key: key,
          Value: data[index].Value / 1000000,
        })
        res.push({
          Type: '积分消耗',
          Id: index,
          Key: key,
          Value: data[index].Value1 / 1000000,
        })
      }
      console.log('F2-Data:', res)
      return res;
    },
    __render: function (type) {
      if (!chart) return
      chart.clear(); // 清除
      let data = context.__getData()

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
  },
  lifetimes: {
    created() {
      context = this;
      apis.getHome().then((data) => {
        this.setData({
          homeData: data.result
        });
      })
    },
    attached() {

    },
    ready() {
      this._getTrends()
    }
  }
})