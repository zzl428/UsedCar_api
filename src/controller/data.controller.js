const sqlService = require('../service/sql.service')

class DataController {
  // 按字段查找，不返回
  async searchByField(ctx, next) {
    const {table, field, value} = ctx.query
    let meta = {
      message: 'none',
      status: 404
    }
    const result = await sqlService.searchByField(table, field, value)
    if(result) {
      meta.message = 'have'
      meta.status = 200
    }
    ctx.body = {
      meta
    }
  }
}

module.exports = new DataController()