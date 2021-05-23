const Router = require('koa-router')

const carRouter = new Router({prefix:'/cars'})

const {cateList, addCate, removeCate, cateInfo, editCate, carList, removeCar, 
        searchCar, editCar, carParams, addGood} 
  = require('../controller/car.controller')
const {verifyAuth} = require('../middleware/user.middleware')

// post
// 添加分类
carRouter.post('/categories', addCate)
carRouter.post('/', verifyAuth, addGood)

// get
// 获取汽车列表
carRouter.get('/', carList)
// 获取分类数据
carRouter.get('/categories', cateList)
carRouter.get('/categories/:id', cateInfo)
// 获取参数信息
carRouter.get('/params', carParams)
// 按id搜索商品
carRouter.get('/:id', searchCar)
// put
// 编辑分类
carRouter.put('/categories', verifyAuth, editCate)
// 编辑商品
carRouter.put('/', verifyAuth, editCar)

// delete
// 删除分类
carRouter.delete('/categories/:id', verifyAuth, removeCate)
// 删除商品
carRouter.delete('/:id', verifyAuth, removeCar)

module.exports = carRouter