const connection = require('../app/database')
const sqlService = require('./sql.service')

function dateFunc() {
  let date = new Date()
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  m = m < 10 ? `0${m}` : m
  d = d < 10 ? `0${d}` : d
  return `${y}-${m}-${d}`
}

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

  // 分配角色
  async setRole(id ,role_id) {
    let sql = `SELECT role_Id, roleName FROM admin_role WHERE id = ${role_id}`
    let [result] = await connection.query(sql)
    let obj = {
      role: result[0].roleName,
      role_id: result[0].role_Id
    }
    await sqlService.alterTable(`admin_user`, id, obj)
  }

  // 添加访问量
  async addVisit(id) {
    let sql = `insert into admin_visit (user_id) values (${id})`
    connection.query(sql)
  }

  // 获取访问量
  async getVisit() {
    // let date = new Date()
    // let y = date.getFullYear()
    // let m = date.getMonth() + 1
    // let d = date.getDate()
    // m = m < 10 ? `0${m}` : m
    // d = d < 10 ? `0${d}` : d
    // date = `${y}-${m}-${d}`
    // let sql = `SELECT COUNT(*) total
    // FROM admin_visit 
    // WHERE DATE_FORMAT(createAt, '%Y-%m-%d') >= '${date}' AND 
    //       DATE_FORMAT(createAt, '%Y-%m-%d') <= '${date}'`
    // let [result] = await connection.query(sql)
    let sql = `SELECT SUM(order_price) price FROM orders`
    let [money] = await connection.query(sql)
    return {
      // todayVisit: result[0].total,
      money: money[0].price
    }
  }

  // 获取每周访问量
  async weekVisit(arr) {
    let sql = ``
    let visits = []
    for(let i in arr) {
      sql = `SELECT COUNT(*) total
            FROM admin_visit 
            WHERE DATE_FORMAT(createAt, '%Y-%m-%d') >= '${arr[i]}' AND 
                  DATE_FORMAT(createAt, '%Y-%m-%d') <= '${arr[i]}'`
      let [result] = await connection.query(sql)

      visits.push(result[0].total)
    }
    return visits
  }

  // 监控表操作
  async spyTable(table, id, op) {
    let sql = ``
    if(op === 'add') {
      sql = `INSERT INTO ${table} (user_id, operate) VALUES (${id}, '${op}')`
    } else if(op === 'edit') {
      sql = `INSERT INTO ${table} (user_id, operate) VALUES (${id}, '${op}')`
    } else if(op === 'delete') {
      sql = `INSERT INTO ${table} (user_id, operate) VALUES (${id}, '${op}')`
    }
    connection.query(sql)
  }

  // 获取管理员工作量
  async adminWork(table) {
    let date = dateFunc()
    let sql = `SELECT COUNT(*) addTotal
              FROM ${table} 
              WHERE operate = 'add' AND 
                    DATE_FORMAT(createAt, '%Y-%m-%d') >= '${date}' AND 
                    DATE_FORMAT(createAt, '%Y-%m-%d') <= '${date}'`
    let [result1] = await connection.query(sql)
    sql = `SELECT COUNT(*) editTotal
          FROM ${table} 
          WHERE operate = 'edit' AND 
                DATE_FORMAT(createAt, '%Y-%m-%d') >= '${date}' AND 
                DATE_FORMAT(createAt, '%Y-%m-%d') <= '${date}'`
    let [result2] = await connection.query(sql)
    sql = `SELECT COUNT(*) deleteTotal
          FROM ${table} 
          WHERE operate = 'delete' AND 
                DATE_FORMAT(createAt, '%Y-%m-%d') >= '${date}' AND 
                DATE_FORMAT(createAt, '%Y-%m-%d') <= '${date}'`
    let [result3] = await connection.query(sql)
    return {
      addTotal: result1[0].addTotal,
      editTotal: result2[0].editTotal,
      deleteTotal: result3[0].deleteTotal
    }
  }
}

module.exports = new UserService()