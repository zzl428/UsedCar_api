const errorType = require('../constants/error-types')
const sqlService = require('../service/sql.service')
const md5password = require('../utils/passwordHandle')

const verifyLogin = async (ctx, next) => {
  // 获取用户名和密码
  const {username, password} = ctx.request.body.form
  // 判断用户名和密码是否为空
  if(!username || !password) {
    const err = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', err, ctx)
  }
  // 判断用户是否存在
  let result = await sqlService.searchByField(`admin_user`, `username`, username)
  if(!result) {
    const err = new Error(errorType.USER_NOT_EXISTS)
    return ctx.app.emit('error', err, ctx)
  }
  // 判断密码是否和数据库中的一致（加密）
  if(md5password(password) !== result.password) {
    const err = new Error(errorType.PASSWORD_IS_INCORRECT)
    return ctx.app.emit('error', err, ctx)
  }

  ctx.user = result
  await next()
} 

module.exports = {
  verifyLogin
}