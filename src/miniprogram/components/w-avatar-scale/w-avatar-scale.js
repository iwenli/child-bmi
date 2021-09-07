/**
  min[number] 默认值 0, // 最小值
  max[number] 默认值 100, // 最大值
  int[boolean] 默认值 true, // 是否开启整数模式 ，false为小数模式  整数模式 step最小单位是 1 ，小数模式，step的最小单位是 0.1
  single[number] 默认值 10, // 单个格子的实际长度（单位px）
  h[number] 默认值 0,// 自定义高度 初始值为80
  active[null] 默认值 center ，// 自定义选中位置  （三个值 min, max ,center , 范围内合法数值）
  styles[object]  // 自定义卡尺样式
*/

const defaultStyles = {
  line: '#dbdbdb', // 刻度颜色
  bginner: '#fbfbfb', // 前景色颜色
  bgoutside: '#dbdbdb', // 背景色颜色
  lineSelect: '#6643e7', // 选中线颜色
  fontColor: '#404040', // 刻度数字颜色
  fontSize: 16 //字体大小
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    width: {
      type: Number,
      value: 50
    },
    index: {
      type: Number,
      value: 0
    },


    scroll: { //是否禁止滚动
      type: Boolean,
      value: false
    },
    active: {
      type: null,
      value: '0',
    },
    // 当前选中 
    styles: {
      type: Object,
      value: {}
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    rul: {},
    windowHeight: 0
  },

  ready() {
    const min = parseInt(this.data.min) || 0;
    const max = parseInt(this.data.max) || 100;
    this.setData({
      min,
      max
    });
    this.init();
  },

  methods: {
    init() {
      const centerNum = this.data.width * this.data.index
      setTimeout(() => {
        this.setData({
          centerNum
        });
      }, 200)
      //  获取节点信息，获取节点宽度
      var query = this.createSelectorQuery().in(this)
      query.select('#scale-wrapper').boundingClientRect((res) => {
        res.top // 这个组件内 #the-id 节点的上边界坐标
      }).exec((e) => {
        this.setData({
          windowWidth: e[0].width
        });
        this.setData({
          windowHeight: e[0].height
        });
      })
    },

    bindscroll(e) {
      clearTimeout(this._st)
      this._st = setTimeout(() => {
        // console.log(e)
        let offset = e.detail.scrollLeft;
        let value = parseInt(offset / this.data.width)
        if (offset % this.data.width > this.data.width / 2) {
          value += 1
        }
        if (value === this.data.index) return
        if (value > this.data.list.length - 1) {
          value = this.data.list.length - 1
        }
        const centerNum = this.data.width * value
        this.setData({
          centerNum,
          index: value
        })
        this.triggerEvent('value', {
          value: value
        });
      }, 200)

    }
  }
})