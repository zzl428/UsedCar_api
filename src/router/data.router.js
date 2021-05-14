const Router = require('koa-router')

const dataRouter = new Router({prefix:'/data'})

const { searchByField } = require('../controller/data.controller')

// post


// get
// 按字段查找，不返回
dataRouter.get('/search', searchByField)
// put


module.exports = dataRouter