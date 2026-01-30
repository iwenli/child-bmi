const util = require('./util')

import api from '../apis/api'
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
    getDetailWithCache
  },
  file: {
    chooseUploadImage
  }
}