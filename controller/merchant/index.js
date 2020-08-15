var userDao = require('../../dao/userDao')
var orderDao = require('../../dao/orderDao')
var merchantDao = require('../../dao/merchantDao');
var jwt = require("jwt-simple"); //引入jwt中间件

const secret = 'hit'
class Merchant {
    login(req, res, next) {
        // 首先获取 merchantName 查看数据库中有没有，没有就加上，并且返回的订单数据为空
        // 首先获取 merchantName 查看数据库中有没有，有就直接返回对应的订单数据
        let params = req.body
        merchantDao.find({ merchantName: params.merchantName }).then(result => {
            if (result.length > 0) {
                if (result[0].merchantPwd === params.merchantPwd) {
                    let data = result[0]
                    let expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
                    let token = jwt.encode(
                        {
                            //编码
                            _id: data._id,
                            exp: expires
                        },
                        secret
                    );
                    res.json({
                        code: 0,
                        msg: "登录成功",
                        data: data,
                        token: token
                    });
                } else {
                    res.json({
                        code: 1,
                        msg: "登录失败，账号或密码不正确",
                        data: {}
                    });
                }
            } else {
                res.json({
                    code: 1,
                    msg: "该账号未注册",
                    data: {}
                });
            }
        })
    }
    putUserInfo(req, res, next) {
        // 首先获取商户_id, 直接在该商户列表下的product put 进去
        let params = req.body
        let _id = req._id
        merchantDao.find({ _id: _id }).then(result => {
            result[0] = Object.assign(result[0], params)
            result[0].save(function () {
                res.json({
                    code: 0,
                    msg: "更新成功",
                    data: result
                })
            })
        })
    }
    getUserInfo(req, res, next) {
        // 首先获取商户_id, 直接在该商户列表下的product put 进去
        let _id = req._id
        merchantDao.find({ _id: _id }).then(result => {
            res.json({
                code: 0,
                msg: "更新成功",
                data: result[0]
            })
        })
    }
    register(req, res, next) {
        // 注册时先查找 merchantName 商户名不能一样
        const params = req.body
        params.product = []
        merchantDao.find({ merchantName: params.merchantName }).then(result => {
            if (result.length === 0) {
                merchantDao.save(params)
                    .then(result => {
                        res.json({
                            code: 0,
                            msg: "注册成功",
                            data: {}
                        });
                    })
            } else {
                res.json({
                    code: 1,
                    msg: "商户名已重复",
                    data: {}
                });
            }
        })
    }

    addProduct(req, res, next) {
        // 首先获取商户_id, 直接在该商户列表下的product put 进去
        let params = req.body
        let _id = req._id
        merchantDao.update({ _id: _id }, { $push: { 'product': params } }).then(result => {
            if (result.nModified !== 0) {
                res.json({
                    code: 0,
                    msg: "添加成功",
                    data: result
                });
            } else {
                res.json({
                    code: 0,
                    msg: "添加失败",
                    data: result
                });
            }

        })
    }
    getAllProduct(req, res, next) {
        let _id = req._id
        let { status } = req.query
        merchantDao.find({ _id: _id }).then(result => {
            var data = result[0]
            if (status) {
                data = data.product.filter((item) => item.status === status)
            }
            if (result.length > 0) {
                console.log(result)
                res.json({
                    code: 0,
                    msg: "查找成功",
                    data: data
                });
            } else {
                res.json({
                    code: 1,
                    msg: "查找失败",
                    data: data
                });
            }
        })
    }
    getSingalProduct(req, res, next) {
        let { p_id } = req.query
        let _id = req._id
        merchantDao.find({ _id: _id }).then(result => {
            if (result.length > 0) {
                let data = result[0].product
                let pData = data.map((item) => item._id === p_id)
                res.json({
                    code: 0,
                    msg: "查找成功",
                    data: pData
                });
            } else {
                res.json({
                    code: 1,
                    msg: "查找失败",
                    data: pData
                });
            }
        })
    }
    putStatusProduct(req, res, next) {
        // 首先获取商户_id, 直接在该商户列表下的product put 进去
        let params = req.body
        let { p_id, status } = params
        let _id = req._id
        delete params.p_id
        merchantDao.find({ _id: _id }).then(result => {
            result[0].product.map((item) => {
                if (item._id == p_id) {
                    item.status = status
                }
            })
            result[0].save(function () {
                res.json({
                    code: 0,
                    msg: "更新状态成功",
                    data: result
                })
            })
        })
    }

    delProduct(req, res, next) {
        let params = req.body
        let _id = req._id
        merchantDao.update({ _id: _id }, { $pull: { 'product': { _id: params.p_id } } }).then(result => {
            res.json({
                code: 0,
                msg: "删除成功",
                data: result
            });
        })
    }

    putProduct(req, res, next) {
        // 首先获取商户_id, 直接在该商户列表下的product put 进去
        let params = req.body
        let _id = req._id
        let p_id = params.p_id
        delete params.p_id
        merchantDao.find({ _id: _id }).then(result => {
            result[0].product.map((item) => {
                if (item._id == p_id) {
                    item = Object.assign(item, params.form)
                }
            })
            result[0].save(function () {
                res.json({
                    code: 0,
                    msg: "更新成功",
                    data: result
                })
            })
        })
    }

    allOrder(req, res, next) {
        // 需要一个参数，商户id
        let _id = req._id
        let { status = '', orderType = '', startTime = '', endTime = '', pageSize = 10, pageIndex = 1 } = req.query
        pageSize = Number(pageSize)
        let skip = (pageIndex - 1) * pageSize
        let query = {
            merchantId: _id
        }
        if(status) query.status = status
        if(startTime && endTime) query.create_time = {
            "$gte": new Date(startTime)
            , "$lt": new Date(endTime)
        }
        if(orderType) query.orderType = orderType
        orderDao.find(query, null, { sort: { '_id': -1 }, limit: pageSize, skip: skip }).then(([doc,count]) => {
            console.log(doc)
            let data = doc
            if (doc.length > 0) {
                res.json({
                    code: 0,
                    msg: "查询成功",
                    data: data,
                    meta: { count: count }
                })
            }else {
                res.json({
                    code: 0,
                    msg: "查询失败",
                    data: [],
                    meta: { count: 0 }
                })
            }
        })
    }

    order(req, res, next) {
        // 需要一个参数，订单 o_id
        const { o_id } = req.query
        orderDao.find({ _id: o_id }).then(result => {
            if (result.length > 0) {
                res.json({
                    code: 0,
                    msg: "查询成功",
                    data: result
                })
            }
        })
    }

    putOrder(req, res, next) {
        const { o_id, status } = req.body
        console.log(req.body)
        orderDao.update({ _id: o_id }, { $set: { 'status': status } }).then(result => {
            res.json({
                code: 0,
                msg: "更改订单状态成功",
                data: result
            });
        })
    }
    // // 用户校验 中间件
    auth(req, res, next) {
        //post模拟时 添加Headers Authorization: Bearer token的值
        let authorization = req.headers["authorization"];
        if (authorization) {
            let token = authorization.split(" ")[1];
            try {
                //看token是否合法，解码，如果串改过token就解不出来,进入异常页面
                let data = jwt.decode(token, secret);
                req._id = data._id; //后面就可以拿到user，中间件用法
                next(); //下一步
            } catch (error) {
                console.log(error);
                res.status(401).send("Not Allowed");
            }
        } else {
            res.status(401).send("Not Allowed");
        }
    }
    testToken(req, res, next) {
        // 直接通过req._id 就能获取到商户的id了
        res.json({
            code: 0,
            data: {
                _id: req._id
            }
        });
    }
    // // 使用auth 验证
    //   router.get("/token", auth, function(req, res, next) {
    //     res.json({
    //       code: 0,
    //       data: {
    //         user: req.user
    //       }
    //     });
    //   });
}
module.exports = new Merchant()
