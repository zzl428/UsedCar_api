const Router = require('koa-router')

const rightRouter = new Router({prefix:'/rights'})

const {rightList, roleList, addRole, searchRole, editRole, removeRole, removeRoleRight, allotRights, roles} 
  = require('../controller/right.controller')
const {verifyAuth} = require('../middleware/user.middleware')

// post
// 添加角色
rightRouter.post('/roles', verifyAuth, addRole)
// 分配权限
rightRouter.post('/roles/:roleId', verifyAuth, allotRights)

// get
// 获取权限列表
rightRouter.get('/:type', rightList)
// 获取角色列表及权限
rightRouter.get('/roles/list', roleList)
// 获取角色列表
rightRouter.get('/roles/pure', roles)
// 获取角色信息
rightRouter.get('/roles/:id', searchRole)


// put
// 修改角色信息
rightRouter.put('/roles/:id', verifyAuth, editRole)

// delete
// 删除角色
rightRouter.delete('/roles/:id', verifyAuth, removeRole)
// 删除角色权限
rightRouter.delete('/:rightId/roles/:roleId', verifyAuth, removeRoleRight)

module.exports = rightRouter