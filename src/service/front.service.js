const connection = require('../app/database');
const sqlService = require('../service/sql.service')

class FrontService {
  // 添加用户
  async addUser(form) {
    let {phone, password} = form
    let sql = `insert into front_user (phone, password) values (?, ?)`
    let [result] = await connection.execute(sql, [phone, password])
    return result
  }

  // 获取商品详情数据
  async goodsDetail(id, user_id) {
    let sql = ``
    if(user_id) {
      sql = `SELECT 
            JSON_OBJECT('title', title, 'brand', brand, 'train', train, 'master', master, 'price', price, 'old_price', old_price, 'card_time', card_time,
                        'odograph', odograph, 'is_in_store', is_in_store, 'tranfer', tranfer) base,
            JSON_OBJECT('is_bussiness', is_business, 'is_private', is_private, 'is_auto', cars_search_keys.is_auto, 'car_type', car_type, 'displacement', cars_search_keys.displacement,
                        'displace_reg', displace_reg, 'seats', seats, 'fuel_type', fuel_type, 'break', cars_search_keys.break) car_keys,
            JSON_OBJECT('firm', firm, 'level', level, 'engine_power', engine_power, 'car_struct', car_struct, 'size', size, 'wheelbase', wheelbase,
                        'cylinder', cylinder, 'fuel_num', fuel_num) attrs,
            (select JSON_ARRAYAGG(addr) from cars_pics where cars_id = ${id}) pics,
            (select id from user_collect where user_id = ${user_id} and cars_id = ${id}) isCollect
            FROM cars  
            LEFT JOIN cars_search_keys ON cars.id = cars_search_keys.cars_id
            LEFT JOIN cars_attrs ON cars.id = cars_attrs.cars_id
            WHERE cars.id = ${id}`
    } else {
      sql = `SELECT 
              JSON_OBJECT('title', title, 'brand', brand, 'train', train, 'master', master, 'price', price, 'old_price', old_price, 'card_time', card_time,
                          'odograph', odograph, 'is_in_store', is_in_store, 'tranfer', tranfer) base,
              JSON_OBJECT('is_bussiness', is_business, 'is_private', is_private, 'is_auto', cars_search_keys.is_auto, 'car_type', car_type, 'displacement', cars_search_keys.displacement,
                          'displace_reg', displace_reg, 'seats', seats, 'fuel_type', fuel_type, 'break', cars_search_keys.break) car_keys,
              JSON_OBJECT('firm', firm, 'level', level, 'engine_power', engine_power, 'car_struct', car_struct, 'size', size, 'wheelbase', wheelbase,
                          'cylinder', cylinder, 'fuel_num', fuel_num) attrs,
              (select JSON_ARRAYAGG(addr) from cars_pics where cars_id = ${id}) pics
            FROM cars  
            LEFT JOIN cars_search_keys ON cars.id = cars_search_keys.cars_id
            LEFT JOIN cars_attrs ON cars.id = cars_attrs.cars_id
            WHERE cars.id = ${id}`
    }
     
    let [result] = await connection.query(sql)
    return result
  }

  // 添加收藏
  async addCollect(user_id, car_id) {
    let sql = `INSERT INTO user_collect (user_id, cars_id) VALUES (${user_id}, ${car_id})`
    await connection.query(sql).catch(err => err)
  }

  // 获取收藏数据
  async showCollect(id) {
    let sql = `SELECT user_collect.id id, cars.id car_id, title, price, card_time, odograph, cover FROM user_collect LEFT JOIN cars ON user_collect.cars_id = cars.id
              WHERE user_id = ${id}`
    let [result] = await connection.query(sql)
    return result
  }

  // 生成订单
  async addOrders(userId, carId, num, price) {
    let sql = `INSERT INTO orders (order_number, user_id, cars_id, order_price, order_pay) 
              VALUES ('${num}', ${userId}, ${carId}, ${price}, 0)`
    await connection.query(sql).catch(err => err)
  }

  // 获取首页商品数据
  async goodsList(form) {
    let {query, pagenum, pagesize} = form
    if(query) {
      let offset = (pagenum - 1) * pagesize
      let sql = `SELECT * FROM cars WHERE title LIKE '%${query}%' LIMIT ${offset}, ${pagesize}`
      let [result] = await connection.query(sql)
      return result
    } else {
      let result = await sqlService.dataList(pagenum, pagesize, `cars`)
      return result
    }
  }

  // 关键字查询
  async searchByKeys(keys) {
    let sql = `SELECT cars.id, cover, title, price, card_time
              FROM cars
              LEFT JOIN cars_search_keys ON cars.id = cars_search_keys.cars_id
              WHERE `
    if(keys.train !== '') sql += ` train = '${keys.train}' AND`
    if(keys.car_type !== '')  sql += ` car_type = '${keys.car_type}' AND`
    if(keys.price_max != 0 || keys.price_min != 0) 
      sql += ` price > ${keys.price_min} AND price < ${keys.price_max} AND`
    if(keys.engine_max != 0 || keys.engine_min != 0)
      sql += ` engine_power > ${keys.engine_min} AND engine_power < ${keys.engine_max} AND`
    sql = sql.slice(0, -3)
    let [result] = await connection.query(sql)
    // 处理车龄
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let y = 0
    let m = 0
    let minus = 0
    let arr = result.filter(item => {
      y = item.card_time.split('-')[0]
      m = item.card_time.split('-')[1]
      minus = (year - y) * 12 + (month - m)
      minus = minus / 12
      return  minus - keys.age_min >= 0 && minus - keys.age_max <= 0
    })
    return arr
  }

  // 获取用户列表
  async userList(queryInfo) {
    const {query, pagenum, pagesize} = queryInfo
    if(query) {
      let offset = (pagenum - 1) * pagesize
      let sql = `select id, phone, createAt FROM front_user where phone = ${query}`
      let [result] = await connection.query(sql)
      return {
        result,
        total: 1
      }
    } else {
      let total = await sqlService.tableLength(`front_user`)
      let result = await sqlService.dataList(pagenum, pagesize, `front_user`, 'id, phone, createAt')
      return {
        result,
        total
      }
    }
  }

  // 获取订单列表
  async orderList(id) {
    let sql = `SELECT orders.id, cars_id, order_number, order_price, order_pay, title, cover
              FROM orders
              LEFT JOIN cars ON cars_id = cars.id 
              WHERE user_id = ${id}`
    let [result] = await connection.query(sql)
    return result
  }

  // 获取爱车列表
  async carList(phone) {
    let sql = `SELECT id, title, price, card_time, cover
              FROM cars WHERE master = '${phone}'`
    let [result] = await connection.query(sql)
    return result
  } 
}

module.exports = new FrontService()