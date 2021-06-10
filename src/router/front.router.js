const Router = require('koa-router')

const frontRouter = new Router({prefix:'/front'})

const {addUser, checkPhone, login, homeGoodList, goodsDetail, addCollect, 
        showCollect, removeCollect, addOrders, searchByKeys, UserList, orderList, cancelOrder, carList} 
  = require('../controller/front.controller')
const {verifyUser, handlePassword, verifyUserLogin, verifyAuth} = require('../middleware/user.middleware')

// post
// 用户注册
frontRouter.post('/register', verifyUser, handlePassword, addUser)
frontRouter.post('/login', verifyUserLogin, login)
frontRouter.post('/detail/:id', verifyAuth, addCollect)
// 生成订单
frontRouter.post('/user/orders/:id', verifyAuth, addOrders)

// get
// 验证手机号
frontRouter.get('/register/:phone', checkPhone)
// 获取首页商品数据
frontRouter.get('/home/goods', homeGoodList)
// 获取详情数据
frontRouter.get('/detail/:id', goodsDetail)
// 获取收藏数据
frontRouter.get('/user/:id/collect', verifyAuth, showCollect)
frontRouter.get('/home/goods/keys', searchByKeys)
// 获取用户列表
frontRouter.get('/users', verifyAuth, UserList)
// 获取订单列表
frontRouter.get('/orders', verifyAuth, orderList)
// 获取爱车列表
frontRouter.get('/cars', verifyAuth, carList)

// delete
// 取消收藏
frontRouter.delete('/user/collect/:id', verifyAuth, removeCollect)
// 取消订单
frontRouter.delete('/orders/:id', verifyAuth, cancelOrder)

module.exports = frontRouter