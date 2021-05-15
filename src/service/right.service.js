const connection = require('../app/database')


function sqlfunc(level, pid, role_id) {
  return `SELECT 
          JSON_ARRAYAGG(JSON_OBJECT('id', rr.right_id, 'authName', authName, 'path', path, 
          'level', right_level, 'pid', right_pid)) children
        FROM admin_rights ri
        LEFT JOIN role_right rr ON ri.right_id = rr.right_id
        WHERE rr.right_level = ${level} AND rr.right_pid = ${pid} AND role_id = ${role_id}
        GROUP BY role_id`
}

function sqlRightsTree(level, pid) {
  return `SELECT 
	        JSON_ARRAYAGG(JSON_OBJECT('id', right_id, 'authName', authName, 'path', path, 'pid', pid)) children
        FROM admin_rights
        WHERE LEVEL = ${level} AND pid = ${pid}`
}

async function deleteChildNode(roleId, rightId) {
  let sql = `DELETE FROM role_right WHERE role_id = ? AND right_pid = ?`
  await connection.execute(sql, [roleId, rightId]).catch(err => err)
}

async function deleteNode(roleId, rightId) {
  let sql = `DELETE FROM role_right WHERE role_id = ? AND right_id = ?`
  await connection.execute(sql, [roleId, rightId]).catch(err => err)
}

class RightService {
  // 获取权限列表
  async rightList(type) {
    let sql = ``
    if(type === `list`) {
      sql = `SELECT id, right_id, authName, level, pid, path FROM admin_rights`
      let [result] = await connection.query(sql).catch(err => err)
      return result
    }
    if(type === 'tree') {
      let sql = `SELECT 
                  right_id id, authName, path, pid
                FROM admin_rights
                WHERE LEVEL = 0`
      let [result] = await connection.query(sql)
      for(let i of result) {
        sql = sqlRightsTree(1, i.id)
        let [result] = await connection.query(sql)
        if(result[0].length !== 0) {
          i.children = result[0].children
        }
        for(let j of i.children) {
          sql = sqlRightsTree(2, j.id)
          let [result] = await connection.query(sql)
          if(result[0].length !== 0) {
            j.children = result[0].children
          }
        }
      }
      return result
    }
  }

  // 获取角色列表及权限
  async roleList() {
    let sql = `SELECT 
                ro.role_id id, ro.roleName, ro.roleDesc,
                IF (COUNT(ri.right_id) ,JSON_ARRAYAGG(JSON_OBJECT('id', ri.right_id, 'authName', ri.authName, 'path', ri.path,
                'level', right_level, 'pid', right_pid)),JSON_ARRAY())children
              FROM admin_role ro
              LEFT JOIN role_right rr ON ro.role_id =rr.role_id 
              LEFT JOIN admin_rights ri ON ri.right_id = rr.right_id
              WHERE rr.right_level=0 OR rr.right_level IS NULL
              GROUP BY ro.role_id`
    let [result] = await connection.query(sql)
    for(let i of result) {
      if(i.children.length !== 0) {
        for(let j of i.children) {
          let sql2 = sqlfunc(1, j.id, i.id)
          const [result2] = await connection.query(sql2)
          if(result2.length !== 0) {
            j.children = result2[0].children
            // last
            for(let k of j.children) {
              let sql3 = sqlfunc(2, k.id, i.id)
              const [result3] = await connection.query(sql3)
              if(result3.length !== 0) {
                k.children = result3[0].children
              }
            }
          }
        }
      }
    }
    return result
  }

  // 获取角色列表
  async getRoles() {
    let sql = `SELECT id, role_Id, roleName, roleDesc FROM admin_role`
    let [result] = await connection.query(sql)
    return result
  }

  // 添加角色
  async addRole(form) {
    const {roleName, roleDesc} = form
    let sql = `SELECT MAX(role_id) FROM admin_role`
    const [result] = await connection.query(sql)
    const maxId = result[0]['MAX(role_id)']
    let mid = Math.floor(Math.random()*10) + 1
    let id = maxId + mid
    sql = `INSERT INTO admin_role (role_id, roleName, roleDesc) VALUES (?, ?, ?)`
    const [result2] = await connection.execute(sql, [id, roleName, roleDesc])
    return result2
  }

  // 修改角色信息
  async alterRole(id, form) {
    let {roleName, roleDesc} = form
    let sql = `UPDATE admin_role SET roleName = ?, roleDesc = ? WHERE role_id = ${id}`
    await connection.execute(sql, [roleName, roleDesc]).catch(err => err)
    return 
  }

  // 删除角色权限
  async removeRoleRight(roleId, rightId, level) {
    let sql = `SELECT right_id id FROM role_right WHERE role_id = ? AND right_pid = ?`
    if(level == 0) {
      // 获取所有子节点
      let [mid] = await connection.execute(sql, [roleId, rightId])
      for(let i of mid) {
        // 删除所有以子节点为父的权限
        await deleteChildNode(roleId, i.id)
        // 删除子节点
        await deleteNode(roleId, i.id)
      }
      // 删除自己
      await deleteNode(roleId, rightId)
    } else if(level == 1) {
      // 删除所有子节点
      await deleteChildNode(roleId, rightId)
      // 删除自己
      await deleteNode(roleId, rightId)
    } else if(level == 2) {
      // 删除自己
      await deleteNode(roleId, rightId)
    }
    sql = `SELECT 
            JSON_ARRAYAGG(JSON_OBJECT('id', ri.right_id, 'authName', ri.authName, 'path', ri.path,
            'level', right_level))children
          FROM role_right rr
          LEFT JOIN admin_rights ri ON ri.right_id = rr.right_id
          WHERE rr.right_level = 0 AND rr.role_id = ?`
    let [[finalresult]] = await connection.execute(sql, [roleId])
    if(!finalresult.children) return []
    for(let i of finalresult.children) {
      sql = sqlfunc(1, i.id, roleId)
      let [result2] = await connection.query(sql)
      if(result2.length !== 0) {
        i.children = result2[0].children
        for(let j of i.children) {
          sql = sqlfunc(2, j.id, roleId)
          let [result3] = await connection.query(sql)
          if(result3.length !== 0) {
            j.children = result3[0].children
          }
        }
      }
    }
    return finalresult
  }

  // 分配权限
  async allotRights(roleId, keys) {
    let sql = `SELECT right_id rid FROM role_right WHERE role_id = ?`
    let [result] = await connection.execute(sql, [roleId])
    let len1 = keys.length
    let len2 = result.length
    if(len1 !== 0) {
      // 先删除表内已有地权限
      sql = `DELETE FROM role_right WHERE role_id = ?`
      await connection.execute(sql, [roleId])
      // 全部添加
      sql = `SELECT level, pid FROM admin_rights WHERE right_id = ?`
      let levels = []
      let pids = []
      for(let i of keys) {
        let [midResult] = await connection.execute(sql, [i])
        levels.push(midResult[0].level)
        pids.push(midResult[0].pid)
      }
      let frag = ``
      for(let i = 0; i < len1; i++) {
        frag += `(${roleId}, ${keys[i]}, ${levels[i]}, ${pids[i]}),`
      }
      frag = frag.slice(0, -1)
      sql = `INSERT INTO role_right (role_id, right_id, right_level, right_pid) VALUES ${frag}`
      await connection.query(sql)
    } else if(len2 !== 0) {
      // 全部删除
      sql = `DELETE FROM role_right WHERE role_id = ?`
      await connection.execute(sql, [roleId])
    } else {
      // 直接返回
    } 
    return []
  }
}

module.exports = new RightService()