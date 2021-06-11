const Router = require('koa-router')

const userRouter = new Router()

const 
  {login, getAdminMenus, getUserList, alterState, addUser, getUser, alterUser, deleteUser, setRole, 
    getVisit, weekVisit, adminWork, roleWork, goodWork, opList} 
= require('../controller/user.controller')
const {verifyLogin, verifyAuth, handlePassword} = require('../middleware/user.middleware')

// post
// 登录
userRouter.post('/login', verifyLogin, login)
// 添加管理员
userRouter.post('/users', verifyAuth, handlePassword, addUser)
// 分配用户角色
userRouter.post('/users/:id/roles/:roleId', verifyAuth, setRole)
// get
// 获取菜单栏数据
userRouter.get('/menus', verifyAuth, getAdminMenus)
// 获取用户数据列表
userRouter.get('/users', verifyAuth, getUserList)
// 按id搜索用户
userRouter.get('/users/:id', getUser)
// 获取访问量
userRouter.get('/welcome/visit', getVisit)
// 获取每周访问量
userRouter.get('/welcome/visit/week', weekVisit)
// 获取管理员工作量
userRouter.get('/welcome/admin/work', adminWork)
// 获取角色工作量
userRouter.get('/welcome/role/work', roleWork)
// 获取商品工作量
userRouter.get('/welcome/good/work', goodWork)
// 获取用户操作数据
userRouter.get('/users/op/:id', verifyAuth, opList)

// put
// 更改用户状态
userRouter.put('/users/:id/state/:state', verifyAuth, alterState)
// 更改用户信息
userRouter.put('/users/:id', verifyAuth, alterUser)

// delete
// 删除用户
userRouter.delete('/users/:id', verifyAuth, deleteUser)

module.exports = userRouter