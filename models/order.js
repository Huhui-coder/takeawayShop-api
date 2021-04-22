//order => 订单表。存储用户信息，商品信息，店铺信息，订单状态，创建时间。
var mongoose = require('mongoose')
var orderSchema = new mongoose.Schema({
    openid: String,
    merchantId: String,
	isPay: {
	    type: Boolean,
	    default: false
	},
    numbering:String, // 订单编号
	orderidUUID: String, // 支付下单的订单编号
    mealTime: String, // 自取时的 取餐时间
	isScheduled: {
	    type: Boolean,
	    default: false
	},
    userAddressInfo: {
        userName: String,
        provinceName: String,
        cityName: String,
        countyName: String,
        detailInfo: String,
        telNumber: String
    },
    remake: "",
    product: [{
        url: String,
        price: Number,
        desc: String,
        name: String,
        status: String,
        num: Number
    }],
    total: String,
    orderType: String,
    create_time: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'ordered'
    }
})

module.exports = mongoose.model("Order", orderSchema);