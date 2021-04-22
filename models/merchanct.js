// product => url: 图片上传的url地址， price: 商品的单价， desc: 商品的描述， name: 商品名称， status: 状态：上架，下架。
// 用户侧只展示已上架的商品。

//order => 订单表。存储用户信息，商品信息，订单状态，创建时间。
var mongoose = require('mongoose')
var merchantSchema = new mongoose.Schema({
    merchantName: String,
	initNumbering: {
		type: Number,
		default: 0000
	},
    shopName: String,
    status: Boolean,
    announcement: String,
    merchantPwd: String,
    merchantAddress: String,
    merchantPhone: String,
    merchantDesc: String,
	limitPrice: {
		type: Number,
		default: 0
	},
	limitDistance: {
		type: Number,
		default: 1
	},
    product: [{
        url: String,
        price: Number,
        desc: String,
        name: String,
        status: {
            type: String,
            default: 'normal'
        },
        pType: String, // 该字段表示分类名称
        checked: {
            type: Boolean,
            default: false
        },
        num: {
            type: Number,
            default: 1
        }
    }]
})

module.exports = mongoose.model("Merchant", merchantSchema);