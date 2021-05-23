const Multer = require('koa-multer')

const catelogoUpload = Multer({
  dest: './uploads/goods/cate/logo'
})
const catelogoHandler = catelogoUpload.single('file')

const goodPicsUpload = Multer({
  dest: './uploads/goods/pics'
})
const goodsPicsHandler = goodPicsUpload.single('file')

module.exports = {
  catelogoHandler,
  goodsPicsHandler
}