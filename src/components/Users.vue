<template>
  <div>
    <Mbx nav1="用户管理" nav2="用户列表"></Mbx>
    <el-card class="box-c ard">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" @clear="getUserList" class="input-with-select" v-model="queryInfo.query">
            <el-button slot="append" @click="getUserList" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"><el-button type="primary" @click="addDialogvisible = true">添加用户</el-button></el-col>
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
            <el-button @click="showUsers(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
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
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogvisible" width="40%">
      <!-- 主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username"><el-input v-model="addForm.username"></el-input></el-form-item>
        <el-form-item label="密码" prop="password"><el-input type="password" v-model="addForm.password"></el-input></el-form-item>
        <el-form-item label="邮箱" prop="email"><el-input v-model="addForm.email"></el-input></el-form-item>
        <el-form-item label="手机号" prop="mobile"><el-input v-model="addForm.mobile"></el-input></el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户信息" @close="closeeditForm" :visible.sync="changeDialogVisible" width="50%">
      <!-- 主体信息 -->
      <el-form :model="editForm" ref="editFormRef" :rules="editFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username"><el-input disabled v-model="editForm.username"></el-input></el-form-item>
        <el-form-item label="邮箱" prop="email"><el-input v-model="editForm.email"></el-input></el-form-item>
        <el-form-item label="手机号" prop="mobile"><el-input v-model="editForm.mobile"></el-input></el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUsers">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义验证规则
    // 邮箱规则
    var emailPass = (rule, value, cb) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 手机号规则
    var mobilePass = (rule, value, cb) => {
      // 验证手机号的正则
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogvisible: false,
      changeDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: emailPass, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: mobilePass, trigger: 'blur' }]
      },
      editFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: emailPass, trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: mobilePass, trigger: 'blur' }]
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户信息
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
    async del(id) {
      const select = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (select !== 'confirm') return this.$message.info('已取消删除')
      let { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success(res.meta.msg)
      // 删除当前最后一个用户数据时出现空白的优化
      let { data: req } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (req.data.total % this.queryInfo.pagesize === 0) {
        this.queryInfo.pagenum = this.queryInfo.pagenum - 1
      }
      this.getUserList()
    },
    // 清空填写数据
    reset() {
      this.$refs.addFormRef.resetFields()
    },
    // 增加用户
    addUsers() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请认真填写！')
        let { data: res } = await this.$http.post('/users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getUserList()
        this.$message.success(res.meta.msg)
        this.addDialogvisible = false
      })
    },
    // 修改用户
    async showUsers(id) {
      let { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询数据失败')
      this.editForm.username = res.data.username
      this.editForm.email = res.data.email
      this.editForm.mobile = res.data.mobile
      this.editForm.id = res.data.id
      this.changeDialogVisible = true
    },
    // 更新数据
    updateUsers() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('验证未通过')
        let { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('修改失败，再来一次')
        this.getUserList()
        this.changeDialogVisible = false
        this.$message.success(res.meta.msg)
      })
    },
    // close事件关闭
    closeeditForm() {
      this.$refs.editFormRef.resetFields()
    }
  },
  watch: {
    addDialogvisible: function() {
      window.setTimeout(
        function() {
          this.reset()
        }.bind(this),
        11
      )
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
