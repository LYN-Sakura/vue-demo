<template>
  <div>
    <Mbx nav1="商品管理" nav2="添加商品"></Mbx>
    <el-card>
      <el-alert title="消息提示的文案" center show-icon :closable="false" type="info"></el-alert>
      <el-steps align-center :active="0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-upload
        :headers="headerObj"
        class="upload-demo"
        action="http://127.0.0.1:8888/api/private/v1/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        list-type="picture"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  methods: {
    handlePreview() {},
    handleRemove() {}
  }
}
</script>

<style lang="less" scoped></style>
