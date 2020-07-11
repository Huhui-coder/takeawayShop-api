// 用户表只存储，地址表一个信息。
// name: 用户名称， phone: 手机号， provice: 省市区， detail: 详细地址
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    openid: String,
    session_key: String
});

module.exports = mongoose.model("User", userSchema);