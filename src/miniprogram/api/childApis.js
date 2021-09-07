const call = async (apiName = 'mateData', params = {}, showLoading = true) => {
  console.group(`请求云函数：child-${apiName}`);
  console.log(`Request:`, params);

  showLoading && wx.showLoading({
    title: '加载中...',
    mask: true
  });

  try {
    var reqRes = await wx.cloud.callFunction({
      name: 'child',
      data: {
        apiName: apiName,
        params: params
      }
    })
    console.log(`Response:`, reqRes);
    var res = reqRes.result
    if (res && res.code === 0) {
      if (res.msg !== '') {
        wx.showToast({
          title: res.msg,
          icon: 'success'
        })
      }
      return res;
    }
    wx.showToast({
      title: `${res.msg}(${res.code})`,
      icon: 'error'
    })
  } catch (err) {
    wx.showModal({
      showCancel: false,
      content: err.message
    })
    console.error(`Response Error:`, err);
  } finally {
    showLoading && wx.hideLoading()
    console.groupEnd();
  }
}

module.exports = {
  mateData: () => call(),
  getUserDetail: () => call('users'),
  getChildDetail: (childId) => call('childDetail', {
    childId
  }, false),
  addChild: (params) => call('childDetail', params),
  addRecord: (params) => call('record', params),
  subscribe: (params) => call('subscribe', params),
  summaryData: () => call('summaryData'),
}