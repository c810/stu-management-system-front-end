<template>
  <el-main>
    <!-- 搜索 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item label="活动名称">
        <el-input v-model="searchModel.eventName" placeholder="请输入活动名称"/>
      </el-form-item>
      <el-form-item label="活动类型">
        <el-select
          v-model="searchModel.eventType"
          placeholder="请选择活动类型"
        >
          <el-option label="文化庆典活动" value="cultural"></el-option>
          <el-option label="艺术娱乐活动" value="art"></el-option>
          <el-option label="会展及商贸活动" value="commercial"></el-option>
          <el-option label="体育赛事活动" value="sport"></el-option>
          <el-option label="教育科学活动" value="edu-sci"></el-option>
          <el-option label="休闲活动" value="leisure"></el-option>
          <el-option label="政治/政府活动" value="political"></el-option>
          <el-option label="私人活动" value="private"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学生学号">
        <el-input v-model="searchModel.stuNum" placeholder="请输入活动学生的学号"/>
      </el-form-item>
      <el-form-item  prop="eventStart" label="活动起始时间">
        <el-date-picker
          v-model="searchModel.eventStart"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="请选择活动起始时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item  prop="eventEnd" label="活动结束时间">
        <el-date-picker
          v-model="searchModel.eventEnd"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="请选择活动结束时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color:#FF7670;border-color: #FF7670;" icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button  icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="eventName" label="活动名称"/>
      <el-table-column prop="eventType" label="活动类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.eventType === 'cultural'" type="success" size="medium">文化庆典活动</el-tag>
          <el-tag v-if="scope.row.eventType === 'art'" type="danger" size="medium">艺术娱乐活动</el-tag>
          <el-tag v-if="scope.row.eventType === 'commercial'" type="primary" size="medium">会展及商贸活动</el-tag>
          <el-tag v-if="scope.row.eventType === 'sport'" type="info" size="medium">体育赛事活动</el-tag>
          <el-tag v-if="scope.row.eventType === 'edu-sci'" type="success" size="medium">教育科学活动</el-tag>
          <el-tag v-if="scope.row.eventType === 'leisure'" type="danger" size="medium">休闲活动</el-tag>
          <el-tag v-if="scope.row.eventType === 'political'" type="primary" size="medium">政治/政府活动</el-tag>
          <el-tag v-if="scope.row.eventType === 'private'" type="warning" size="medium">私人活动</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="stuNum" label="学生学号"/>
      <el-table-column prop="stuName" label="活动学生"/>
      <el-table-column prop="eventStart" label="活动起始时间"/>
      <el-table-column prop="eventEnd" label="活动结束时间"/>
      <el-table-column prop="eventResult" label="活动成果" />
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
          <el-form-item prop="eventName" label="活动名称">
            <el-input v-model="addModel.eventName"/>
          </el-form-item>
          <el-form-item label="活动类型">
            <el-select
              v-model="addModel.eventType"
              placeholder="请选择活动类型"
            >
              <el-option label="文化庆典活动" value="cultural"></el-option>
              <el-option label="艺术娱乐活动" value="art"></el-option>
              <el-option label="会展及商贸活动" value="commercial"></el-option>
              <el-option label="体育赛事活动" value="sport"></el-option>
              <el-option label="教育科学活动" value="edu-sci"></el-option>
              <el-option label="休闲活动" value="leisure"></el-option>
              <el-option label="政治/政府活动" value="political"></el-option>
              <el-option label="私人活动" value="private"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="stuNum" label="学生学号">
            <el-input v-model="addModel.stuNum"/>
          </el-form-item>
          <el-form-item prop="eventStart" label="活动起始时间">
            <el-date-picker
              v-model="addModel.eventStart"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="请选择活动起始时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="eventEnd" label="活动结束时间">
            <el-date-picker
              v-model="addModel.eventEnd"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="请选择活动结束时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动成果">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="addModel.eventResult">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>

  </el-main>
</template>

<script>
import { addApi, listApi, editApi, deleteApi } from '@/api/event'
import SysDialog from '@/components/Dialog/SysDialog'

export default {
  components: {
    SysDialog
  },
  data() {
    return {
      value: [],
      /* assign: {
        stuId: '',
        practiceId: ''
      },*/
      // 分配学生列表
      /* assignList: [],*/
      // 分配学生弹框属性
      /* assignDialog: {
        title: '',
        height: 350,
        width: 650,
        visible: false
      },*/
      tableHeight: 0,
      rules: {
        eventName: [
          {
            trigger: 'blur',
            required: true,
            message: '请填写活动名称'
          }
        ],
        eventType: [
          {
            trigger: 'blur',
            required: true,
            message: '请选择活动类型'
          }
        ],
        eventStart: [
          {
            trigger: 'blur',
            required: true,
            message: '请选择活动起始时间'
          }
        ],
        eventEnd: [
          {
            trigger: 'blur',
            required: true,
            message: '请选择活动结束时间'
          }
        ],
        stuNum: [
          {
            trigger: 'blur',
            required: true,
            message: '请填写学生学号'
          }
        ],
        eventResult: [
          {
            trigger: 'blur',
            required: true,
            message: '请填写活动成果'
          }
        ]
      },
      addModel: {
        type: '',
        eventId: '',
        eventName: '',
        eventType: '',
        stuId: '',
        stuNum: '',
        eventStart: '',
        eventEnd: '',
        eventResult: ''
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
        eventName: '',
        eventType: '',
        stuNum: '',
        eventStart: '',
        eventEnd: '',
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
          eventId: row.eventId
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
      this.addDialog.title = '编辑活动'
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
          console.log(this.addModel)
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
      this.addDialog.title = '新增活动'
      this.addDialog.visible = true
      this.addModel.type = '0'
    },
    resetBtn() {
      this.searchModel.eventName = ''
      this.searchModel.eventStart = ''
      this.searchModel.eventEnd = ''
      this.searchModel.eventType = ''
      this.searchModel.stuNum = ''
      this.getList()
    },
    searchBtn() {
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
