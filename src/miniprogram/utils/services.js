const util = require('./util')

const {
  getUserDetail,
  getChildList
} = require('../api/childApis')

const getDetailWithCache = async () => {
  const key = 'child_user'
  let user = util.cacheHandler.get(key)
  if (!user) {
    const sysInfo = await wx.getSystemInfo()
    user = (await getUserDetail(sysInfo)).result
    util.cacheHandler.set(key, user)
  }
  return user
}

const getChilds = async () => {
  const {
    result
  } = await getChildList()
  const tempFileIds = result.map(m => m.avatar)
  const fileUrlRes = await wx.cloud.getTempFileURL({
    fileList: tempFileIds
  })
  result.forEach(m => {
    const file = fileUrlRes.fileList.find(_ => _.fileID === m.avatar)
    m.avatarUrl = file.tempFileURL
    m.birthdayDisplay = util.formater.formatBirthday(m.birthDay)
    m.lastRecord = {}
  });
  return result
}

const chooseUploadImage = async (path = "") => {
  const selectImageRes = await wx.chooseImage({
    count: 1,
  });
  let paths = ['upload']
  if (path.length > 0) {
    paths.push(path)
  }
  const tempId = selectImageRes.tempFilePaths[0]
  paths.push(tempId.substr(tempId.lastIndexOf('/') + 1))

  wx.showLoading({
    title: '正在上传...',
  })
  try {
    const cloudPath = paths.join('/')
    const uploadRes = await wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: tempId
    });
    return {
      chooseImage: selectImageRes,
      uploadFile: uploadRes
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