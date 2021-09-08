const cloud = require('wx-server-sdk');
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
  summaryData: '设置-统计数据',
}
/**
 * 用户实体：
 * _openid,appId,unionId,createTime
 * 
 * 用户登录记录实体：
 * _openid,ip,SDKVersion,brand,model,system,createTime
 * 
 * 儿童实体：
 * _openid,name,avatar,sex,birthDay,createTime
 */
/**
 * 用户数据
 * @param {云函数请求参数} params 
 * @param {上下文} context 
 */
const users = async (params, context, logger) => {
  const {
    OPENID,
    UNIONID,
    APPID,
    CLIENTIP
  } = cloud.getWXContext()
  // user
  const userRes = await db.collection('c_user').where({
    appId: APPID,
    _openid: OPENID
  }).get()
  let user;
  if (userRes.data.length > 0) {
    user = userRes[0]
  }
  if (!user) {
    // 不存在用户  插入一个
    user = {
      _openid: OPENID,
      appId: APPID,
      unionId: UNIONID,
      createTime: new Date()
    }
    user._id = (await db.collection('c_user').add({
      data: user
    }))._id
  }

  // log
  let log = {
    _openid: OPENID,
    ip: CLIENTIP,
    sDKVersion: params.SDKVersion,
    brand: params.brand,
    model: params.model,
    system: params.system,
    createTime: new Date()
  }
  db.collection('c_loginlog').add({
    data: log
  })

  // child
  const childRes = await db.collection('c_child').where({
    _openid: OPENID
  }).get()

  return ret({
    user: user,
    children: childRes.data
  })
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
   _id,_openid,tempId,state,subTime,sendTime
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
    OPENID
  } = cloud.getWXContext()

  const addRes = await db.collection('c_subscribe').add({
    data: {
      _openid: OPENID,
      tempId: tmpId,
      state: 0,
      subTime: new Date(),
      sendTime: null
    }
  })
  return ret(addRes, 0, '订阅成功')
}

module.exports = {
  users,
  addChild,
  childDetail,
  record,
  summaryData,
  subscribe
}