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

const addChild = async (params, context, logger) => {
  if (!params.name || params.name.length < 1)
    return ret(null, -1, '名字不能为空')
  if (!params.avatar || params.avatar.length < 1)
    return ret(null, -2, '请选择头像')
  if (params.sex !== 1 && params.sex != 2)
    return ret(null, -3, '非法性别')
  if (!params.birthDay || params.birthDay.length < 1 || new Date(params.birthDay) > new Date())
    return ret(null, -4, '出生日期非法')
  const {
    OPENID
  } = cloud.getWXContext()
  const child = {
    _openid: OPENID,
    name: params.name,
    avatar: params.avatar,
    sex: params.sex,
    birthDay: new Date(params.birthDay),
    createTime: new Date()
  }
  logger.error({
    content: '组装数据',
    data: child
  })
  child._id = (await db.collection('c_child').add({
    data: child
  }))._id
  return ret(child, 0, '添加成功')
}

const childList = async (params, context, logger) => {
  const {
    OPENID
  } = cloud.getWXContext()
  const childRes = await db.collection('c_child').where({
    _openid: OPENID
  }).get()
  return ret(childRes.data)
}

const childDetail = async (params, context, logger) => {
  const {
    childId
  } = params
  const res = await db.collection('c_child').doc(childId).get()
  return ret(res.data)
}
const childDelete = async (params, context, logger) => {
  const {
    childId
  } = params
  const res = await db.collection('c_child').doc(childId).remove()
  return ret(res)
}
/**
 * 记录实体：
 * _id,childId,height,weight,date,cteateTime
 */
/*
 * 获取记录详情
 * @param {*} params 
 * @param {*} context 
 */
const recordList = async (params, context, logger) => {
  const res = await db.collection('c_record').where({
    childId: params.childId
  }).get()

  return ret(res.data)
}
const record = async (params, context, logger) => {
  if (params.childId.length < 1)
    return ret(null, -100, '非法请求')
  if (params.height < 1)
    return ret(null, -1, '法非身高值')
  if (params.weight < 1)
    return ret(null, -2, '法非体重值')
  if (!params.date || params.date.length < 1 || new Date(params.date) > new Date())
    return ret(null, -4, '非法日期')
  const {
    OPENID
  } = cloud.getWXContext()

  const model = {
    _openid: OPENID,
    childId: params.childId,
    height: params.height,
    weight: params.weight,
    date: params.date,
    createTime: new Date()
  }
  model._id = (await db.collection('c_record').add({
    data: model
  }))._id
  return ret(model, 0, '记录成功')
}
const summaryData = async (params, context, logger) => {
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
  childList,
  childDelete,
  record,
  recordList,
  summaryData,
  subscribe
}