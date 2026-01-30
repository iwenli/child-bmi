const util = require('../../utils/util.js')
const config = require('../../config.js')
const constData = require('../../assets/datas/data')
const { default: api } = require('../../apis/api.js')
const { default: userStore } = require('../../store/userStore.js')

const app = getApp()

let context;
let elAvatarScale = null;

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
    handleAddChild(e) {
      wx.navigateTo({
        url: '/pages/sub/child',
      })
    },
    handleShowHistory(e) {
      wx.navigateTo({
        url: '/pages/sub/history',
      })
    },
    handleStandard(e) {
      wx.navigateTo({
        url: '/pages/sub/standard',
      })
    },
    handleChangeChild(e) {
      context._changeChild(e.detail.value)
    },
    async _changeChild(child) {
      util.cacheHandler.set('child_current', child, 0)
      if (child) {
        const recordRes = await api.child.record.list(child.id)
        let recordList = recordRes.data || []
        child.lastRecord = recordList[0]
        context.setData({
          recordList: recordList,
          curChild: child
        })
        context.__processHistory()
      }
    },
    async _init() {
      const children = [...userStore.state.children]
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
          Key: m.createdTime + `（${util.formater.formatBirthday(context.data.curChild.birthDay, new Date(m.createdTime.replace(' ', 'T')))}）`,
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
      await userStore.login()
      context._init()
    },
    ready() { }
  },
  pageLifetimes: {
    show: async function () {
      if (context.data.curChild.id) {
        const children = [...userStore.state.children]
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