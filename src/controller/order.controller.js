const orderService = require('../service/order.service')

class OrderController {
  // 获取订单列表
  async orderList(ctx, next) {
    const {queryInfo} = ctx.query
    let result = await orderService.orderList(JSON.parse(queryInfo))
    ctx.body = {
      meta: {
        message: `获取订单列表成功`,
        status: 200
      },
      data: {
        result
      }
    }
  }
}

module.exports = new OrderController()