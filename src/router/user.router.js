const Router = require('koa-router')

const userRouter = new Router()

const {login} = require('../controller/user.controller')
const {verifyLogin} = require('../middleware/user.middleware')

userRouter.post('/login', verifyLogin, login)

module.exports = userRouter