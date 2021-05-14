const connection = require('../app/database')

class SqlService {
  // 按字段查找数据
  async searchByField(table, field, value, content) {
    let frag = content || '*'
    let sql = `SELECT ${frag} FROM ${table} WHERE ${field} = '${value}'` 
    let [result] = await connection.query(sql)
    return result[0]
  }

  // 批量获取表数据(有限制)
  async dataList(pagenum, pagesize, table, content) {
    let offset = (pagenum - 1) * pagesize
    let sqlfrag = content || '*'
    let sql = `SELECT ${sqlfrag} FROM ${table} LIMIT ${offset}, ${pagesize}`
    let [result] = await connection.query(sql)
    return result
  }

  // 获取某张表的长度
  async tableLength(table) {
    let sql = `SELECT COUNT(*) len FROM ${table}`
    let [result] = await connection.query(sql)
    return result[0].len
  }

  // 更改表中某些字段
  async alterTable(table, id, obj) {
    // UPDATE admin_user SET KEY = VALUE WHERE id = ?
    let sql = `UPDATE ${table} set`
    let frag = ``
    let keys = Object.keys(obj)
    keys.forEach(key => {
      frag = frag + ` ${key} = '${obj[key]}',`
    })
    frag = frag.slice(0, -1)
    sql = sql + frag + ` WHERE id = ${id}`
    await connection.query(sql).catch(err => err)
  }

  // 按字段删除表中数据 
  async deleteByField(table, field, value) {
    let sql = `DELETE FROM ${table} WHERE ${field} = ?`
    let [result] = await connection.execute(sql, [value]).catch(err => err)
    return result
  }
}

module.exports = new SqlService()