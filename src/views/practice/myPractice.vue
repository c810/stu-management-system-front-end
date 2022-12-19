<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item label="实践名称" >
        <el-input v-model="searchModel.practiceName" placeholder="请输入实践名称"/>
      </el-form-item>
      <el-form-item label="实践类型">
        <el-select
          v-model="searchModel.practiceType"
          placeholder="请选择实践类型"
        >
          <el-option label="物质生产实践" value="material"></el-option>
          <el-option label="社会政治实践" value="social"></el-option>
          <el-option label="科学文化实践" value="science"></el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="学生学号">
        <el-input v-model="searchModel.stuNum" placeholder="请输入实践学生的学号"/>
      </el-form-item>-->
      <el-form-item  prop="practiceTime" label="实践时间">
        <el-date-picker
          v-model="searchModel.practiceTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择实践时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color:#FF7670;border-color: #FF7670;" icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button  icon="el-icon-plus" type="primary" @click="addBtn ">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="practiceName" label="实践名称"/>
      <el-table-column prop="practiceType" label="实践类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.practiceType === 'material'" type="success" size="medium">物质生产实践</el-tag>
          <el-tag v-if="scope.row.practiceType === 'social'" type="danger" size="medium">社会政治实践</el-tag>
          <el-tag v-if="scope.row.practiceType === 'science'" type="primary" size="medium">科学文化实践</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column prop="stuNum" label="学生学号"/>
      <el-table-column prop="stuName" label="实践学生"/>-->
      <el-table-column prop="practiceTime" label="实践时间"/>
      <el-table-column prop="practiceResult" label="实践成果" />
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="editBtn(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteBtn(scope.row)">删除</el-button>
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
          <el-form-item prop="practiceName" label="实践名称">
            <el-input v-model="addModel.practiceName"/>
          </el-form-item>
          <el-form-item label="实践类型">
            <el-select
              v-model="addModel.practiceType"
              placeholder="请选择实践类型"
            >
              <el-option label="物质生产实践" value="material"></el-option>
              <el-option label="社会政治实践" value="social"></el-option>
              <el-option label="科学文化实践" value="science"></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item prop="stuNum" label="学生学号">
            <el-input
              placeholder="请输入内容"
              v-model="addModel.stuNum"
              :disabled="true"
            />
          </el-form-item>-->
          <el-form-item prop="practiceTime" label="实践时间">
            <el-date-picker
              v-model="addModel.practiceTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择实践时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="实践成果" >
            <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="addModel.practiceResult">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>

  </el-main>
</template>

<script>
import { addApi, listApi, editApi, deleteApi } from '@/api/practice'
import SysDialog from '@/components/Dialog/SysDialog'
import { getUserId } from '@/utils/auth'

export default {
  components: {
    SysDialog
  },
  data() {
    return {
      value: [],
      tableHeight: 0,
      /* dateTimeStartFunc: {
        disabledDate: time => {
          if (this.addModel.practiceTime) {
            // 不能大于当前日期
            return time.getTime() > Date.now() - 8.64e7// 加- 8.64e7则表示包当天
          }
        }
      },*/
      rules: {
        practiceName: [
          {
            trigger: 'blur',
            required: true,
            message: '请填写实践名称'
          }
        ],
        practiceType: [
          {
            trigger: 'blur',
            required: true,
            message: '请选择实践类型'
          }
        ],
        practiceTime: [
          {
            trigger: 'blur',
            required: true,
            message: '请选择实践时间'
          }
        ],
        practiceResult: [
          {
            trigger: 'blur',
            required: true,
            message: '请填写实践成果'
          }
        ]
      },
      practiceTime: {
        disabledDate: date => {
          if (date.getData() < Date.now()) {
            // 不能大于当前日期
            window.alert('不能大于当前时间！')
            return date.getTime() < Date.now() - 8.64e7// 加- 8.64e7则表示包当天
          }
        }
      },
      addModel: {
        type: '',
        practiceId: '',
        practiceName: '',
        practiceType: '',
        stuId: '',
        stuNum: '',
        practiceTime: '',
        practiceResult: ''
      },
      addDialog: {
        title: '',
        height: 350,
        width: 650,
        visible: false
      },
      searchModel: {
        currentPage: 1,
        pageSize: 10,
        practiceName: '',
        practiceType: '',
        stuNum: '',
        practiceTime: '',
        stuId: getUserId(),
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
    // 解除学生按钮
    /* async removeBtn(row) {
      const confirm = await this.$myConfirm('确定解除学生吗?')
      if (confirm) {
        const res = await removeStudentApi({
          stuId: row.stuId,
          practiceId: row.practiceId
        })
        if (res && res.code === 200) {
          this.$message.success(res.msg)
          this.getList()
        }
      }
    },*/
    /* btnChange(select, index) {
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
    },*/
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
      return item.stuName.indexOf(query) > -1
    },
    // 分配学生弹框确定事件
    /* async onAssignConfirm() {
      if (this.value.length === 0) {
        this.$message.warning('请选择学生！')
        return
      }
      this.assign.stuId = this.value[0]
      const res = await assignSaveApi(this.assign)
      if (res && res.code === 200) {
        this.$message.success(res.msg)
        this.getList()
        this.assignDialog.visible = false
      }
    },*/
    // 分配学生弹框关闭事件
    /* onAssignClose() {
      this.assignDialog.visible = false
    },
    // 分配学生
    async assignBtn(row) {
      this.value = []
      this.assign.practiceId = row.practiceId
      // 查询学生列表
      const res = await assignListApi()
      if (res && res.code === 200) {
        this.assignList = res.data
      }
      this.assignDialog.title = '为【' + row.practiceName + '】课程分配学生'
      this.assignDialog.visible = true
    },*/
    async deleteBtn(row) {
      const confirm = await this.$myConfirm('确定删除该数据吗?')
      if (confirm) {
        const res = await deleteApi({
          practiceId: row.practiceId
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
      this.addDialog.title = '编辑实践'
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
      this.searchModel.stuId = getUserId()
      console.log(this.searchModel)
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
          console.log(this.addModel)
          this.addModel.stuId = getUserId()
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
      this.addModel.stuId = getUserId()
      this.addDialog.title = '新增实践'
      this.addDialog.visible = true
      this.addModel.type = '0'
    },
    resetBtn() {
      this.searchModel.practiceName = ''
      this.searchModel.practiceTime = ''
      this.searchModel.practiceType = ''
      this.searchModel.stuNum = ''
      this.getList()
    },
    searchBtn() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
