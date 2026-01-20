/**
 * 小程序配置文件
 */

const { miniProgram } = wx.getAccountInfoSync();

console.warn('getAccountInfoSync', miniProgram)
let env = miniProgram.envVersion || 'develop';

let _domains = {
  develop: "https://app.wenlis.com",
  trial: "https://app.wenlis.com",
  release: "https://app.wenlis.com",
};
 

export default {
  env,

  appId: miniProgram.appId,
  domain: _domains[env],
  apiUrl: _domains[env] + '/api',

  application: {
    name: '儿童身高体重记录助手',
    version: '1.0.1',
    author: 'iwenli',
  },
  appreciationCode: 'https://cdn.wenlis.com/wlapp/_upload/20260120/764791992967237.png' // 赞赏码
};