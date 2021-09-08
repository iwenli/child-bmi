const util = require('./util')

const {
  getUserDetail
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

module.exports = {
  user: {
    getDetailWithCache
  }
}