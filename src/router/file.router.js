const Router = require('koa-router')

const uploadRouter = new Router({prefix:'/upload'})
const {verifyAuth} = require('../middleware/user.middleware')
const {uploadCateLogo, uploadGoodPics} = require('../controller/file.controller')
const {catelogoHandler, goodsPicsHandler} = require('../middleware/file.middleware')

// post
// 分类logo图片上传
uploadRouter.post('/cate/logo', verifyAuth, catelogoHandler, uploadCateLogo)
// 商品图片上传
uploadRouter.post('/goods/pics', verifyAuth, goodsPicsHandler, uploadGoodPics)
module.exports = uploadRouter