<template>
  <div>
    <Mbx nav1="权限管理" nav2="权限列表"></Mbx>
    <el-card class="box-card">
      <el-table border :data="rightsList" stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList() {
      let { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('未获取到数据')
      this.rightsList = res.data
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style lang="less" scoped></style>
