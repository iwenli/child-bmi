const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database();

exports.main = async (event, context) => {
  const logger = cloud.logger()
  const _ = db.command
  const subTime = new Date(new Date() * 1 + 7 * 24 * 60 * 60 * 1000) // 7天
  const list = await db.collection('c_subscribe').where({
    state: 0,
    subTime: _.lte(subTime)
  }).get()

  list.data.forEach(async (item) => {
    let data = {
      "touser": item.openId,
      "template_id": "WgfQr0MqXhAxJ7WCOg3yeRSxDnp5QXaMkignXOsa5FY",
      "page": "pages/index/index",
      "data": {
        "time1": {
          "value": new Date()
        },
        "thing2": {
          "value": "身高体重记录"
        },
        "thing3": {
          "value": "您已超过7天未给宝宝记录身高体重啦，快来记录吧~"
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
          openId: item.openId,
          data: data
        })
      }
    } catch (err) {
      logger.error({
        tag: '发送订阅消息异常',
        openId: item.openId,
        err: err.toString(),
        data: data
      })
    }
  });
}