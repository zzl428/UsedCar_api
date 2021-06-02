const jwt = require('jsonwebtoken')
const {PRIVATE_KEY} = require('../app/config')
const frontService = require('../service/front.service')
const sqlService = require('../service/sql.service')
const md5password = require('../utils/passwordHandle')

class FrontController {
  // 注册用户
  async addUser(ctx, next) {
    const {form} = ctx.request.body
    let result = await frontService.addUser(form)
    ctx.body = {
      meta: {
        status: 200,
        message: `添加用户成功`
      }
    }
  }

  // 验证手机号
  async checkPhone(ctx, next) {
    const {phone} = ctx.params
    let result = await sqlService.searchByField(`front_user`, `phone`, phone)
    if(result) {
      ctx.body = {
        meta: {
          status: 409,
          message: `用户已存在`
        }
      }
    } else ctx.body = {
      meta: {
        status: 200,
        message: `可以zhuc`
      }
    }
  }

  // 登录
  async login(ctx, next) {
    const {id, phone} = ctx.user
    const token = jwt.sign({id, phone}, PRIVATE_KEY, {
      expiresIn:60 * 60 *24,
      algorithm:`RS256` 
    })
    ctx.body = {
      meta: {
        message: '登陆成功',
        status: 200
      },
      data: {
        id,
        phone,
        token
      }
    }
  }

  // 获取首页商品数据
  async homeGoodList(ctx, next) {
    const {queryInfo} = ctx.query
    let form = JSON.parse(queryInfo)
    
    let result = await frontService.goodsList(form)
    ctx.body = {
      meta: {
        status: 200,
        message: `获取首页商品列表成功`
      },
      data: {
        result
      }
    }
  }

  // 获取商品详情数据
  async goodsDetail(ctx, next) {
    const {user_id} = ctx.query
    const {id} = ctx.params
    let [result] = await frontService.goodsDetail(id, user_id)
    ctx.body = {
      meta: {
        status: 200,
        message: `获取商品详情成功`
      },
      data: {
        result
      }
    }
  }

  // 添加收藏
  async addCollect(ctx, next) {
    await frontService.addCollect(ctx.user.id, ctx.params.id).catch(err => err)
    ctx.body = {
      meta: {
        status: 200,
        message: `添加收藏成功`
      }
    }
  }

  // 获取收藏数据
  async showCollect(ctx, next) {
    const {id} = ctx.params
    let result = await frontService.showCollect(id)
    ctx.body = {
      meta: {
        status: 200,
        message: `获取收藏数据成功`
      },
      data: {
        result
      }
    }
  }

  // 取消收藏
  async removeCollect(ctx, next) {
    const {id} = ctx.params
    await sqlService.deleteByField(`user_collect`, `id`, id).catch(err => err)
    ctx.body = {
      meta: {
        status: 200,
        message: `取消收藏成功`
      }
    }
  }

  // 生成订单
  async addOrders(ctx, next) {
    const {price} = ctx.query
    const {id} = ctx.params
    let time = Date.parse(new Date())
    let num = `${time}-${ctx.user.id}-${id}`
    num = md5password(num)
    await frontService.addOrders(ctx.user.id, id, num, price).catch(err => err)
    ctx.body = {
      meta: {
        status: 200,
        message: `生成订单成功`
      }
    }
  }

  // 关键字查询
  async searchByKeys(ctx, next) {
    const {keys} = ctx.query
    let result = await frontService.searchByKeys(JSON.parse(keys))
    ctx.body = {
      meta: {
        status: 200,
        message: `取消收藏成功`
      },
      data: {
        result
      }
    }
  }

  // 获取用户列表
  async UserList(ctx, next) {
    const {queryInfo} = ctx.query
    let result = await frontService.userList(JSON.parse(queryInfo))
    ctx.body = {
      meta: {
        status: 200,
        message: `获取用户列表成功`
      },
      data: {
        result
      }
    }
  }

  // 获取订单列表
  async orderList(ctx, next) {
    let result = await frontService.orderList(ctx.user.id)
    ctx.body = {
      meta: {
        status: 200,
        message: `获取订单列表成功`
      },
      data: {
        result
      }
    }
  }

  // 取消订单
  async cancelOrder(ctx, next) {
    const {id} = ctx.params
    await sqlService.deleteByField(`orders`, `id`, id).catch(err => err)
    ctx.body = {
      meta: {
        status: 200,
        message: `取消订单成功`
      }
    }
  }
}

module.exports = new FrontController()