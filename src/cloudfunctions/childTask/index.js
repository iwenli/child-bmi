const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database();

exports.main = async (event, context) => {
  const logger = cloud.logger()
  const _ = db.command
  const days = 7 ; // 7天
  const subTime = new Date(new Date() * 1 - days * 24 * 60 * 60 * 1000) 
  const list = await db.collection('c_subscribe').where({
    state: 0,
    subTime: _.gte(subTime)   // > 
  }).get()

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
  list.data.forEach(async (item) => {
    let data = {
      touser: item._openid,
      template_id: item.tempId,
      page: "pages/index/index",
      data: {
        time1: {
          value: todayStr
        },
        thing2: {
          value: "温馨提示"
        },
        thing3: {
          value: "该给宝宝记录身高体重啦，快来记录吧~"
        }
      }
    }
    try {
      const sendRet = await cloud.openapi.subscribeMessage.send(data)
      if (sendRet.errCode === 0) {
        // 发送成功
        db.collection('c_subscribe').doc(item._id).update({
          data: {
            state: 1,
            sendTime: new Date()
          }
        })
      } else {
        logger.warn({
          tag: '发送订阅消息失败',
          _openid: item.openId,
          data: data
        })
      }
    } catch (err) {
      logger.error({
        tag: '发送订阅消息异常',
        _openid: item.openId,
        err: err.toString(),
        data: data
      })
    }
  });
}