var express = require('express');
var router = express.Router();
var indexController = require('../controller/index/index')

/* GET home page. */
router.get('/', indexController.test);

module.exports = router;
