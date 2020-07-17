var express = require('express');
var router = express.Router();

var merchantController = require('../controller/merchant/index')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'hit123' });
});

// 商户登录
router.post("/login", merchantController.login);

// 商户注册
router.post("/register", merchantController.register);


// 商户新增商品
router.post("/product", merchantController.auth, merchantController.addProduct);

// 商户查看所有商品
router.get("/allProduct", merchantController.auth, merchantController.getAllProduct);

// 商户查看单个商品
router.get("/product", merchantController.auth, merchantController.getSingalProduct);

// 商户删除商品
router.delete("/product", merchantController.auth, merchantController.delProduct);

// 商户编辑商品
router.put("/product", merchantController.auth, merchantController.putProduct);

// 商户编辑商品状态
router.put("/statusProduct", merchantController.auth, merchantController.putStatusProduct);

// 商户查询所有订单
router.get("/allOrder", merchantController.auth, merchantController.allOrder);

// 商户查询单个订单详情
router.get("/order", merchantController.auth, merchantController.order);

// 商户编辑订单状态
router.put("/order", merchantController.auth, merchantController.putOrder);

router.post("/testToken", merchantController.auth, merchantController.testToken);

module.exports = router;
