const errorType = require('../constants/error-types')

const errorHandler = (error, ctx) => {
  let status, message
  switch (error.message) {
    case errorType.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400
      message = `用户名或密码不能为空`
      break;
    case errorType.USER_NOT_EXISTS:
      status = 400
      message = `用户名不存在`
      break;
    case errorType.PASSWORD_IS_INCORRECT:
      status = 400
      message = `密码错误`
      break;
    case errorType.UNAUTHORIZATION:
      status = 401
      message = `无效的token~`
      break 
    default:
      break;
  }
  ctx.body = {
    meta: {
      message,
      status
    }
  }
}

module.exports = errorHandler