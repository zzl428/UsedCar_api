const Router = require('koa-router')

const goodsRouter = new Router()

const {showCateLogo, removeTempFile, showFile, showGoodPic, showGoodPics} = require('../controller/goods.controller')
const {verifyAuth} = require('../middleware/user.middleware')

// get
// 访问临时商品分类logo图片
goodsRouter.get('/temp/goods/cate/logo/:logoname', showCateLogo)
// 访问商品分类logo图片
goodsRouter.get('/goods/cate/logo/:filename', showFile)
// 访问临时商品图片
goodsRouter.get('/temp/goods/pics/:picname', showGoodPic)
// 访问商品图片
goodsRouter.get('/uploads/goods/pics/:filename', showGoodPics)

// delete
// 删除临时商品分类Logo图片
goodsRouter.delete('/temp/goods/cate/logo', verifyAuth, removeTempFile)

module.exports = goodsRouter