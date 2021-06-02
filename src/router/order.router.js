const Router = require('koa-router')

const orderRouter = new Router()

const {orderList} = require('../controller/order.controller')

// get
// 获取订单列表
orderRouter.get('/orders', orderList)

module.exports = orderRouter