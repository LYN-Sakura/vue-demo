<template>
  <div>
    <Mbx nav1="商品管理" nav2="商品列表"></Mbx>
    <el-card>
      <el-input placeholder="请输入内容" class="input-with-select"><el-button slot="append" icon="el-icon-search"></el-button></el-input>
      <el-button type="primary" @click="addGoods">添加商品</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    addGoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 300px;
  margin-right: 20px;
}
</style>
