const jwt = require('jsonwebtoken')
const errorType = require('../constants/error-types')
const sqlService = require('../service/sql.service')
const md5password = require('../utils/passwordHandle')
const { PUBLIC_KEY } = require('../app/config')

// 验证管理员登录
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

// 验证权限
const verifyAuth = async (ctx, next) => {
  // 获取token
  const authorization = ctx.headers.authorization
  if(!authorization) {
    const err = new Error(errorType.UNAUTHORIZATION)
    return ctx.app.emit(`error`,err, ctx)
  }
  const token = authorization.replace(`Bearer `,``)
  // 验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms:[`RS256`]
    })
    ctx.user = result
    await next()
  } catch (error) {
    console.log(error);
    const err = new Error(errorType.UNAUTHORIZATION)
    ctx.app.emit(`error`,err, ctx)
  }
}

const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body.form
  ctx.request.body.form.password = md5password(password)

  await next()
}

const verifyUser = async (ctx,next) => {
  // 获取手机号和密码
  const {phone, password} = ctx.request.body.form
  // 判断手机号或密码是否为空
  if(!phone || !password) {
    const err = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', err, ctx)
  }
  // 判断手机号不重复
  const result = await sqlService.searchByField(`front_user`, `phone`, phone)
  if(result) {
    const err = new Error(errorType.USER_ALREADY_EXISTS)
    return ctx.app.emit('error', err, ctx)
  }
  await next()
}

// 验证用户登录
const verifyUserLogin = async (ctx, next) => {
  // 获取手机号和密码
  const {phone, password} = ctx.request.body.form
  // 判断手机号和密码是否为空
  if(!phone || !password) {
    const err = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', err, ctx)
  }
  // 判断手机号是否存在
  const result = await sqlService.searchByField(`front_user`, `phone`, phone)
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
  verifyLogin,
  verifyAuth,
  handlePassword,
  verifyUserLogin,
  verifyUser
}