var userDao = require('../../dao/userDao')
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
    addAddress(req, res, next) {
        let { name, phone, provice, detail } = req.body
        var params = {
            name,
            phone,
            provice,
            detail
        };
        userDao.save(params)
            .then(result => {
                res.json({
                    code: "0",
                    msg: "新建成功",
                    data: result
                });
            })
    }
    allAddress(req, res, next) {
        userDao.find().then(result => {
            res.json({
                code: "0",
                msg: "查询成功",
                data: result
            });
        })
    }
    findAddressByPhone(req, res, next) {
        var phone = req.param('phone')
        userDao.find({ phone: phone }).then(result => {
            res.json({
                code: "0",
                msg: "查询成功",
                data: result
            });
        })
    }
}
module.exports = new User()
