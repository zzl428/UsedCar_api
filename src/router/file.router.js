const Router = require('koa-router')

const uploadRouter = new Router({prefix:'/upload'})
const {verifyAuth} = require('../middleware/user.middleware')
const {uploadCateLogo} = require('../controller/file.controller')
const {catelogoHandler} = require('../middleware/file.middleware')

// post
// 分类logo图片上传
uploadRouter.post('/cate/logo', verifyAuth, catelogoHandler, uploadCateLogo)

module.exports = uploadRouter