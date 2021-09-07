const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database();

/**
 * 响应
 * @param {数据集合} data 
 * @param {业务编码} code 
 * @param {业务消息} msg 
 */
function ret(data, code = 0, msg = '') {
  return {
    code: code,
    msg: msg,
    result: data
  }
}

const apiList = {
  users: '用户数据（用户&孩子）',
  childDetail: '指定儿童身高体重数据详情',
  addChild: '添加儿童',
  record: '记录数据',

  subscribe: '订阅消息',
  subscribeTimer: '订阅消息定时器',
  summaryData: '设置-统计数据',
}

/**
 * 用户数据
 * @param {云函数请求参数} params 
 * @param {上下文} context 
 */
const users = async (params, context, logger) => {
  const wxCtx = cloud.getWXContext()
  let res = {
    openid: wxCtx.OPENID,
    appid: wxCtx.APPID,
    unionid: wxCtx.UNIONID,
  }

  return {
    result: {
      params: params,
      context: context,
      wxCtx: wxCtx
    }
  }
}

const addChild = async (params, context) => {}
const childDetail = async (params, context) => {}
const record = async (params, context) => {}
const summaryData = async (params, context) => {
  let userCount = (await db.collection('c_user').count()).total;
  let childCount = (await db.collection('c_child').count()).total;
  let subscribeCount = (await db.collection('c_subscribe').count()).total;

  // 虚拟数据
  const yearDay = parseInt((new Date() - new Date('2021-1-1')) / (1000 * 60 * 60 * 24))
  const hours = new Date().getHours();
  const minutes = new Date().getMinutes();

  userCount += (yearDay * 120 + hours * 5 + parseInt(minutes / 12))
  childCount += parseInt(userCount / 60)
  subscribeCount += ((yearDay - 80) * 50 + hours * 2)

  const res = {
    userCount: userCount,
    childCount: childCount,
    subscribeCount: subscribeCount
  }
  return ret(res)
}

/* 
   订阅记录：
   _id,appId,openId,tempId,state,subTime,sendTime
   state:0待发送 1已发送
 */
const subscribe = async (params, context, logger) => {
  const {
    tmpId
  } = params
  if (!tmpId) {
    return ret(null, 0, '订阅消息模板ID不能为空')
  }
  const {
    OPENID,
    UNIONID,
    APPID
  } = cloud.getWXContext()

  const addRes = await db.collection('c_subscribe').add({
    data: {
      appId: APPID,
      openId: OPENID,
      tempId: tmpId,
      state: 0,
      subTime: new Date(),
      sendTime: null
    }
  })
  return ret(addRes, 0, '订阅成功')
}
// const subscribeTimer = async (params, context, logger) => {
// }

module.exports = {
  users,
  addChild,
  childDetail,
  record,
  summaryData,
  subscribe,
  subscribeTimer
}