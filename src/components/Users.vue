<template>
  <div>
    <Mbx nav1="用户管理" nav2="用户列表"></Mbx>
    <el-card class="box-c ard">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select"><el-button slot="append" icon="el-icon-search"></el-button></el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary">添加用户</el-button></el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="userStatusChange(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="del(scope.row.id)"></el-button>
            <!-- 权限 -->
            <el-tooltip class="item" effect="dark" content="分配角色" :enterable="false" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 设置分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      let { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('用户列表获取失败')
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 每页的显示数量发生改变时触发
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 页码值改变时触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 监听用户状态改变
    async userStatusChange(val) {
      let { data: res } = await this.$http.put('users/' + val.id + '/state/' + val.mg_state)
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return this.getUserList()
      }
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    // 删除用户
    async del(val) {
      if (confirm('确定要删除此数据吗？')) {
        let { data: res } = await this.$http.delete('users/' + val)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getUserList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin: 15px 0;
  font-size: 15px;
}
</style>
