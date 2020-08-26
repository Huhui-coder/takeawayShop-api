var userDao = require('../../dao/userDao')
var orderDao = require('../../dao/orderDao')
var merchantDao = require('../../dao/merchantDao');
var axios = require('axios')
var md5 = require('md5');
var qs = require('qs')
var dayjs = require('dayjs')

let numbering = 0000;

const fn1 = function (num, length) {
    return (num / Math.pow(10, length)).toFixed(length).substr(2);
}
const getPrintStatus = function () {
    return new Promise((resolve, reject) => {
        const url = 'http://api.poscom.cn/apisc/getStatus'
        const header = {
            'content-type': 'application/x-www-form-urlencoded'
        }
        const apiKey = 'ZRUIKMCB'
        const memberCode = 'bc019b2262cd46f1a832962325caec8f'
        const reqTime = String(new Date().getTime())
        const deviceID = '00391282551210176'
        const securityCode = md5(memberCode + reqTime + apiKey)
        let params = {
            reqTime,
            securityCode,
            memberCode,
            deviceID
        }
        params = qs.stringify(params)
        axios.post(url, params, { headers: header })
            .then(function (response) {
                console.log(response.data);
                let { online, status } = response.data.statusList[0]
                let result = false
                if (online === 1 && status === 1) {
                    result = true
                }
                console.log(result)
                resolve(result)
            })
            .catch(function (error) {
                reject(error)
                console.log(error);
            })
    })
}

const sendPrint = function (data) {
    return new Promise((resolve, reject) => {
        console.log('sendPrintdata', data)
        const url = 'http://api.poscom.cn/apisc/sendMsg'
        const header = {
            'content-type': 'application/x-www-form-urlencoded'
        }
        const apiKey = 'ZRUIKMCB'
        const memberCode = 'bc019b2262cd46f1a832962325caec8f'
        const reqTime = String(new Date().getTime())
        const deviceID = '00391282551210176'
        const mode = '2'
        // const msgNo = data._id//订单编号
        // const msgNo = '10109090909'//订单编号
        // console.log('msgNo', msgNo)
        let orderTypeMapper = {
            takeAway: "外送",
            selfTake: "自提",
            dine: "堂食",
        }
        let orderType = orderTypeMapper[data.orderType]
        let productInfo = function () {
            return data.product.map((item) => 
                `<gpTR3 Type=0><td>${item.name}</td><td>${item.num}</td><td>${item.price}</td></gpTR3>`
            )
        }
        let createTime = dayjs(data.create_time).format('YYYY-MM-DD hh:mm:ss')
        let mealTime = dayjs(data.mealTime).format('YYYY-MM-DD hh:mm:ss')
        const msgDetail = `<gpWord Align=1 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=1>贝克汉堡</gpWord>
        <gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>订单号：${data.numbering}</gpWord>
        <gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>点餐类型:${orderType}</gpWord>
        <gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>顾客信息：${data.userAddressInfo.userName}-${data.userAddressInfo.telNumber}</gpWord>
        <gpWord Align=0 Bold=1 Wsize=0 Hsize=0 Reverse=0 Underline=0>送餐地址：${data.userAddressInfo.provinceName}- ${data.userAddressInfo.cityName}-${data.userAddressInfo.countyName}-${data.userAddressInfo.detailInfo}</gpWord>
        ${productInfo().join('\n')}
        <gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>总价：${data.total}</gpWord>
        <gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>备注: ${data.remake}</gpWord>
        <gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>下单时间：${createTime}</gpWord>
        <gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>送达时间：${mealTime}</gpWord>
        <gpWord Align=1 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>祝您用餐愉快</gpWord>
        <gpCut/>
        `
        const securityCode = md5(memberCode + deviceID + reqTime + apiKey)
        let params = {
            reqTime,
            securityCode,
            memberCode,
            deviceID,
            mode,
            // msgNo,
            msgDetail
        }
        params = qs.stringify(params)
        axios.post(url, params, { headers: header })
            .then(function (response) {
                console.log('sendPrint', response);
                console.log('sendPrintparams', params);
                let result = false
                if (response.data.code === 0) result = true
                resolve(result)
            })
            .catch(function (error) {
                reject(error)
                console.log(error);
            })
    })
}

const queryPrintStatus = function (data) {
    return new Promise((resolve, reject) => {
        console.log('data', data)
        const url = 'http://api.poscom.cn/apisc/queryState'
        const apiKey = 'ZRUIKMCB'
        const memberCode = 'bc019b2262cd46f1a832962325caec8f'
        const reqTime = String(new Date().getTime())
        const msgNo = data.msgNo//订单编号
        const securityCode = md5(memberCode + reqTime + apiKey + msgNo)
        let params = {
            reqTime,
            securityCode,
            memberCode,
            msgNo
        }
        axios.get(url, { params })
            .then(function (response) {
                resolve(response.data.code)
            })
            .catch(function (error) {
                reject(error)
                console.log(error);
            })
    })
}
class User {
    fn1(num, length) {
        return (num / Math.pow(10, length)).toFixed(length).substr(2);
    }

    async testPrint() {
        let data = {
            msgNo: '010101011',
            msgDetail: '打印测试'
        }
        let re = await sendPrint(data)
        console.log(re)
    }

    test(req, res, next) {
        res.json({
            code: 0,
            data: {
                name: "hit"
            },
            msg: "成功返回"
        });
    }
    login(req, res, next) {
        // 首先获取 openid 查看数据库中有没有，没有就加上，并且返回的订单数据为空
        // 首先获取 openid 查看数据库中有没有，有就直接返回对应的订单数据
        let { openid, session_key, merchantId } = req.body
        var params = {
            openid,
            session_key
        };
        userDao.find({ openid: openid }).then(result => {
            console.log(result)
            if (result.length === 0) {
                userDao.save(params)
                    .then(result => {
                        req._id = merchantId
                        next()
                        // res.json({
                        //     code: 0,
                        //     msg: "登录成功",
                        //     data: {}
                        // });
                    })
            } else {
                orderDao.find({ openid: openid }).then(result => {
                    req._id = merchantId
                    next()
                    // res.json({
                    //     code: 0,
                    //     msg: "查询成功",
                    //     data: result
                    // });
                })
            }
        })
    }
    async order(req, res, next) {
        // 获取用户的openid, 获取订单数据,用户下单
        // 需要的参数 openid merchantId product, 地址，手机号等信息
        const params = req.body
        params.numbering = fn1(numbering + 1, 4)
        numbering += 1
        orderDao.save(params)
            .then(async result => {
                //首先获取打印机状态
                let re = await getPrintStatus()
                console.log('getPrintStatusre', re)
                if (re) {
                    let re1 = await sendPrint(result)
                    console.log(re1)
                    // let re2 = await queryPrintStatus()
                }
                res.json({
                    code: 0,
                    msg: "下单成功",
                    data: result
                });
            })
    }
    getOrder(req, res, next) {
        // 需要的参数 _id
        const { _id } = req.query
        orderDao.find({ _id: _id }).then(([doc, count]) => {
            merchantDao.find({ _id: doc[0].merchantId }).then(merchantInfo => {
                res.json({
                    code: 0,
                    msg: "查询成功",
                    data: doc[0],
                    merchantInfo: merchantInfo[0]
                });
            })
        })
    }
    getAllOrder(req, res, next) {
        // 需要的参数 o_id
        const { openid } = req.query
        orderDao.find({ openid: openid }).then(([doc, count]) => {
            res.json({
                code: 0,
                msg: "查询成功",
                data: doc,
                meta: { count }
            });
        })
    }
}
module.exports = new User()
