var userDao = require('../../dao/userDao')
var orderDao = require('../../dao/orderDao')
var merchantDao = require('../../dao/merchantDao');
var axios = require('axios')
var md5 = require('md5');
var qs = require('qs')
var dayjs = require('dayjs')
var nodemailer = require('nodemailer');
const schedule = require('node-schedule');


var mailTransport = nodemailer.createTransport({
	// host : 'smtp.qq.com',
	// secureConnection: true, // use SSL
	service: 'QQ',
	auth: {
		user: '569263082@qq.com',
		pass: 'plkybmqflfegbfac'
	},
});

// 从数据库里面取 
let numbering = 0000;
let merchantId1 = '5f45edfacc91256a4856ae6f'
let merchantId2 = '5fec9d0d49267b05a48a9e8a'

let scheduleCronstyle1 = () => {
      schedule.scheduleJob('00 00 7 * * *',() => {
        numbering = 0000;
        merchantDao.update({ _id: merchantId1 }, { $set: { 'initNumbering': numbering } }).then(result => {
        })
        merchantDao.update({ _id: merchantId1 }, { $set: { 'status': true } }).then(result => {
        })
      }); 
      schedule.scheduleJob('00 00 18 * * *',() => {
        merchantDao.update({ _id: merchantId1 }, { $set: { 'status': false } }).then(result => {
        })
      });
}

let scheduleCronstyle2 = () => {
      schedule.scheduleJob('00 00 7 * * *',() => {
        numbering = 0000;
        merchantDao.update({ _id: merchantId2 }, { $set: { 'initNumbering': numbering } }).then(result => {
        })
        merchantDao.update({ _id: merchantId2 }, { $set: { 'status': false } }).then(result => {
        })
      }); 
      schedule.scheduleJob('00 00 18 * * *',() => {
        merchantDao.update({ _id: merchantId2 }, { $set: { 'status': false } }).then(result => {
        })
      });
}
  
scheduleCronstyle1();
scheduleCronstyle2();

const fn1 = function(num, length) {
	return (num / Math.pow(10, length)).toFixed(length).substr(2);
}
const getPrintStatus = function(id) {
	let mapper = {
		'5fec9d0d49267b05a48a9e8a': '00391282559730800',
		'5f45edfacc91256a4856ae6f': '00391282551210176'
	}
	const deviceID = mapper[id]
	return new Promise((resolve, reject) => {
		const url = 'http://api.poscom.cn/apisc/getStatus'
		const header = {
			'content-type': 'application/x-www-form-urlencoded'
		}
		const apiKey = 'ZRUIKMCB'
		const memberCode = 'bc019b2262cd46f1a832962325caec8f'
		const reqTime = String(new Date().getTime())
		const securityCode = md5(memberCode + reqTime + apiKey)
		let params = {
			reqTime,
			securityCode,
			memberCode,
			deviceID
		}
		params = qs.stringify(params)
		axios.post(url, params, {
				headers: header
			})
			.then(function(response) {
				let {
					online,
					status
				} = response.data.statusList[0]
				let result = false
				if (online === 1 && status === 1) {
					result = true
				}
				console.log(result)
				resolve(result)
			})
			.catch(function(error) {
				reject(error)
				console.log(error);
			})
	})
}

const sendPrint = function(data, id) {
	let mapper = {
		'5fec9d0d49267b05a48a9e8a': '00391282559730800',
		'5f45edfacc91256a4856ae6f': '00391282551210176'
	}
	const deviceID = mapper[id]
	return new Promise((resolve, reject) => {
		console.log('sendPrintdata', data)
		const url = 'http://api.poscom.cn/apisc/sendMsg'
		const header = {
			'content-type': 'application/x-www-form-urlencoded'
		}
		const apiKey = 'ZRUIKMCB'
		const memberCode = 'bc019b2262cd46f1a832962325caec8f'
		const reqTime = String(new Date().getTime())
		const mode = '2'
		let orderTypeMapper = {
			takeAway: "外送",
			selfTake: "自提",
			dine: "堂食",
		}
		let Scheduled = ''
		if (data.isScheduled) Scheduled = '预订单'
		let orderType = orderTypeMapper[data.orderType]
		let productInfo = function() {
			return data.product.map((item) =>
				`<gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>${item.name}${item.num}份${item.price}元</gpWord>`
			)
		}
		let createTime = dayjs(data.create_time).format('YYYY-MM-DD hh:mm:ss')
		let mealTime = dayjs(data.mealTime).format('YYYY-MM-DD hh:mm:ss')
		for (let index in data) {
			if (data[index] === undefined || data[index] === '') {
				data[index] = '-'
			}
		}
		if (orderType === '堂食') {
			var msgDetail =
				`
			<gpWord Align=1 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=1>贝克汉堡</gpWord>
			<gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>订单号：${data.numbering}</gpWord>
			<gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>${Scheduled}</gpWord>
			<gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>点餐类型:${orderType}</gpWord>${productInfo().join('')}
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>总价：${data.total}</gpWord>
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>备注: ${data.remake}</gpWord>
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>下单时间：${createTime}</gpWord>
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>送达时间：${mealTime}</gpWord>
			<gpWord Align=1 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>祝您用餐愉快</gpWord>
			<gpCut/>
			`
		} else if (orderType === '外送') {
			var msgDetail =
				`
			<gpWord Align=1 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=1>贝克汉堡</gpWord>
			<gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>订单号：${data.numbering}</gpWord>
			<gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>${Scheduled}</gpWord>
			<gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>点餐类型:${orderType}</gpWord>
			<gpWord Align=0 Bold=1 Wsize=0 Hsize=1 Reverse=0 Underline=0>顾客信息：${data.userAddressInfo.userName}-${data.userAddressInfo.telNumber}</gpWord>
			<gpWord Align=0 Bold=1 Wsize=0 Hsize=0 Reverse=0 Underline=0>送餐地址：${data.userAddressInfo.provinceName}- ${data.userAddressInfo.cityName}-${data.userAddressInfo.countyName}-${data.userAddressInfo.detailInfo}</gpWord>${productInfo().join('')}
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>总价：${data.total}</gpWord>
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>备注: ${data.remake}</gpWord>
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>下单时间：${createTime}</gpWord>
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>送达时间：${mealTime}</gpWord>
			<gpWord Align=1 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>祝您用餐愉快</gpWord>
			<gpCut/>
			`
		} else {
			var msgDetail =
				`
			<gpWord Align=1 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=1>贝克汉堡</gpWord>
			<gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>订单号：${data.numbering}</gpWord>
			<gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>${Scheduled}</gpWord>
			<gpWord Align=0 Bold=1 Wsize=1 Hsize=1 Reverse=0 Underline=0>点餐类型:${orderType}</gpWord>
			<gpWord Align=0 Bold=1 Wsize=0 Hsize=1 Reverse=0 Underline=0>顾客信息：${data.userAddressInfo.userName}-${data.userAddressInfo.telNumber}</gpWord>${productInfo().join('')}
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>总价：${data.total}</gpWord>
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>备注: ${data.remake}</gpWord>
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>下单时间：${createTime}</gpWord>
			<gpWord Align=0 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>送达时间：${mealTime}</gpWord>
			<gpWord Align=1 Bold=0 Wsize=0 Hsize=0 Reverse=0 Underline=0>祝您用餐愉快</gpWord>
			<gpCut/>
			`
		}
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
		axios.post(url, params, {
				headers: header
			})
			.then(function(response) {
				console.log('sendPrint', response);
				console.log('sendPrintparams', params);
				let result = false
				if (response.data.code === 0) result = true
				resolve(result)
			})
			.catch(function(error) {
				reject(error)
				console.log(error);
			})
	})
}

const addredd2ip = function(addressInfo) {
	return new Promise((resolve, reject) => {
		const url = 'https://restapi.amap.com/v3/geocode/geo'
		const key = '626962ea9c09842d5151c523ba129ed6'
		console.log('address', addressInfo)
		const address = addressInfo
		let params = {
			address,
			key,
		}
		axios.get(url, {
				params
			})
			.then(function(response) {
				console.log('response', response)
				const result = response.data.geocodes[0].location
				resolve(result)
			})
			.catch(function(error) {
				reject(error)
				console.log(error);
			})
	})
}
const ip2distance = function(destination, origins) {
	return new Promise((resolve, reject) => {
		const url = 'https://restapi.amap.com/v3/distance'
		const key = '626962ea9c09842d5151c523ba129ed6'
		let params = {
			destination,
			origins,
			key
		}
		axios.get(url, {
				params
			})
			.then(function(response) {
				console.log('response', response)
				const result = response.data.results[0].distance
				resolve(result)
			})
			.catch(function(error) {
				reject(error)
				console.log(error);
			})
	})
}

const queryPrintStatus = function(data) {
	return new Promise((resolve, reject) => {
		console.log('data', data)
		const url = 'http://api.poscom.cn/apisc/queryState'
		const apiKey = 'ZRUIKMCB'
		const memberCode = 'bc019b2262cd46f1a832962325caec8f'
		const reqTime = String(new Date().getTime())
		const msgNo = data.msgNo //订单编号
		const securityCode = md5(memberCode + reqTime + apiKey + msgNo)
		let params = {
			reqTime,
			securityCode,
			memberCode,
			msgNo
		}
		axios.get(url, {
				params
			})
			.then(function(response) {
				resolve(response.data.code)
			})
			.catch(function(error) {
				reject(error)
				console.log(error);
			})
	})
}
class User {
	fn1(num, length) {
		return (num / Math.pow(10, length)).toFixed(length).substr(2);
	}
	async geocoding(req, res, next) {
		const {
			userAddress,
			merchantAddress
		} = req.query
		console.log(userAddress)
		console.log(merchantAddress)
		let userAddressIp = await addredd2ip(userAddress)
		let merchantAddressIp = await addredd2ip(merchantAddress)
		console.log(userAddressIp, merchantAddressIp)
		let result = await ip2distance(userAddressIp, merchantAddressIp)

		res.json({
			code: 0,
			data: result,
			msg: "成功返回"
		});
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
	preLogin(req, res, next) {
		let {
			appid,
			grant_type,
			js_code
		} = req.body
		let secret = '7f63060321ac91eeed447f506ad1823d'
		// 再请求微信的接口
		let url = "https://api.weixin.qq.com/sns/jscode2session"
		const header = {
			'content-type': 'application/json'
		}
		const params = {
			appid,
			grant_type,
			js_code,
			secret
		}
		axios.get(url, {
				params
			}, {
				headers: header
			})
			.then(function(response) {
				console.log('response.data', response.data)
				res.json({
					code: 0,
					msg: "查询成功",
					data: response.data
				});
			})
			.catch(function(error) {
				console.log(error);
			})
	}
	login(req, res, next) {
		// 首先获取 openid 查看数据库中有没有，没有就加上，并且返回的订单数据为空
		// 首先获取 openid 查看数据库中有没有，有就直接返回对应的订单数据
		let {
			openid,
			session_key,
			merchantId
		} = req.body
		var params = {
			openid,
			session_key
		};
		userDao.find({
			openid: openid
		}).then(result => {
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
				orderDao.find({
					openid: openid
				}).then(result => {
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
		console.log('Orderparams', params)
		const merchantId = params.merchantId
	    orderDao.find({
	        orderidUUID: params.orderidUUID
	    }).then(([result, count]) => {
			console.log('result', result)
	        if (result.length === 0) {
	            params.numbering = fn1(numbering + 1, 4)
	            numbering += 1
	            orderDao.save(params)
	                .then(async result => {
	                    //首先获取打印机状态
	                    let re = await getPrintStatus(merchantId)
	                    console.log('getPrintStatusre', re)
	                    if (re) {
	                        let re1 = await sendPrint(result, merchantId)
	                        console.log(re1)
	                        // let re2 = await queryPrintStatus()
	                        // }
	                    } else {
	                        console.log('发送邮件')
	                        var options = {
	                            from: '"Hit" <569263082@qq.com>',
	                            to: '"李青" <395777361@qq.com>',
	                            subject: '你的打印机出现问题，导致打印失败，请检查。查看订单，请前往手机APP刷新查看',
	                            text: '你的打印机出现问题，导致打印失败，请检查。查看订单，请前往手机APP刷新查看',
	                            html: '<p>你的打印机出现问题，导致打印失败，请检查。查看订单，请前往手机APP刷新查看</p>'
	                        };
	
	                        mailTransport.sendMail(options, function (err, msg) {
	                            if (err) {
	                                console.log(err);
	                            }
	                            else {
	                                console.log(msg);
	                            }
	                        });
	                    }
	                    res.json({
	                        code: 0,
	                        msg: "下单成功",
	                        data: result
	                    });
	                })
	        } else {
	            res.json({
	                code: 0,
	                msg: "原来就有订单，不做处理",
	                data: result
	            });
	        }
	    })
	}
	getSingalOrder(req, res, next) {
		// 需要的参数 orderidUUID
		const {
			orderidUUID
		} = req.query
		orderDao.find({
			orderidUUID: orderidUUID
		}).then(([doc, count]) => {
			res.json({
				code: 0,
				msg: "查询成功",
				data: doc,
				meta: {
					count
				}
			});
		})
	}
	getOrder(req, res, next) {
		// 需要的参数 _id
		const {
			_id
		} = req.query
		orderDao.find({
			_id: _id
		}).then(([doc, count]) => {
			merchantDao.find({
				_id: doc[0].merchantId
			}).then(merchantInfo => {
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
		const {
			openid
		} = req.query
		orderDao.find({
			openid: openid
		}).then(([doc, count]) => {
			res.json({
				code: 0,
				msg: "查询成功",
				data: doc,
				meta: {
					count
				}
			});
		})
	}
}
module.exports = new User()
