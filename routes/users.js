var express = require("express");
var router = express.Router();
var User = require("../models/user");
var jwt = require("jwt-simple"); //引入jwt中间件
var Article = require('../models/article')
var userController = require('../controller/user/index')
var merchantController = require('../controller/merchant/index')
const secret = 'qwert569263082@!'


require("../util/util");

router.get("/test", userController.test);

// 用户预登录
router.post("/preLogin", userController.preLogin);

//用户登录
router.post("/login", userController.login, merchantController.getAllProduct);

// 用户下单
router.post("/order", userController.order);

// 用户查看订单详情
router.get("/order", userController.getOrder);

// 订单完成后获取订单的信息
router.get("/getSingalOrder", userController.getSingalOrder);

// 用户查询订单列表
router.get("/allOrder", userController.getAllOrder);

// 打印机测试
router.post("/print", userController.testPrint);

// 获取两点间的距离 geocoding
router.get("/geocoding", userController.geocoding);


module.exports = router;
