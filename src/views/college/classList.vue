<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchForm" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchForm.collegeName" placeholder="请输入学院名称" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.majorName" placeholder="请输入专业名称" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.className" placeholder="请输入班级名称" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button icon="el-icon-close" style="color: #ff7670" @click="resetBtn">重置</el-button>
        <el-button v-permission="['sys:classList:add']" icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="className" label="班级名称" />
      <el-table-column prop="classYear" label="招生年份" />
      <el-table-column prop="collegeName" label="所属学院" />
      <el-table-column prop="majorName" label="所属专业" />
      <el-table-column prop="orderNum" label="序号" />
      <el-table-column v-if="$checkPermission(['sys:classList:edit','sys:classList:delete'])" label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button
            v-permission="['sys:classList:edit']"
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="editBtn(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-permission="['sys:classList:delete']"
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="deleteBtn(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page.sync="searchForm.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="searchForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchForm.total"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
    />

    <!-- 新增弹框 -->
    <sys-dialog
      :title="addDialog.title"
      :width="addDialog.width"
      :height="addDialog.height"
      :visible="addDialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          ref="addForm"
          :model="addModel"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <el-form-item prop="collegeId" label="所属学院">
            <el-select
              v-model="addModel.collegeId"
              style="width: 98%"
              placeholder="请选择"
              @change="selectChange"
            >
              <el-option
                v-for="item in collegeList"
                :key="item.collegeId"
                :label="item.collegeName"
                :value="item.collegeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="majorId" label="所属专业">
            <el-select
              v-model="addModel.majorId"
              style="width: 98%"
              placeholder="请选择专业"
            >
              <el-option
                v-for="item in majorList"
                :key="item.majorId"
                :label="item.majorName"
                :value="item.majorId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称" prop="className">
            <el-input v-model="addModel.className" style="width: 98%" />
          </el-form-item>
          <el-form-item label="招录年份" prop="classYear">
            <el-date-picker
              v-model="addModel.classYear"
              value-format="yyyy"
              style="width: 98%"
              type="year"
              placeholder="请选择年份"
            />
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="addModel.orderNum" style="width: 98%" />
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import sysDialog from '@/components/Dialog/SysDialog'
import { getCollegeApi } from '@/api/major.js'
import {
  getMajorListApi,
  addApi,
  listApi,
  getMajorApi,
  editApi,
  deleteApi
} from '@/api/classes.js'

export default {
  components: {
    sysDialog
  },
  data() {
    return {
      // 表格高度
      tableHeight: 0,
      // 表单验证规则
      rules: {
        collegeId: [
          {
            trigger: 'blur',
            required: true,
            message: '请选择学院'
          }
        ],
        majorId: [
          {
            trigger: 'blur',
            required: true,
            message: '请选专业'
          }
        ],
        className: [
          {
            trigger: 'blur',
            required: true,
            message: '请填写班级名称'
          }
        ],
        classYear: [
          {
            trigger: 'blur',
            required: true,
            message: '请选择年份'
          }
        ]
      },
      // 表单数据
      addModel: {
        type: '',
        collegeId: '',
        classId: '',
        majorId: '',
        className: '',
        classYear: '',
        orderNum: ''
      },
      // 弹框属性
      addDialog: {
        title: '',
        width: 650,
        height: 260,
        visible: false
      },
      // 搜索参数
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        collegeName: '',
        majorName: '',
        className: '',
        total: 0
      },
      // 学院列表
      collegeList: [],
      // 专业列表
      majorList: [],
      // 表格数据
      tableList: []
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
    // 页数改变时触发
    currentChange(val) {
      this.searchForm.currentPage = val
      this.getList()
    },
    // 页容量改变时触发
    sizeChange(val) {
      this.searchForm.pageSize = val
      this.getList()
    },
    // 删除按钮
    async deleteBtn(row) {
      // 信息确认
      const confirm = await this.$myConfirm('确定删除该数据吗?')
      if (confirm) {
        const res = await deleteApi({
          classId: row.classId
        })
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
      // 获取学院列表
      this.getCollegeList()
      // 设置回显树数据
      this.$objCopy(row, this.addModel)
      this.getMajor(row.majorId)
      // 设置弹框属性
      this.addDialog.title = '编辑班级'
      this.addDialog.visible = true
      this.addModel.type = '1'
    },
    // 查询学院id
    async getMajor(majorId) {
      const res = await getMajorApi({
        majorId: majorId
      })
      if (res && res.code === 200) {
        this.addModel.collegeId = res.data.collegeId
        this.getMajorList(this.addModel.collegeId)
      }
    },
    // 获取表格数据
    async getList() {
      const res = await listApi(this.searchForm)
      if (res && res.code === 200) {
        console.log(res)
        // 设置表格数据
        this.tableList = res.data.records
        // 设置分页总条数
        this.searchForm.total = res.data.total
      }
    },
    // 新增按钮
    addBtn() {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      // 获取学院列表
      this.getCollegeList()
      // 设置弹框属性
      this.addDialog.title = '新增班级'
      this.addDialog.visible = true
      this.addModel.type = '0'
    },
    // 重置按钮
    resetBtn() {
      this.searchForm.currentPage = 1
      this.searchForm.collegeName = ''
      this.searchForm.majorName = ''
      this.searchForm.className = ''
      this.getList()
    },
    // 搜索按钮
    searchBtn() {
      this.getList()
    },
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
    onClose() {
      this.addDialog.visible = false
    },
    selectChange(val) {
      // 清空原来的数据
      this.addModel.majorId = ''
      console.log(val)
      this.getMajorList(val)
    },
    // 根据学院id获取专业列表
    async getMajorList(collegeId) {
      const res = await getMajorListApi({ collegeId: collegeId })
      if (res && res.code === 200) {
        console.log(res)
        this.majorList = res.data
      }
    },
    // 获取学院列表
    async getCollegeList() {
      const res = await getCollegeApi()
      if (res && res.code === 200) {
        this.collegeList = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
