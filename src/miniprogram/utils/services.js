const util = require('./util')

import {
  uploadFileToAliyunOss
} from '../common/fileService'

const getDetailWithCache = async () => {
  const key = 'child_user'
  let user = util.cacheHandler.get(key)
  // if (!user) {
  //   const sysInfo = await wx.getSystemInfo()
  //   user = (await getUserDetail(sysInfo)).result
  //   util.cacheHandler.set(key, user)
  // }
  return user
}

const getChilds = async () => {
  // const {
  //   result
  // } = await getChildList()
  // const tempFileIds = result.map(m => m.avatar)
  // const fileUrlRes = await wx.cloud.getTempFileURL({
  //   fileList: tempFileIds
  // })
  // result.forEach(m => {
  //   const file = fileUrlRes.fileList.find(_ => _.fileID === m.avatar)
  //   m.avatarUrl = file.tempFileURL
  //   m.birthdayDisplay = util.formater.formatBirthday(m.birthDay)
  //   m.lastRecord = {}
  // });
  let result = []
  return result
}

const chooseUploadImage = async () => {
  const selectImageRes = await wx.chooseMedia({
    count: 1,
  });
  if (!selectImageRes.tempFiles || !selectImageRes.tempFiles.length) return

  wx.showLoading({
    title: '正在上传...',
  })
  try {
    const tempFilePath = selectImageRes.tempFiles[0].tempFilePath
    const url = await uploadFileToAliyunOss(tempFilePath)
    debugger
    return {
      tempFilePath: tempFilePath,
      url: url
    }
  } catch (err) {
    wx.showToast({
      title: err.message,
      icon: 'error'
    })
  } finally {
    wx.hideLoading()
  }
}

module.exports = {
  user: {
    getDetailWithCache,
    getChilds
  },
  file: {
    chooseUploadImage
  }
}