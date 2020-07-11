//order => 订单表。存储用户信息，商品信息，店铺信息，订单状态，创建时间。
var mongoose = require('mongoose')
var orderSchema = new mongoose.Schema({
    openid: String,
    merchantId: String,
    userInfo: {
        userName: String,
        postalCode: Number,
        provinceName: String,
        cityName: String,
        countyName: String,
        detailInfo: String,
        nationalCode: Number,
        telNumber: Number
    },
    remake: "",
    product: [{
        url: String,
        price: Number,
        desc: String,
        name: String,
        status: String
    }],
    create_time: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: 'ordered'
    }
})

module.exports = mongoose.model("Order", orderSchema);