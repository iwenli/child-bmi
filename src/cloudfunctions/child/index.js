const {
    log
} = require('console');
const cloud = require('wx-server-sdk')
const apis = require('./apis')
cloud.init()

const apiList = {
    users: '用户数据（用户&孩子）',
    childDetail: '指定儿童身高体重数据详情',
    addChild: '添加儿童',
    record: '记录数据',

    subscribe: '订阅消息',
    subscribeTimer: '订阅消息定时器',
    summaryData: '设置-统计数据',
}
exports.main = async (event, context) => {
    // return {event,context}
    const logger = cloud.logger()

    try {
        const {
            apiName,
            params
        } = event;

        logger.warn({
            apiName: apiName,
            params: params
        })

        var res = {
            code: 0,
            msg: '',
            result: apiList
        };

        const busName = apiList[apiName]

        if (!!apiName && apiName !== 'mateData') {
            if (apiName in apis) {
                let subRes = await apis[apiName](params, context, logger)
                res = {
                    ...res,
                    ...subRes,
                    ...{
                        busName
                    }
                }
            } else {
                res.code = -1
                res.msg = `不存在业务（${apiName}）`
            }
        }
    } catch (err) {
        logger.error(err)
        let subRes = {
            code: 500,
            msg: err.message,
            result: {}
        }
        res = {
            ...res,
            ...subRes
        }
    }

    return res
};