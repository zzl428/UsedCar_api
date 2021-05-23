const config = require('../app/config')

class FileController {
  // 上传分类logo图片
  async uploadCateLogo(ctx, next) {
    let {destination, filename} = ctx.req.file
    let temp_path = `${destination}/${filename}`
    let url = `http://${config.APP_HOST}:${config.APP_PORT}/temp/goods/cate/logo/${filename}`
    ctx.body = {
      meta: {
        message: `分类logo上传成功`,
        status: 200
      },
      data: {
        temp_path,
        url
      }
    }
  }

  // 上传商品图片
  async uploadGoodPics(ctx, next) {
    let {destination, filename} = ctx.req.file
    let temp_path = `${destination}/${filename}`
    let url = `http://${config.APP_HOST}:${config.APP_PORT}/temp/goods/pics/${filename}`
    ctx.body = {
      meta: {
        message: `商品图片上传成功`,
        status: 200
      },
      data: {
        temp_path,
        url
      }
    }
  }
}

module.exports = new FileController()