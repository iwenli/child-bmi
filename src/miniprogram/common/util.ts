export const showModal = async (content: string, title?: string, options: WechatMiniprogram.ShowModalOption = {}) => {
  const data = {
    confirmColor: "#92D050",
    showCancel: false,
    content: content,
    ...options,
  }
  if (title) data.title = title
  return await wx.showModal(data);
};


export const toast = function (title = "", duration: number = 1500, icon: 'success' | 'error' | 'loading' | 'none' = "none") {
  wx.showToast({
    title: `${title}`,
    icon: icon,
    duration: duration || 1500,
    mask: true,
  });
};


export const loading = {
  open: (title = '') => {
    wx.showLoading({ mask: true, title: title });
  },
  close: () => {
    wx.hideLoading();
  },
};
export function formatDateToZh(dateStr: string = "") {
  const date = !dateStr ? new Date() : new Date(dateStr);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  const weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const week = weeks[date.getDay()];

  return {
    dateText: `${month}月${day}日`,
    weekText: week
  }
}

export const getCurrentPageUrlWithArgs = (): string => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as WechatMiniprogram.Page.Instance<any, any>;
  const route = currentPage.route;
  const options = currentPage.options || {};
  const queryString = Object.keys(options)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`)
    .join('&');

  return queryString ? `${route}?${queryString}` : route;
}

export const toPage = (e: any) => {
  const { page } = e.currentTarget.dataset
  console.warn('访问page：' + page)
  wx.navigateTo({ url: page })
}
export const toSwatchPage = (e: any) => {
  const { page } = e.currentTarget.dataset
  console.warn('访问switchPage：' + page)
  wx.switchTab({ url: page })
}

export const toWeb = (h5Url: string) => {
  console.warn('访问web：' + h5Url)
  const url = '/pages/common/web?url=' + encodeURIComponent(h5Url)
  console.warn('进入页面：' + url)
  wx.navigateTo({
    url
  })
}

/**
 * 
 * @param type 0用户协议 1隐私条款 2个人信息 3三方信息共享 4会员服务
 */
export const toDefaultWeb = (type: 0 | 1 | 2 | 3 | 4 = 0) => {
  const webs = [
  ]
  if (type > webs.length || type < 0) type = 0
  const ruleUrl = webs[type] + '?t=' + (+new Date())
  toWeb(ruleUrl)
}

export const ensureTrailingSlash = (str: string) => {
  return str.endsWith('/') ? str : str + '/';
}

export default {
  toast,
  loading,
};
