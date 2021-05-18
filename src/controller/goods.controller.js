const fs = require('fs')

class GoodsController {
  // 访问临时商品分类logo图片
  async showCateLogo(ctx, next) {
    const {logoname} = ctx.params
    ctx.response.set('content-type', `file`)
    ctx.body = fs.createReadStream(`./uploads/goods/cate/logo/${logoname}`)
  }

  // 访问商品分类logo图片
  async showFile(ctx, next) {
    const {filename} = ctx.params
    ctx.response.set('content-type', `file`)
    ctx.body = fs.createReadStream(`./public/goods/cate/logo/${filename}`)
  }

  // 删除临时商品分类Logo图片
  async removeTempFile(ctx, next) {
    const {path} = ctx.query
    let status = 200
    let message = `临时图片删除成功`
    fs.unlink(path, (err) => {
      if(err) {
        status = 412,
        message = `删除临时图片失败`
      }
    })
    ctx.body = {
      meta: {
        message,
        status
      }
    }
  }
}

module.exports = new GoodsController()