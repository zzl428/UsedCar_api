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
    // let {type, pagenum, pagesize} = queryInfo
    // let num = pagenum || 1
    // let total = await sqlService.tableLength(`car_brands`)
    // let size = pagesize || total
    // let result = await sqlService.dataList(num, size, `car_brands`, `id, name, initial, url, image`)
    // if(type === 1) {
    //   return {
    //     result
    //   }
    // }
    // let sql = `SELECT id, name, brand_id, brand_name, url, image FROM car_train WHERE brand_id = ?`
    // for(let i of result) {
    //   let [result] = await connection.execute(sql, [i.id])
    //   if(result.length !== 0) {
    //     i.children = result
    //   }
    // }
    // return {
    //   result,
    //   total
    // }
  }

  // 添加分类
  async addCate(form) {
    const {cat_name, cat_pid, temp_path} = form
    let sql = `select name from car_brands where id = ${cat_pid}`
    let [name] = await connection.query(sql)
    sql = `INSERT INTO car_train (name, brand_id, brand_name, url, image) VALUES (?, ?, ?, ?, ?)`
    await connection.execute(sql, [cat_name, cat_pid, name[0].name, cat_name, temp_path]).catch(err => err)
  }
}

module.exports = new CarService()
