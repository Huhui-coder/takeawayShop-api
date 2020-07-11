var userDao = require('../../dao/userDao')
var orderDao = require('../../dao/orderDao')

class User {
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
        let { openid, session_key } = req.body
        var params = {
            openid,
            session_key
        };
        userDao.find({ openid: openid }).then(result => {
            console.log(result)
            if (result.length === 0) {
                userDao.save(params)
                    .then(result => {
                        res.json({
                            code: "0",
                            msg: "登录成功",
                            data: {}
                        });
                    })
            } else {
                orderDao.find({ openid: openid }).then(result => {
                    res.json({
                        code: "0",
                        msg: "查询成功",
                        data: result
                    });
                })
            }
        })
    }
    order(req, res, next) {
        // 获取用户的openid, 获取订单数据,用户下单
        // 需要的参数 openid merchantId product, 地址，手机号等信息
        const params = req.body
        orderDao.save(params)
            .then(result => {
                res.json({
                    code: "0",
                    msg: "下单成功",
                    data: result
                });
            })
    }
    getOrder(req, res, next) {
        // 需要的参数 o_id
        const { o_id } = req.body
        orderDao.find({ o_id: o_id }).then(result => {
            res.json({
                code: "0",
                msg: "查询成功",
                data: result
            });
        })
    }
}
module.exports = new User()
