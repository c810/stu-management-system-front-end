<template>
  <el-main>
    <el-form ref="searchRef" :model="addModel" :rules="rules" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchForm.collegeName" placeholder="请输入学院名称"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button icon="el-icon-close" style="color: #FF7670;border-color: #FF7670;" @click="resetBtn">重置</el-button>
        <el-button v-permission="['sys:collegeList:add']" type="primary" icon="el-icon-plus" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="collegeName" label="学院名称"></el-table-column>
      <el-table-column prop="orderNum" label="序号"></el-table-column>
      <el-table-column v-if="$checkPermission(['sys:collegeList:edit','sys:collegeList:delete'])" label="操作" align="center" width="280">
        <template slot-scope="scope">
          <el-button v-permission="['sys:collegeList:edit']" type="primary" size="small" icon="el-icon-edit" @click="editBtn(scope.row)">编辑</el-button>
          <el-button v-permission="['sys:collegeList:delete']" type="danger" size="small" icon="el-icon-delete" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page.sync="searchForm.currentPage"
      :page-sizes="[10,20,40,80,100]"
      :page-size="searchForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchForm.total"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- (新增或编辑)弹框组件 -->
    <sys-dialog
      :title="addDialog.title"
      :visible="addDialog.visible"
      :width="addDialog.width"
      :height="addDialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addForm"
          label-width="80px"
          size="small"
          :inline="false"
          style="margin-right: 40px"
        >
          <el-form-item prop="collegeName" :rules="Rules.isNull" label="学院名称">
            <el-input v-model="addModel.collegeName" placeholder="请输入学院名称"></el-input>
          </el-form-item>
          <el-form-item prop="orderNum" :rules="Rules.isNum" label="序号">
            <el-input v-model="addModel.orderNum" placeholder="请输入序号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import sysDialog from '@/components/Dialog/SysDialog'
import { addApi, listApi, editApi, deleteApi } from '@/api/college'
import Rules from '@/utils/rules'

export default {
  components: {
    sysDialog
  },
  data() {
    return {
      // 表格高度
      tableHeight: 0,
      // 表格数据
      tableList: [],
      // 表单绑定的数据对象
      addModel: {
        type: '',
        collegeId: '',
        collegeName: '',
        orderNum: ''
      },
      // (新增或编辑)表单验证规则
      Rules,
      // (新增或编辑)弹框属性
      addDialog: {
        title: '',
        visible: false,
        width: 650,
        height: 150
      },
      // 搜索表单的数据
      searchForm: {
        collegeName: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  methods: {
    // 页容量改变时触发
    sizeChange(val) {
      this.searchForm.pageSize = val
      this.getList()
    },
    // 页数改变时触发
    currentChange(val) {
      this.searchForm.currentPage = val
      this.getList()
    },
    // 编辑按钮
    editBtn(row) {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      // 显示弹框
      this.addDialog.title = '编辑学院'
      this.addDialog.visible = true
      // 回显数据
      this.$objCopy(row, this.addModel)
      // 设置为编辑
      this.addModel.type = '1'
    },
    // 删除按钮
    async deleteBtn(row) {
      // 信息确认
      const confirm = await this.$myConfirm('您确定删除该数据吗?')
      if (confirm) {
        const res = await deleteApi({ collegeId: row.collegeId })
        if (res && res.code === 200) {
          // 信息提示
          this.$message.success(res.msg)
          // 刷新列表
          this.getList()
        }
      }
    },
    // 获取表格列表
    async getList() {
      const res = await listApi(this.searchForm)
      if (res && res.code === 200) {
        console.log(res)
        this.tableList = res.data.records
        this.searchForm.total = res.data.total
      }
    },
    // (新增或编辑)弹框关闭
    onClose() {
      this.addDialog.visible = false
    },
    // (新增或编辑)弹框确定
    onConfirm() {
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          let res = null
          if (this.addModel.type === '0') {
            res = await addApi(this.addModel)
          } else {
            res = await editApi(this.addModel)
          }
          if (res && res.code === 200) {
            // 信息提示
            this.$message.success(res.msg)
            // 刷新表格
            this.getList()
            this.addDialog.visible = false
          }
        }
      })
    },
    // 搜索按钮
    searchBtn() {
      this.getList()
    },
    // 重置按钮
    resetBtn() {
      this.searchForm.collegeName = ''
      this.searchForm.currentPage = 1
      this.getList()
    },
    // 新增按钮
    addBtn() {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      // 设置弹框显示
      this.addDialog.title = '新增学院'
      this.addDialog.visible = true
      // 设置为新增
      this.addModel.type = '0'
    }
  }
}
</script>

<style scoped>
.el-main >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #9b0d14;
  color: #fff;
}
</style>
