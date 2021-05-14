const connection = require('../app/database')
const sqlService = require('./sql.service')

class UserService {
  // 获取菜单栏数据
  async getAdminMenus() {
    let sql = `SELECT * FROM admin_menus WHERE pid = 0`
    let [result] = await connection.query(sql)
    for(let i of result) {
      sql = `SELECT * FROM admin_menus WHERE pid = ${i.id}`
      let [secResult] = await connection.query(sql)
      if(secResult.length !== 0) {
        i.children = secResult
      }
    }
    return result
  }

  // 获取用户数据列表
  async getUserList(queryInfo) {
    let {query, pagenum, pagesize} = queryInfo
    let sql = `id, username, role, role_id, state, email, mobile`
    if(query) {
      let midresult = await sqlService.searchByField(`admin_user`, `username`, query, sql)
      let result = [midresult]
      return {
        result,
        total: 1
      }
    } else {
      let result = await sqlService.dataList(pagenum, pagesize, 'admin_user', sql)
      let total = await sqlService.tableLength(`admin_user`)
      return {
        result,
        total
      }
    }
  }
  
  // 更改用户状态
  async alterUser(id, obj) {
    let result = await sqlService.alterTable('admin_user', id, obj).catch(err => err)
    return
  }

  // 添加管理员
  async addUser(form) {
    let {username, password, email, mobile} = form
    let sql = `INSERT INTO admin_user (username, password, state, email, mobile) VALUES (?, ?, 1, ?, ?)`
    let [result] = await connection.execute(sql, [username, password,  email, mobile]).catch(err => err)
    return result
  }
}

module.exports = new UserService()