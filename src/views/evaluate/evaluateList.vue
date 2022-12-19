<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input
          v-model="searchModel.teacherName"
          placeholder="请输入教师姓名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button icon="el-icon-close" @click="resetBtn" style="color:#FF7670;border-color: #FF7670;">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column align="center" prop="teacherName" label="授课教师"></el-table-column>
      <el-table-column align="center" prop="courseName" label="课程名称"></el-table-column>
      <el-table-column align="center" width="300px" label="操作">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.stuId" type="primary" size="small" icon="el-icon-edit"
                     @click="evaluateBtn(scope.row)"
          >评价教师
          </el-button>
          <el-tag v-if="scope.row.stuId" type="success">已评价</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page.sync="searchModel.currentPage"
      :page-sizes="[10, 20, 40, 80, 100]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchModel.total"
      background
    >
    </el-pagination>
    <!-- 新增或编辑弹框组件 -->
    <sys-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :width="dialog.width"
      :height="dialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="evaluateModel"
          ref="evaluateForm"
          :rules="rules"
          label-width="80px"
          size="small"
          style="margin-right: 40px"
        >
          <el-row class="star">
            <el-col :span="12" :offset="0">
              <el-form-item prop="teachLevel" label="教学水平">
                <el-rate
                  v-model="evaluateModel.teachLevel"
                  :colors="colors"
                  show-score
                  text-color="#ff9900"
                >
                </el-rate>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="reaction" label="课堂互动">
                <el-rate
                  v-model="evaluateModel.reaction"
                  :colors="colors"
                  show-score
                  text-color="#ff9900"
                >
                </el-rate>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="star">
            <el-col :span="12" :offset="0">
              <el-form-item prop="attitude" label="教学态度">
                <el-rate
                  v-model="evaluateModel.attitude"
                  :colors="colors"
                  show-score
                  text-color="#ff9900"
                >
                </el-rate>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="homework" label="作业布置">
                <el-rate
                  v-model="evaluateModel.homework"
                  :colors="colors"
                  show-score
                  text-color="#ff9900"
                >
                </el-rate>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="star" :span="12" :offset="0">
              <el-form-item prop="bookChosen" label="教材选择">
                <el-rate
                  v-model="evaluateModel.bookChosen"
                  :colors="colors"
                  show-score
                  text-color="#ff9900"
                >
                </el-rate>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="recommend" label="推荐评优">
                <el-radio-group v-model="evaluateModel.recommend">
                  <el-radio :label="'1'">推荐</el-radio>
                  <el-radio :label="'0'">不推荐</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item prop="advice" label="建议">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                placeholder="请输入建议"
                v-model="evaluateModel.advice"
              ></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import { getTeacherListApi, addApi, getEvaluateByStuIdApi, isEvaluatedApi } from '@/api/evaluate'
import { getUserId } from '@/utils/auth'
import SysDialog from '@/components/Dialog/SysDialog'
import { getTeacherByIdApi } from '@/api/teacher'

export default {
  components: {
    SysDialog
  },
  data() {
    var check = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('评分不能为空'))
      }
    }
    return {
      // 评分颜色: 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      evaluateModel: {
        teacherId: '',
        teachLevel: '0',
        reaction: '0',
        bookChosen: '0',
        homework: '0',
        attitude: '0',
        recommend: '',
        advice: '',
        stuId: getUserId()
        // evaluateDate: ''
      },
      dialog: {
        title: '',
        visible: false,
        width: 630,
        height: 250
      },
      tableHeight: 0,
      searchModel: {
        teacherName: '',
        currentPage: 1,
        pageSize: 10,
        stuId: getUserId(),
        total: 0
      },
      tableList: [],
      // 表单验证规则
      rules: {
        teachLevel: [{
          trigger: 'blur',
          required: true,
          validator: check
        }],
        reaction: [{
          trigger: 'blur',
          required: true,
          validator: check
        }],
        homework: [{
          trigger: 'blur',
          required: true,
          validator: check
        }],
        attitude: [{
          trigger: 'blur',
          required: true,
          validator: check
        }],
        bookChosen: [{
          trigger: 'blur',
          required: true,
          validator: check
        }],
        recommend: [{
          trigger: 'blur',
          required: true,
          message: '请选择是否推荐该老师参加评优'
        }],
        advice: [{
          trigger: 'blur',
          required: true,
          message: '请输入建议'
        }]
      },
      evaluateList: [],
      getOneTeacher: {
        teacherId: '',
        unreadMessage: 0
      }
    }
  },
  created() {
    getUserId()
    this.getTeacherList()
    this.getEvaluateList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  methods: {
    // 获取教师
    async getTeacher(val) {
      const res = await getTeacherByIdApi({ teacherId: val })
      if (res && res.code === 200) {
        console.log('------------------------')
        console.log(res)
        this.getOneTeacher = res.data
        console.log(this.getOneTeacher)
        /* this.getOneTeacher.teacherId = val
        this.getOneTeacher.unreadMessage = res.data.unreadMessage */
      }
    },
    async getEvaluateList() {
      const res = await getEvaluateByStuIdApi({ stuId: getUserId() })
      if (res && res.code === 200) {
        console.log('######################')
        console.log(res)
        this.evaluateList = res.data
        console.log(this.evaluateList[0].teacherId)
      }
    },
    onClose() {
      this.dialog.visible = false
    },
    async onConfirm() {
      // 信息确认
      const confirm = await this.$myConfirm('确定提交评价吗？提交后不可修改!')
      if (confirm) {
        // this.$refs.evaluateForm.validate(async(valid) => {
        //   if (valid) {
        console.log(this.evaluateModel)
        const res = await addApi(this.evaluateModel)
        if (res && res.code === 200) {
          /* this.getTeacher(this.evaluateModel.teacherId)
          console.log('***********************')
          console.log(this.evaluateModel.teacherId)
          console.log(this.getOneTeacher) */
          const res2 = await isEvaluatedApi(this.getOneTeacher)
          if (res2 && res2.code === 200) {
            // this.$message.success(res2.msg)
            // 提示信息
            this.$message.success(res.msg)
            // 刷新列表
            this.getTeacherList()
            this.dialog.visible = false
          }
        }
        // }
        // })
      }
    },
    evaluateBtn(val) {
      /* this.evaluateList.forEach(function(value, index) {
        if (value.teacherId === val.teacherId) {
          const confirm = await this.$myConfirm('已评价过该教师,不能重复评价!')
          if(confirm){
            return
          }
          return
        }
      }) */
      console.log('===========================')
      console.log(val)
      // 清空表单
      this.$resetForm('evaluateForm', this.evaluateModel)
      this.dialog.title = '评价【' + val.teacherName + '】教师'
      this.dialog.visible = true
      this.evaluateModel.teacherId = val.teacherId
      this.evaluateModel.stuId = getUserId()
      this.getTeacher(val.teacherId)
    },
    searchBtn() {
      this.getTeacherList()
    },
    resetBtn() {
      this.searchModel.teacherName = ''
      this.getTeacherList()
    },
    currentChange(val) {
      this.searchModel.currentPage = val
      this.getTeacherList()
    },
    sizeChange(val) {
      this.searchModel.pageSize = val
      this.getTeacherList()
    },
    async getTeacherList() {
      const res = await getTeacherListApi(this.searchModel)
      if (res && res.code === 200) {
        console.log(res)
        console.log(this.searchModel.stuId)
        this.tableList = res.data.records
        this.searchModel.total = res.data.total
        /* this.evaluateList.forEach(function(value, index) {
          if (value.teacherId) {
          }
        }) */
      }
    }
  }
}
</script>

<style scoped>
.star >>> .el-rate {
  height: 20px;
  line-height: 1;
  margin-top: 5px;
}

.star >>> .el-rate__text {
  margin-left: 5px;
}

.el-main >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #9b0d14;
  color: #fff;
}
</style>
