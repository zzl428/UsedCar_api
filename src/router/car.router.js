const Router = require('koa-router')

const carRouter = new Router({prefix:'/cars'})

const {cateList, addCate, removeCate, cateInfo, editCate} = require('../controller/car.controller')
const {verifyAuth} = require('../middleware/user.middleware')

// post
// 添加分类
carRouter.post('/categories', addCate)

// get
// 获取分类数据
carRouter.get('/categories', cateList)
carRouter.get('/categories/:id', cateInfo)
// put
// 编辑分类
carRouter.put('/categories', verifyAuth, editCate)

// delete
// 删除分类
carRouter.delete('/categories/:id', verifyAuth, removeCate)

module.exports = carRouter