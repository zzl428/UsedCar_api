const jwt = require('jsonwebtoken')
const {PRIVATE_KEY} = require('../app/config')

class UserController {
  // 登录
  async login(ctx, next) {
    const {id, username} = ctx.user
    const token = jwt.sign({id, username}, PRIVATE_KEY, {
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
        username,
        token
      }
    }
  }
}

module.exports = new UserController()