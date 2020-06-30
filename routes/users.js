var express = require("express");
var router = express.Router();
var User = require("../models/user");
var jwt = require("jwt-simple"); //引入jwt中间件
var Article = require('../models/article')
var userController = require('../controller/user/index')


const secret = "hit";
require("../util/util");

router.get("/test", userController.test);
// 用户新建地址
router.post("/addAddress", userController.addAddress);

// 返回所有的用户地址
router.get('/', userController.allAddress)
// 根据用户手机号码，返回对应的地址信息
router.get('/findAddressByPhone', userController.findAddressByPhone)

// // 用户校验 中间件
// let auth = function(req, res, next) {
//   //post模拟时 添加Headers Authorization: Bearer token的值
//   let authorization = req.headers["authorization"];
//   if (authorization) {
//     let token = authorization.split(" ")[1];
//     try {
//       //看token是否合法，解码，如果串改过token就解不出来,进入异常页面
//       let user = jwt.decode(token, secret);
//       req.user = user; //后面就可以拿到user，中间件用法
//       next(); //下一步
//     } catch (error) {
//       console.log(error);
//       res.status(401).send("Not Allowed");
//     }
//   } else {
//     res.status(401).send("Not Allowed");
//   }
// };
// // 使用auth 验证
// router.get("/token", auth, function(req, res, next) {
//   res.json({
//     code: 0,
//     data: {
//       user: req.user
//     }
//   });
// });
module.exports = router;
