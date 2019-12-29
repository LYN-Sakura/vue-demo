<template>
  <div>
    <Mbx nav1="商品管理" nav2="分类参数"></Mbx>
    <el-card>
      <!-- 提示框 -->
      <el-alert show-icon title="注意: 只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
      <!-- 级联选择器 -->
      选择商品分类：
      <el-cascader v-model="cateKeys" :options="cateList" :props="cateProps" @change="selectChange"></el-cascader>
      <!-- tab栏 -->
      <el-tabs v-model="activeName" @tab-click="clickWho">
        <!-- 添加分类参数按钮 -->
        <el-button type="primary" :disabled="cateKeys.length === 3 ? false : true" @click="showAddParams">添加参数</el-button>
        <el-tab-pane label="动态参数" name="many">
          <!-- 表格 -->
          <el-table :data="manyData" border style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(v, i) in scope.row.attr_vals" :key="i">{{ v }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template>
                <!-- 按钮 -->
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 表格 -->
          <el-table :data="onlyData" border style="width: 100%">
            <el-table-column type="expand"><template></template></el-table-column>
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template>
                <!-- 按钮 -->
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加分类参数对话框 -->
    <el-dialog :title="'添加' + (activeName === 'many' ? '动态参数' : '静态属性')" :visible.sync="addDialogVisible" width="50%">
      <span>这是一段信息</span>
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
      // tab栏默认显示
      activeName: 'many',
      // 分类数据
      cateList: [],
      // 选中的分类id
      cateKeys: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态参数
      manyData: [],
      // 静态属性
      onlyData: [],
      // 添加分类参数的对话框默认关闭
      addDialogVisible: false,
      // input是否可见
      inputVisible: false,
      // 标签内容
      inputValue: ''
    }
  },
  methods: {
    // tab栏切换=
    clickWho() {
      this.getCateAttr()
    },
    // 获取分类总数据
    async getParamsList() {
      let { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败')
      this.cateList = res.data
    },
    // 级联选择器改变
    selectChange() {
      if (this.cateKeys.length !== 3) {
        this.cateKeys = []
        return false
      }
      this.getCateAttr()
    },
    // 获取分类参数
    async getCateAttr() {
      let { data: res } = await this.$http.get(`categories/${this.cateKeys[2]}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败，请稍后重试')
      // 根据不同的tab栏分配不同的参数
      if (this.activeName === 'many') {
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.split(' ')
      })
      console.log(res.data)
    },
    // 增加分类参数的函数
    showAddParams() {
      this.addDialogVisible = true
    },
    // 添加参数/属性下的标签
    handleInputConfirm() {
      this.inputVisible = false
    },
    // 点击按钮显示文本框
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },

  // 开场加载
  created() {
    this.getParamsList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  margin: 15px 0;
}
.el-alert {
  letter-spacing: 1.2px;
}
.el-tag {
  margin: 0 10px;
}
.input-new-tag{
  width: 130px;
}
</style>
