const connection = require('../app/database');
const sqlService = require('./sql.service');

class OrderService {
  async orderList(queryInfo) {
    const {query, pagenum, pagesize} = queryInfo
    if(query) {
      let sql = `SELECT orders.id, title, order_number, order_price, order_pay, orders.createAt, phone, master
                FROM orders
                LEFT JOIN front_user ON orders.user_id = front_user.id
                LEFT JOIN cars ON cars_id = cars.id
                WHERE title LIKE '%${query}%'`
      let [result] = await connection.query(sql)
      let total = result.length
      return {
        result,
        total
      }
    } else {
      let total = await sqlService.tableLength('orders')
      let offset = (pagenum - 1) * pagesize
      let sql = `SELECT orders.id, title, order_number, order_price, order_pay, orders.createAt, phone, master
                FROM orders
                LEFT JOIN front_user ON orders.user_id = front_user.id
                LEFT JOIN cars ON cars_id = cars.id
                LIMIT ${offset}, ${pagesize}`
      let [result] = await connection.query(sql)
      return {
        result,
        total
      }
    }
  }
}

module.exports = new OrderService()