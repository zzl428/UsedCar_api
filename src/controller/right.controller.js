const rightService = require('../service/right.service')
const sqlService = require('../service/sql.service')

class RightController {
  // 获取权限列表
  async rightList(ctx, next) {
    const {type} = ctx.params
    let result = await rightService.rightList(type)
    ctx.body = {
      meta: {
        message: `获取权限列表成功`,
        status: 200
      },
      data: {
        result
      }
    }
  }

  // 获取角色列表及权限
  async roleList(ctx, next) {
    const result = await rightService.roleList()
    ctx.body = {
      meta: {
        message: `获取角色列表成功`,
        status: 200
      },
      data: {
        result
      }
    }
  }

  // 获取角色列表
  async roles(ctx, next) {
    let result = await rightService.getRoles()
    ctx.body = {
      meta: {
        message: `获取角色列表成功`,
        status: 200
      },
      data: {
        result
      }
    }
  }

  // 添加角色
  async addRole(ctx, next) {
    const {form} = ctx.query
    let result = await rightService.addRole(JSON.parse(form))
    ctx.body = {
      meta: {
        message: `添加角色成功`,
        status: 200
      }
    }
  }

  // 获取角色信息
  async searchRole(ctx, next) {
    const {id} = ctx.params
    let frag = `id, role_id, roleName, roleDesc`
    let result = await sqlService.searchByField(`admin_role`, `role_id`, id, frag)
    ctx.body = {
      meta: {
        message: `获取角色信息成功`,
        status: 200
      },
      data: {
        result
      }
    }
  }

  // 修改角色信息
  async editRole(ctx, next) {
    const {id} = ctx.params
    const {form} = ctx.query
    await rightService.alterRole(id, JSON.parse(form)).catch(err => err)
    ctx.body = {
      meta: {
        message: `修改角色信息成功`,
        status: 200
      },
    }
  }

  // 删除角色
  async removeRole(ctx, next) {
    const {id} = ctx.params
    await sqlService.deleteByField(`admin_role`, `role_id`, id)
    ctx.body = {
      meta: {
        message: `删除角色成功`,
        status: 200
      },
    }
  }

  // 删除角色权限
  async removeRoleRight(ctx, next) {
    const {roleId, rightId} = ctx.params
    const {level} = ctx.query
    let result = await rightService.removeRoleRight(roleId, rightId, level)
    ctx.body = {
      meta: {
        message: `删除角色权限成功`,
        status: 200
      },
      data: {
        result
      }
    }
  }

    // 分配权限
    async allotRights(ctx, next) {
      const {roleId} = ctx.params
      const {keys} = ctx.request.body
      await rightService.allotRights(roleId, keys).catch(err => err)
      ctx.body = {
        meta: {
          message: `角色权限分配成功`,
          status: 200
        }
      }
    }
}

module.exports = new RightController()