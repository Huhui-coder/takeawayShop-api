// product => url: 图片上传的url地址， price: 商品的单价， desc: 商品的描述， name: 商品名称， status: 状态：上架，下架。
// 用户侧只展示已上架的商品。

//order => 订单表。存储用户信息，商品信息，订单状态，创建时间。
var mongoose = require('mongoose')
var merchantSchema = new mongoose.Schema({
    merchantName: String,
    merchantPwd: String,
    merchantAddress: String,
    merchantPhone: String,
    merchantDesc: String,
    product: [{
        url: String,
        price: Number,
        desc: String,
        name: String,
        status: {
            type: String,
            default: 'normal'
        }
    }]
})

module.exports = mongoose.model("Merchant", merchantSchema);