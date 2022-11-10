<template>
  <el-main>
    <el-form :model="searchForm" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchForm.collegeName" placeholder="请输入学院名称"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.majorName" placeholder="请输入专业名称"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button icon="el-icon-close" style="color: #FF7670;border-color: #FF7670;" @click="resetBtn">重置</el-button>
        <el-button v-permission="['sys:majorList:add']" type="primary" icon="el-icon-plus" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="majorName" label="专业名称"/>
      <el-table-column prop="collegeName" label="学院名称"/>
      <el-table-column prop="orderNum" label="序号"/>
      <el-table-column v-if="$checkPermission(['sys:majorList:edit','sys:majorList:delete'])" label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button v-permission="['sys:majorList:edit']" type="primary" size="small" icon="el-icon-edit" @click="editBtn(scope.row)">编辑</el-button>
          <el-button v-permission="['sys:majorList:delete']" type="danger" size="small" icon="el-icon-delete" @click="deleteBtn(scope.row)">删除</el-button>
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
    <!-- 新增或编辑弹框组件 -->
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
          :rules="rules"
          label-width="80px"
          size="small"
          style="margin-right: 40px"
        >
          <el-form-item prop="collegeId" label="所属学院">
            <el-select v-model="addModel.collegeId" style="width: 100%" placeholder="请选择">
              <el-option
                v-for="item in collegeList"
                :key="item.collegeId"
                :label="item.collegeName"
                :value="item.collegeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="专业名称" prop="majorName">
            <el-input v-model="addModel.majorName"/>
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="addModel.orderNum"/>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import SysDialog from '@/components/Dialog/SysDialog'
import { getCollegeApi, addApi, getListApi, editApi, deleteApi } from '@/api/major'

export default {
  components: {
    SysDialog
  },
  data() {
    return {
      tableHeight: 0,
      tableList: [],
      // 表单验证规则
      rules: {
        collegeId: [{
          trigger: 'blur',
          required: true,
          message: '请选择学院'
        }],
        majorName: [{
          trigger: 'blur',
          required: true,
          message: '请输入专业名称'
        }]
      },
      // 新增表单绑定的数据对象
      addModel: {
        type: '',
        majorId: '',
        collegeId: '',
        majorName: '',
        orderNum: ''
      },
      // 学院数据
      collegeList: [],
      // 弹框属性
      addDialog: {
        title: '',
        visible: false,
        width: 630,
        height: 180
      },
      // 搜索表单的数据
      searchForm: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        collegeName: '',
        majorName: ''
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
    // 页容量大小改变时触发
    sizeChange(val) {
      this.searchForm.pageSize = val
      this.getList()
    },
    // 页面改变时触发
    currentChange(val) {
      this.searchForm.currentPage = val
      this.getList()
    },
    // 删除按钮
    async deleteBtn(row) {
      // 信息提示
      const confirm = this.$myConfirm('确定删除该数据吗?')
      if (confirm) {
        const res = await deleteApi({ majorId: row.majorId })
        if (res && res.code === 200) {
          // 信息提示
          this.$message.success(res.msg)
          // 刷新列表
          this.getList()
        }
      }
    },
    // 编辑按钮
    editBtn(row) {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      // 把编辑的数据复制到表单绑定的对象
      this.$objCopy(row, this.addModel)
      // 设置弹框属性
      this.addDialog.title = '编辑专业'
      this.addDialog.visible = true
      // 设置编辑
      this.addModel.type = '1'
      // 获取学院列表数据
      this.getCollege()
    },
    // 获取列表数据
    async getList() {
      const res = await getListApi(this.searchForm)
      if (res && res.code === 200) {
        // 设置表格数据
        this.tableList = res.data.records
        // 设置分页总条数
        this.searchForm.total = res.data.total
      }
    },
    // 获取学院列表
    async getCollege() {
      const res = await getCollegeApi()
      if (res && res.code === 200) {
        this.collegeList = res.data
      }
    },
    // 弹框关闭
    onClose() {
      this.addDialog.visible = false
    },
    // 弹框确定
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
            // 刷新列表
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
      this.searchForm.majorName = ''
      this.getList()
    },
    // 新增按钮
    addBtn() {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      // 设置弹框属性
      this.addDialog.title = '新增专业'
      this.addDialog.visible = true
      // 设置新增
      this.addModel.type = '0'
      // 获取学院列表数据
      this.getCollege()
    }
  }
}
</script>

<style scoped>

</style>
