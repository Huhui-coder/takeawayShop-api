//封装CURD操作
var merchanctModel = require('../models/merchanct');

module.exports = {
	/**
	 * 添加数据
	 * @param  {[type]} data 需要保存的数据对象
	 */
    save(data) {
        return new Promise((resolve, reject) => {
            //model.create(保存的对象,callback)
            merchanctModel.create(data, (error, doc) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    find(data = {}, fields = null, options = {sort: {'_id': -1}}) {
        return new Promise((resolve, reject) => {
            //model.find(需要查找的对象(如果为空，则查找到所有数据), 属性过滤对象[可选参数], options[可选参数], callback)
            merchanctModel.find(data, fields, options, (error, doc) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    findOne(data) {
        return new Promise((resolve, reject) => {
            //model.findOne(需要查找的对象,callback)
            merchanctModel.findOne(data, (error, doc) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    findById(data) {
        return new Promise((resolve, reject) => {
            //model.findById(需要查找的id对象 ,callback)
            merchanctModel.findById(data, (error, doc) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    update(conditions, update) {
        return new Promise((resolve, reject) => {
            //model.update(查询条件,更新对象,callback)
            merchanctModel.updateOne(conditions, update, (error, doc) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    remove(conditions) {
        return new Promise((resolve, reject) => {
            //model.update(查询条件,callback)
            merchanctModel.remove(conditions, (error, doc) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(doc)
                }
            })
        })
    }
}