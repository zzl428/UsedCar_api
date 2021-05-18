const Multer = require('koa-multer')

const catelogoUpload = Multer({
  dest: './uploads/goods/cate/logo'
})

const catelogoHandler = catelogoUpload.single('file')

module.exports = {
  catelogoHandler
}