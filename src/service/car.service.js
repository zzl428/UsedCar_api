const connection = require('../app/database');
const sqlService = require('./sql.service');

class CarService {
  // 获取分类数据
  async cateList(queryInfo) {
    let {type, id, pagenum, pagesize} = queryInfo
    if(type === 1) {
      // 返回品牌数据
      let total = await sqlService.tableLength(`car_brands`)
      let size = pagesize || total
      let num = pagenum || 1
      let result = await sqlService.dataList(num, size, `car_brands`, `id, name, initial, url, image`)
      return {
        result,
        total
      }
    }
    if(type === 2) {
      // 返回车系数据
      let sql = `SELECT id, name, brand_id, brand_name, url, image FROM car_train WHERE brand_id = ?`
      let [result] = await connection.execute(sql, [id])
      return {
        result
      }
    }
    if(type === 3) {
      let total = await sqlService.tableLength(`car_brands`)
      let result = await sqlService.dataList(1, total, `car_brands`, `id, name, initial`)
      for(let i of result) {
        let train = await sqlService.dataAllList(`car_train`, `brand_id`, i.id, `id, name`)
        i.children = train
      }
      return {
        result
      }
    }
  }

  // 添加分类
  async addCate(form) {
    const {cat_name, cat_pid, temp_path} = form
    let sql = `select name from car_brands where id = ${cat_pid}`
    let [name] = await connection.query(sql)
    sql = `INSERT INTO car_train (name, brand_id, brand_name, url, image) VALUES (?, ?, ?, ?, ?)`
    await connection.execute(sql, [cat_name, cat_pid, name[0].name, cat_name, temp_path]).catch(err => err)
  }

  // 获取汽车列表
  async carList(form) {
    let {query, pagenum, pagesize} = form
    if(!query) {
      let total = await sqlService.tableLength(`cars`)
      let result = await sqlService.dataList(pagenum, pagesize, `cars`)
      return {
        result,
        total
      }
    } else {
      let offset = (pagenum - 1) * pagesize
      let sql = `SELECT * FROM cars WHERE title LIKE '%${query}%' LIMIT ${offset}, ${pagesize}`
      let [result] = await connection.query(sql)
      sql = `SELECT COUNT(*) total FROM cars WHERE title LIKE '%${query}%'`
      let [total] = await connection.query(sql)
      return {
        total: total[0].total,
        result
      }
    }
    
  }

  // 获取参数信息
  async carParams() {
    let sql = `SELECT car_type FROM cars_search_keys GROUP BY car_type`
    let [car_type] = await connection.query(sql)
    sql = `SELECT fuel_type FROM cars_search_keys GROUP BY fuel_type`
    let [fuel_type] = await connection.query(sql)
    return {
      car_type,
      fuel_type
    }
  }

  // 插入商品基本信息表
  async addBaseInfo(form) {
    let {title, brand, train, master, price, old_price, card_time, 
        odograph, is_in_store, tranfer, cover} = form
    if(cover) {
      let sql = `INSERT INTO cars 
                (title, brand, train, master, price, old_price, card_time, odograph, 
                is_in_store, tranfer, cover) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      let [result] = await connection.execute(sql, [title, brand, train, master, price, old_price, 
                                                  card_time, odograph, is_in_store, tranfer, cover])
      return result
    } else {
      let sql = `INSERT INTO cars 
                (title, brand, train, master, price, old_price, card_time, odograph, 
                is_in_store, tranfer) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      let [result] = await connection.execute(sql, [title, brand, train, master, price, old_price, 
                                                    card_time, odograph, is_in_store, tranfer])
      return result
    }
  }

  // 插入商品关键字属性表
  async addParamsAttrs(paramsform, attrsform, id) {
    // 整理关键字表
    if(paramsform.is_business === `运营`) paramsform.is_business = 1
    else paramsform.is_business = 0
    if(paramsform.is_private === `私用`)  paramsform.is_private = 1
    else paramsform.is_private = 0
    if(paramsform.is_auto === `自动`) paramsform.is_auto = 1
    else paramsform.is_auto = 0
    // 插入
    let sql = `INSERT INTO cars_search_keys
              (cars_id, is_business, is_private, engine_power, is_auto, car_type, 
                displacement, displace_reg, seats, fuel_type, break)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    await connection.execute(sql, [id, paramsform.is_business, paramsform.is_private, paramsform.engine_power,
                                  paramsform.is_auto, paramsform.car_type,paramsform.displacement,
                                  paramsform.displace_reg, paramsform.seats, paramsform.fuel_type,
                                  paramsform.break])
    // 整理属性表
    attrsform.engine = `${paramsform.displacement}L/${paramsform.engine_power}马力`
    attrsform.car_struct = `4门${paramsform.seats}座${paramsform.car_type}`
    if(attrsform.length !== '' || attrsform.width !== '' || attrsform.height !== '') {
      attrsform.size = `${attrsform.length}/${attrsform.width}/${attrsform.height}`
      sql = `INSERT INTO cars_attrs
            (cars_id, firm, displacement, engine, is_auto, car_struct, size, wheelbase, 
              cylinder, fuel_num, break)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      await connection.execute(sql, [id, attrsform.firm, paramsform.displacement, attrsform.engine,
                                    paramsform.is_auto, attrsform.car_struct, attrsform.size,
                                    attrsform.wheelbase, attrsform.cylinder, attrsform.fuel_num, paramsform.break])
    } else {
      sql = `INSERT INTO cars_attrs
            (cars_id, firm, displacement, engine, is_auto, car_struct, wheelbase, 
              cylinder, fuel_num, break)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      await connection.execute(sql, [id, attrsform.firm, paramsform.displacement, attrsform.engine,
                                    paramsform.is_auto, attrsform.car_struct, attrsform.wheelbase, 
                                    attrsform.cylinder, attrsform.fuel_num, paramsform.break])
    }
  }

  // 添加商品信息
  async addGoodPics(pics, id) {
    let frag = ``
    pics.forEach(item => {
      frag += ` (${id}, '${item}'),`
    })
    frag = frag.slice(0, -1)
    let sql = `INSERT INTO cars_pics (cars_id, addr) VALUES${frag}`
    await connection.query(sql)
  }
}

module.exports = new CarService()
