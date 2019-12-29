<template>
  <div>
    <Mbx nav1="权限管理" nav2="角色列表"></Mbx>
    <el-card>
      <el-row>
        <el-col><el-button type="primary">添加角色</el-button></el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe row-key="id" :tree-props="{ children: null, hasChildren: null }">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'df']" v-for="(val1, i1) in scope.row.children" :key="val1.id">
              <!-- 渲染一级 -->
              <el-col :span="5">
                <el-tag @close="removeRole(scope.row, val1.id)" closable>{{ val1.authName }}</el-tag>
                <i class="  el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级 -->
              <el-col :span="19">
                <el-row :class="['bdbottom', i2 == 0 ? 'bdtop' : '', 'df']" v-for="(val2, i2) in val1.children" :key="val2.id">
                  <el-col :span="6">
                    <el-tag @close="removeRole(scope.row, val2.id)" closable type="success">{{ val2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="removeRole(scope.row, val3.id)" closable type="warning" v-for="val3 in val2.children" :key="val3.id">{{ val3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column type="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column type="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetDialogVisible(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 显示设置权限对话框 -->
    <el-dialog @close="rightsDialogClosed" title="分配权限" :visible.sync="setDialogVisible" width="50%">
      <!-- 主体部分 -->
      <el-tree ref="treeRef" :default-checked-keys="defKeys" show-checkbox node-key="id" default-expand-all :data="rightsList" :props="rightsProps"></el-tree>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      setDialogVisible: false,
      rightsList: [],
      rightsProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: ''
    }
  },
  methods: {
    async getRoleList() {
      let { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('未获取到数据')
      this.roleList = res.data
    },
    // 删除操作
    async removeRole(role, rights) {
      let cf = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (cf !== 'confirm') return this.$message.info('已取消操作')
      let { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rights}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    async showSetDialogVisible(val) {
      let { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.roleId = val.id
      this.rightsList = res.data
      this.findLastChildren(val, this.defKeys)
      this.setDialogVisible = true
    },
    // 通过递归方式获取递归项
    findLastChildren(obj, arr) {
      if (obj.hasOwnProperty('children')) {
        obj.children.forEach(obj => {
          this.findLastChildren(obj, arr)
        })
      } else {
        return arr.push(obj.id)
      }
    },
    // 关闭对话框时清除数据
    rightsDialogClosed() {
      this.defKeys = []
    },
    // 对话框确认按钮
    async allotRights() {
      const helfKeys = this.$refs.treeRef.getHalfCheckedKeys()
      const allKeys = this.$refs.treeRef.getCheckedKeys()
      const keys = [...helfKeys, ...allKeys]
      const idStr = keys.join(',')
      let { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) return this.$message.error('更改出错')
      this.$message.success(res.meta.msg)
      this.setDialogVisible = false
      this.getRoleList()
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.df {
  display: flex;
  align-items: center;
}
</style>
