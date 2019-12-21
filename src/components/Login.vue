<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box"><img src="../assets/logo.png" alt="头像" /></div>
      <el-form ref="loginRef" class="login_form" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username"><el-input v-model="loginForm.username" prefix-icon="iconfont icon-ai-user"></el-input></el-form-item>
        <el-form-item prop="password"><el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima" type="password"></el-input></el-form-item>
      </el-form>
      <div class="btn">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }, { min: 3, max: 10, message: '请输入长度为3到10的字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '请输入长度为6到15的字符', trigger: 'blur' }]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.loginRef.resetFields()
    },
    login () {
      this.$refs.loginRef.validate(async valid => {
        if (!valid) return false
        let { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登陆失败！')
        this.$message.success('登陆成功')
        console.log(1)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: relative;
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
}
.avatar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px #eee solid;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  margin: 100px auto 0;
  width: 90%;
}
.btn {
  position: absolute;
  right: 5%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
}
</style>
