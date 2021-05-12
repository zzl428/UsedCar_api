const connection = require('../app/database')

class SqlService {
  // 按字段查找数据
  async searchByField(table, field, value) {
   let sql = `SELECT * FROM ${table} WHERE ${field} = '${value}'` 
   let [result] = await connection.query(sql)
   return result[0]
  }
}

module.exports = new SqlService()