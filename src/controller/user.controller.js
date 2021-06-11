const jwt = require('jsonwebtoken')
const {PRIVATE_KEY} = require('../app/config')
const sqlService = require('../service/sql.service')

const userService = require('../service/user.service')

class UserController {
  // 登录
  async login(ctx, next) {
    const {id, username, role} = ctx.user
    const token = jwt.sign({id, username}, PRIVATE_KEY, {
      expiresIn:60 * 60 *24,
      algorithm:`RS256` 
    })
    userService.addVisit(id)
    ctx.body = {
      meta: {
        message: '登陆成功',
        status: 200
      },
      data: {
        id,
        username,
        role,
        token
      }
    }
  }

  // 获取菜单栏数据
  async getAdminMenus(ctx, next) {
    const result = await userService.getAdminMenus()
    ctx.body = {
      meta: {
        message: '获取菜单栏数据成功',
        status: 200
      },
      data: {
        result
      }
    }
  }

  // 获取用户数据列表
  async getUserList(ctx, next) {
    const {queryInfo} = ctx.query
    const {result, total} = await userService.getUserList(JSON.parse(queryInfo))
    ctx.body = {
      meta: {
        message: '获取用户数据列表成功',
        status: 200
      },
      data: {
        result,
        total
      }
    }
  }

  // 更改用户状态
  async alterState(ctx, next) {
    const {id, state} = ctx.params
    const result = await userService.alterUser(id, {state})
    ctx.body = {
      meta: {
        message: '更新用户状态成功',
        status: 200
      },
    }
  } 

  // 添加管理员
  async addUser(ctx, next) {
    const {form} = ctx.request.body
    const result = await userService.addUser(form).catch(err => err)
    userService.spyTable(`spy_admin_user`, ctx.user.id, `add`)
    ctx.body = {
      meta: {
        message: `添加管理员成功`,
        status: 200
      },
      data: {
        result
      }
    }
  }

  // 按id搜索用户
  async getUser(ctx, next) {
    const {id} = ctx.params
    let frag = `username, email, mobile`
    let result = await sqlService.searchByField(`admin_user`, `id`, id, frag).catch(err => err)
    ctx.body = {
      meta: {
        message: `获取管理员信息成功`,
        status: 200
      },
      data: {
        result
      }
    }
  }

  // 更改用户信息
  async alterUser(ctx, next) {
    const {id} = ctx.params
    const {form} = ctx.request.body
    await userService.alterUser(id, form).catch(err => err)
    userService.spyTable(`spy_admin_user`, ctx.user.id, `edit`)
    ctx.body = {
      meta: {
        message: '更新用户信息成功',
        status: 200
      },
    }
  }

  // 删除用户
  async deleteUser(ctx, next) {
    const {id} = ctx.params
    await sqlService.deleteByField(`admin_user`, `id`, id).catch(err => err)
    userService.spyTable(`spy_admin_user`, ctx.user.id, `delete`)
    ctx.body = {
      meta: {
        message: '删除用户信息成功',
        status: 200
      },
    }
  }

  // 分配用户角色
  async setRole(ctx, next) {
    const {id, roleId} = ctx.params
    let result = await userService.setRole(id ,roleId)
    userService.spyTable(`spy_admin_user`, ctx.user.id, `edit`)
    ctx.body = {
      meta: {
        message: '分配用户角色成功',
        status: 200
      },
    }
  }

  // 获取访问量
  async getVisit(ctx, next) {
    let totalVisit = await sqlService.tableLength(`admin_visit`)
    let totalCar = await sqlService.tableLength(`cars`)
    let result = await userService.getVisit()
    ctx.body = {
      meta: {
        message: '获取欢迎页数据成功',
        status: 200
      },
      data: {
        result,
        totalCar,
        totalVisit
      }
    }
  }

  // 获取每周访问量
  async weekVisit(ctx, next) {
    const dateOfToday = Date.now()
    const dayOfToday = (new Date().getDay() + 7 - 1) % 7
    const daysOfThisWeek = Array.from(new Array(7))
      .map((_, i) => {
        const date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
        return date.getFullYear() +
          '-' +
          String(date.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(date.getDate()).padStart(2, '0')
      })
    let result = await userService.weekVisit(daysOfThisWeek)
    ctx.body = {
      meta: {
        message: '获取欢迎页数据成功',
        status: 200
      },
      data: {
        result
      }
    }
  }

  // 获取管理员工作量
  async adminWork(ctx, next) {
    let result = await userService.adminWork(`spy_admin_user`)
    ctx.body = {
      meta: {
        message: '获取欢迎页数据成功',
        status: 200
      },
      data: {
        result
      }
    }
  }

  // 获取角色工作量
  async roleWork(ctx, next) {
    let result = await userService.adminWork(`spy_admin_role`)
    ctx.body = {
      meta: {
        message: '获取欢迎页数据成功',
        status: 200
      },
      data: {
        result
      }
    }
  }

  // 获取商品工作量
  async goodWork(ctx, next) {
    let result = await userService.adminWork(`spy_admin_good`)
    ctx.body = {
      meta: {
        message: '获取商品工作量成功',
        status: 200
      },
      data: {
        result
      }
    }
  }

  // 获取用户操作数据
  async opList(ctx, next) {
    const {id} = ctx.params
    let result = await userService.opList(id)
    ctx.body = {
      meta: {
        message: '获取用户操作列表成功',
        status: 200
      },
      data: {
        result
      }
    }
  }
}

module.exports = new UserController()