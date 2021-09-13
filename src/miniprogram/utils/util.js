const formatDate = (date, c = '.') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join(c)
}
/**
 * [dateAddDays 从某个日期增加n天后的日期]
 * @param  {[string]} dateStr  [日期字符串]
 * @param  {[int]} dayCount [增加的天数]
 */
const dateAddDays = function (dateStr, dayCount) {
  if (typeof dateStr !== 'string') dateStr = formatDate(dateStr, '/')
  console.log(dateStr)
  var tempDate = new Date(dateStr.replace(/-/g, "/")); //把日期字符串转换成日期格式
  var resultDate = new Date((tempDate / 1000 + (86400 * dayCount)) * 1000); //增加n天后的日期
  var resultDateStr = resultDate.getFullYear() + "-" + (resultDate.getMonth() + 1) + "-" + (resultDate.getDate()); //将日期转化为字符串格式
  return resultDateStr;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatDateToMontyDay = function (date, c = '/') {
  return formatNumber(date.getMonth() + 1) + c + formatNumber(date.getDate())
}

const formater = {
  /**
   * 百分比格式化
   * @param val 
   */
  percentage: function (val) {
    val = val || 0
    return (val * 100).toFixed(2) + '%'
  },
  // 保留2位小数  并逗号分隔
  toPrice: function (val) {
    if (!val) return '-'
    return ((val * 1).toFixed(2) * 1).toLocaleString()
  },
  /**
   * 将日期格式化为 日期范围周
   * @param {*} date 
   */
  dateToWeek: function (date) {
    if (typeof date !== 'object') date = new Date(date.toString().replace(/^(.{4})(.*)(.{2})/, '$1/$2/$3'))
    const startDate = date
    const days = 6
    const endDate = new Date((startDate / 1000 + (86400 * days)) * 1000)
    return `${formatDateToMontyDay(startDate)}\n~${formatDateToMontyDay(endDate)}`
  },
  formatDateToMontyDay: formatDateToMontyDay,
  formatBirthday: function (date) {
    const diff = new Date() - new Date(date);
    let days = parseInt(diff / (1000 * 60 * 60 * 24))
    let ret = '';
    if (days >= 365) {
      ret += `${parseInt(days / 365)}岁`
      days %= 365
    }
    if (days >= 7) {
      ret += `${parseInt(days / 7)}周`
      days %= 7
    }
    if (days > 0) {
      ret += `${days}天`
    }
    return ret
  }
}

// Promise化
const promisify = name => option =>
  new Promise((resolve, reject) =>
    wx[name]({
      ...option,
      success: resolve,
      fail: reject,
    })
  )
// Proxy 代理
const wxPro = new Proxy(wx, {
  get(target, prop) {
    return promisify(prop)
  }
})

/**
 * 将普通列表转换为树结构的列表
 * @param {列表 id,parendId 是必须项} list 
 */
const listConvertToTreeList = list => {
  if (!list || !list.length) {
    return [];
  }
  const treeListMap = {};
  list.forEach(item => {
    treeListMap[item.id] = item;
  });
  for (let i = 0; i < list.length; i++) {
    if (list[i].parentId && treeListMap[list[i].parentId]) {
      if (!treeListMap[list[i].parentId].children) {
        treeListMap[list[i].parentId].children = [];
      }
      treeListMap[list[i].parentId].children.push(list[i]);
      list.splice(i, 1);
      i--;
    }
  }
  return list;
}
/**
 * CDN图片格式化
 * 通过路径参数处理
 */
const cdnImageFormatHandler = {
  withWidth: (url, width) => `${url},1,${width},0,1`,
  withHeight: (url, height) => `${url},1,0,${height},1`,
  custom: (url, width, height) => `${url},1,${width},${height},3`,
  square: (url, val) => `${url},1,${val},${val},3`,
}

/**
 * 缓存,带过期时间
 * 使用小程序 Storage
 */
const cacheHandler = {
  claer: () => wx.clearStorageSync(),
  info: () => wx.getStorageInfoSync(),
  set: (key, data, expireSecond = 24 * 60 * 60) => {
    const expiredTime = expireSecond > 0 ? new Date(new Date() * 1 + expireSecond * 1000) : null
    wx.setStorageSync(key, {
      expiredTime: expiredTime,
      data: data
    })
  },
  get: (key) => {
    const res = wx.getStorageSync(key)
    if (res.expiredTime && new Date(res.expiredTime) < new Date()) {
      // 过期了
      wx.removeStorageSync(key)
      return undefined
    }
    return res.data;
  }
}

module.exports = {
  promisify: promisify,
  wxPro: wxPro,
  listConvertToTreeList,
  cdnImageFormatHandler,
  cacheHandler,
  dateHandler: {
    dateAddDays: dateAddDays,
    formatDate: formatDate
  },
  formater: formater
}


/**
 *  !用法示例
    const util = require('../../../utils/util.js')
    util.wxPro.showToast({
      title: 'okya',
    }).then(() => {
      console.log('showToast')
    })
 */