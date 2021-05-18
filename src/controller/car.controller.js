const fs = require('fs')

const config = require('../app/config')
const carService = require('../service/car.service')
const sqlService = require('../service/sql.service')

class CarController {
  // 获取分类数据
  async cateList(ctx, next) {
    const {queryInfo} = ctx.query
    let result = await carService.cateList(JSON.parse(queryInfo))
    ctx.body = {
      meta: {
        status: 200,
        message: `获取汽车分类成功`
      },
      data: {
        result
      }
    }
  }

  // 添加分类
  async addCate(ctx, next) {
    const {form} = ctx.query
    let temp = JSON.parse(form)
    let path = `./public/goods/cate/logo/${temp.filename}`
    // 复制文件
    fs.copyFile(temp.temp_path, path, (err) => {
      if(err) {
        return {
          status: 412,
          message: `复制临时图片失败`
        }
      }
    })
    // 删除文件
    fs.unlink(temp.temp_path, (err) => {
      if(err) {
        return {
          status: 412,
          message: `删除临时图片失败`
        }
      }
    })
    temp.temp_path =`http://${config.APP_HOST}:${config.APP_PORT}/goods/cate/logo/${temp.filename}` 
    let result = await carService.addCate(temp)
    ctx.body = {
      meta: {
        status: 200,
        message: `添加分类成功`
      }
    }
  }
  
  // 删除分类
  async removeCate(ctx, next) {
    const {id} = ctx.params
    const {type} = ctx.query
    let table = `car_train`
    if(type == 1) {
      // 删除品牌
      table = `car_brands`
    }
    await sqlService.deleteByField(table, `id`, id).catch(err => err)
    ctx.body = {
      meta: {
        status: 200,
        message: `删除分类成功`
      }
    }
  }

  // 获取分类塑胶
  async cateInfo(ctx, next) {
    const {id} = ctx.params
    const {type} = ctx.query
    let table = `car_train`
    if(type == 1) {
      // 查询品牌
      table = `car_brands`
    }
    let name = await sqlService.searchByField(table, `id`, id, `name`)
    ctx.body = {
      meta: {
        status: 200,
        message: `获取分类信息成功`
      },
      data: {
        name: name.name
      }
    }
  }

  // 编辑分类
  async editCate(ctx, next) {
    let {form} = ctx.query
    form = JSON.parse(form)
    let table = `car_train`
    let id = form.cat_id
    let obj = {
      name: form.cat_name
    }
    if(form.type == 1) {
      // 改变品牌
      table = `car_brands`
    }
    await sqlService.alterTable(table, id, obj)
    ctx.body = {
      meta: {
        status: 200,
        message: `编辑分类信息成功`
      }
    }
  }
}

module.exports = new CarController()