// miniprogram/pages/sub/childDetail.js
const app = getApp()
const util = require('../../utils/util')
const service = require('../../utils/services')
const {
  addChild,
  getChildDetail,
  deleteChild
} = require('../../api/childApis')

let that;

const _today = util.dateHandler.formatDate(new Date(), '-');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    id: '',
    today: _today,
    child: {
      name: '',
      avatar: '',
      sex: -1,
      birthDay: _today
    },
    picker: ['男', '女']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    that = this
    that.setData({
      id: options.id || ''
    })
    if (!!that.data.id) {
      that.loadData(that.data.id)
    }
  },
  async loadData(id) {
    let child = await getChildDetail(id)
    child.result.sex -= 1
    child.result.birthDay = util.dateHandler.formatDate(new Date(child.result.birthDay), '-');
    that.setData({
      child: child.result
    })
  },
  async handleUploadImage(e) {
    if (!!that.data.id) return

    const user = await service.user.getDetailWithCache();
    const res = await service.file.chooseUploadImage(user.user._openid || '')
    that.setData({
      'child.avatar': res.uploadFile.fileID
    })
  },
  handleInput(e) {},
  handleChangeSex(e) {
    console.log(e.detail.value);
    that.setData({
      'child.sex': e.detail.value * 1
    })
  },
  handleChangeDate(e) {
    console.log(e.detail.value);
    that.setData({
      'child.birthDay': e.detail.value
    })
  },
  async handleDelete(e) {
    await deleteChild(that.data.id);
    wx.navigateBack();
  },
  async handleSubmit(e) {
    console.log(e.detail.value);

    const data = {
      ...that.data.child,
      ...e.detail.value
    }
    data.sex += 1
    console.log(data)

    if (!that.validationFormItem(data.name.length > 1, '称呼不能为空')) return false;
    if (!that.validationFormItem(data.sex >= 1 && data.sex <= 2, '请选择性别')) return false;
    if (!that.validationFormItem(data.avatar.length > 1, '请上传头像')) return false;
    if (!that.validationFormItem(new Date(data.birthDay) < new Date(), '请正确选择出生日期')) return false;
    await addChild(data);

    wx.navigateBack();
  },
  validationFormItem(validation, errMsg = '值不能为空') {
    if (!validation) {
      wx.showModal({
        title: '验证失败',
        content: errMsg,
        showCancel: false
      });
      return false
    }
    return true;
  }
})