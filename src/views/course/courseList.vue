<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.courseName" placeholder="请输入课程名称"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color:#FF7670;border-color: #FF7670;" icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button v-permission="['sys:courseList:add']" icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="courseName" label="课程名称"/>
      <el-table-column prop="teacherName" label="授课教师">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.teacherId" type="success" size="small">{{ scope.row.teacherName }}</el-tag>
          <el-tag v-else type="danger" size="small">未分配</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="courseDesc" label="课程描述"/>
      <el-table-column v-if="$checkPermission(['sys:courseList:edit','sys:courseList:delete','sys:courseList:assignTeacher','sys:courseList:removeTeacher'])" label="操作" align="center" width="400">
        <template slot-scope="scope">
          <el-button v-permission="['sys:courseList:edit']" type="primary" icon="el-icon-edit" size="small" @click="editBtn(scope.row)">编辑</el-button>
          <el-button v-permission="['sys:courseList:assignTeacher']" type="success" icon="el-icon-edit" size="small" @click="assignBtn(scope.row)">分配教师</el-button>
          <el-button v-permission="['sys:courseList:removeTeacher']" v-if="scope.row.teacherId" type="warning" icon="el-icon-edit" size="small" @click="removeBtn(scope.row)">解除教师</el-button>
          <el-button v-permission="['sys:courseList:delete']" type="danger" icon="el-icon-delete" size="small" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page.sync="searchModel.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchModel.total"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- 新增或编辑弹框 -->
    <sys-dialog
      :title="addDialog.title"
      :height="addDialog.height"
      :width="addDialog.width"
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
          <el-form-item prop="courseName" label="课程名称">
            <el-input v-model="addModel.courseName"/>
          </el-form-item>
          <el-form-item label="课程描述">
            <el-input v-model="addModel.courseDesc"/>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
    <!-- 分配教师弹框 -->
    <sys-dialog
      :title="assignDialog.title"
      :visible="assignDialog.visible"
      :width="assignDialog.width"
      :height="assignDialog.height"
      @onClose="onAssignClose"
      @onConfirm="onAssignConfirm"
    >
      <div slot="content">
        <el-transfer
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入教师姓名"
          v-model="value"
          :props="{
            key: 'teacherId',
            label: 'teacherName'
          }"
          :data="assignList"
          @change="btnChange"
          @left-check-change="leftChange"
        ></el-transfer>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import { addApi, listApi, editApi, deleteApi, assignSaveApi, removeTeacherApi } from '@/api/course'
import { assignListApi } from '@/api/teacher'
import SysDialog from '@/components/Dialog/SysDialog'

export default {
  components: {
    SysDialog
  },
  data() {
    return {
      value: [],
      assign: {
        teacherId: '',
        courseId: ''
      },
      // 分配教师列表
      assignList: [],
      // 分配教师弹框属性
      assignDialog: {
        title: '',
        height: 350,
        width: 650,
        visible: false
      },
      tableHeight: 0,
      rules: {
        courseName: [
          {
            trigger: 'blur',
            required: true,
            message: '请填写课程名称'
          }
        ]
      },
      addModel: {
        type: '',
        courseId: '',
        courseName: '',
        courseDesc: ''
      },
      addDialog: {
        title: '',
        height: 150,
        width: 650,
        visible: false
      },
      searchModel: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        total: 0
      },
      tableList: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 230
    })
  },
  methods: {
    // 解除教师按钮
    async removeBtn(row) {
      const confirm = await this.$myConfirm('确定解除教师吗?')
      if (confirm) {
        const res = await removeTeacherApi({
          teacherId: row.teacherId,
          courseId: row.courseId
        })
        if (res && res.code === 200) {
          this.$message.success(res.msg)
          this.getList()
        }
      }
    },
    btnChange(select, index) {
      const item = this.value
      if (item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          for (let j = 0; j < select.length; j++) {
            if (item[i] !== select[j]) {
              item.splice(i, 1)
            }
          }
        }
      }
    },
    leftChange(item, index) {
      if (item.length > 0) {
        for (let i = 0; i < item.length; i++) {
          for (let j = 0; j < index.length; j++) {
            if (item[i] !== index[j]) {
              item.splice(i, 1)
            }
          }
        }
      }
    },
    filterMethod(query, item) {
      return item.teacherName.indexOf(query) > -1
    },
    // 分配教师弹框确定事件
    async onAssignConfirm() {
      if (this.value.length === 0) {
        this.$message.warning('请选择教师！')
        return
      }
      this.assign.teacherId = this.value[0]
      const res = await assignSaveApi(this.assign)
      if (res && res.code === 200) {
        this.$message.success(res.msg)
        this.getList()
        this.assignDialog.visible = false
      }
    },
    // 分配教师弹框关闭事件
    onAssignClose() {
      this.assignDialog.visible = false
    },
    // 分配教师
    async assignBtn(row) {
      this.value = []
      this.assign.courseId = row.courseId
      // 查询教师列表
      const res = await assignListApi()
      if (res && res.code === 200) {
        this.assignList = res.data
      }
      this.assignDialog.title = '为【' + row.courseName + '】课程分配教师'
      this.assignDialog.visible = true
    },
    async deleteBtn(row) {
      const confirm = await this.$myConfirm('确定删除该数据吗?')
      if (confirm) {
        const res = await deleteApi({
          courseId: row.courseId
        })
        if (res && res.code === 200) {
          this.$message.success(res.msg)
          this.getList()
        }
      }
    },
    editBtn(row) {
      this.$resetForm('addForm', this.addModel)
      this.$objCopy(row, this.addModel)
      this.addDialog.title = '编辑课程'
      this.addDialog.visible = true
      this.addModel.type = '1'
    },
    currentChange(val) {
      this.searchModel.currentPage = val
      this.getList()
    },
    sizeChange(val) {
      this.searchModel.pageSize = val
      this.getList()
    },
    // 获取列表
    async getList() {
      const res = await listApi(this.searchModel)
      if (res && res.code === 200) {
        this.tableList = res.data.records
        this.searchModel.total = res.data.total
      }
    },
    onConfirm() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let res = null
          if (this.addModel.type === '0') {
            res = await addApi(this.addModel)
          } else {
            res = await editApi(this.addModel)
          }
          if (res && res.code === 200) {
            this.$message.success(res.msg)
            this.getList()
            this.addDialog.visible = false
          }
        }
      })
    },
    onClose() {
      this.addDialog.visible = false
    },
    addBtn() {
      this.$resetForm('addForm', this.addModel)
      this.addDialog.title = '新增课程'
      this.addDialog.visible = true
      this.addModel.type = '0'
    },
    resetBtn() {
      this.searchModel.courseName = ''
      this.getList()
    },
    searchBtn() {
      this.getList()
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
