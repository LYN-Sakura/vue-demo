<template>
  <div>
    <Mbx nav1="商品管理" nav2="商品分类"></Mbx>
    <el-card>
      <el-row>
        <el-col><el-button type="primary" @click="showAddCate">添加商品</el-button></el-col>
      </el-row>

      <!-- 表格 -->
      <zk-table :show-row-hover="false" border index-text="#" show-index :data="cateList" :columns="columns" :selection-type="false" :expand-type="false">
        <template slot="isok" slot-scope="scope">
          <i style="color: lightgreen;" v-if="scope.row.cat_deleted === false" class="el-icon-success"></i>
          <i style="color: red;" v-else class="el-icon-error"></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>
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
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="30%">
      <!-- 主体部分 -->
      <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name"><el-input v-model="addCateForm.cat_name"></el-input></el-form-item>
        <el-form-item label="父级分类:">
          <!-- options 指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader clearable change-on-select v-model="selectionOptions" :props="cascaderProps" :options="parentCateList" @change="changeOptions"></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类列表
      cateList: [],
      // 总数居条数
      total: 0,
      // 为table 指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addDialogVisible: false,
      addCateForm: {
        cat_name: '',
        // 父级id
        cat_id: 0,
        // 默认添加0级id
        cat_level: 0
      },
      addCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }, { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }]
      },
      // 父级分类列表
      parentCateList: [],
      // 级联选择器选中的父级分类id数组
      selectionOptions: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      }
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    // 监听pagenum改变
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    // 显示添加商品对话框
    async showAddCate() {
      let { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.parentCateList = res.data
      this.addDialogVisible = true
    },
    // 选择项发生变化触发
    changeOptions() {
      console.log(this.selectionOptions)
    }
  },
  created() {
    // 获取商品分类数据
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin: 15px auto;
}
.el-cascader {
  width: 100%;
}
</style>
