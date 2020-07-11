var userDao = require('../../dao/userDao')
var orderDao = require('../../dao/orderDao')
var merchantDao = require('../../dao/merchantDao');

class Merchant {
    login(req, res, next) {
        // 首先获取 merchantName 查看数据库中有没有，没有就加上，并且返回的订单数据为空
        // 首先获取 merchantName 查看数据库中有没有，有就直接返回对应的订单数据
        let params = req.body
        merchantDao.find({ merchantName: params.merchantName }).then(result => {
            if (result[0].merchantPwd === params.merchantPwd) {
                let data = result[0]
                res.json({
                    code: 0,
                    msg: "登录成功",
                    data: data
                });
            } else {
                res.json({
                    code: 1,
                    msg: "登录失败，账号或密码不正确",
                    data: {}
                });
            }
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
        let _id = params._id
        console.log(params)
        delete params._id
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
        let { _id } = req.query
        merchantDao.find({ _id: _id }).then(result => {
            if (result.length > 0) {
                let data = result[0].product
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
        let { _id, p_id } = req.query
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
        let { _id, p_id, status } = params
        delete params._id
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
        merchantDao.update({ _id: params._id }, { $pull: { 'product': { _id: params.p_id } } }).then(result => {
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
        let _id = params._id
        let p_id = params.p_id
        delete params._id
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
        const { _id } = req.query
        orderDao.find({ merchantId: _id }).then(result => {
            if (result.length > 0) {
                res.json({
                    code: 0,
                    msg: "查询成功",
                    data: result
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
}
module.exports = new Merchant()
