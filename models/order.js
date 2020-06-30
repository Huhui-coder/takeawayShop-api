//order => 订单表。存储用户信息，商品信息，店铺信息，订单状态，创建时间。
var mongoose = require('mongoose')
var orderSchema = new mongoose.Schema({
    user: {
        name: String,
        phone: Number,
        provice: String,
        detail: String
    },
    product: {
        url: String,
        price: Number,
        desc: String,
        name: String,
        status: String
    },
    merchant:{
        merchantName: String,
        merchantDesc: String,
    },
    create_time: Date,
    status: String
})

module.exports = mongoose.model("Order", orderSchema);