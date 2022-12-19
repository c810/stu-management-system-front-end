<template>
  <el-main>
    <el-form :model="searchModel" :inline="true" size="small">
      <el-row>
        <el-form-item label="学院">
          <el-select
            v-model="searchModel.collegeId"
            placeholder="请选择学院"
            @change="searchCollegeChange"
          >
            <el-option
              v-for="item in searchCollegeList"
              :key="item.collegeId"
              :label="item.collegeName"
              :value="item.collegeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select
            v-model="searchModel.majorId"
            placeholder="请选择专业"
            @change="searchMajorChange"
          >
            <el-option
              v-for="item in searchMajorList"
              :key="item.majorId"
              :label="item.majorName"
              :value="item.majorId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select
            v-model="searchModel.classId"
            placeholder="请选择班级"
            @change="searchClassChange"
          >
            <el-option
              v-for="item in searchClassList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模糊">
          <el-input v-model="searchModel.collegeName" placeholder="请输入学院名称"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchModel.majorName" placeholder="请输入专业名称"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchModel.className" placeholder="请输入班级名称"/>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="学生姓名">
          <el-input v-model="searchModel.stuName" placeholder="请输入学生姓名"/>
        </el-form-item>
        <el-form-item prop="intoTime" label="入学时间">
          <el-date-picker
            v-model="searchModel.intoTime"
            type="month"
            value-format="yyyy-MM"
            placeholder="请选择入学时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
          <el-button icon="el-icon-close" style="color: #FF7670;border-color: #FF7670;" @click="resetBtn">重置
          </el-button>
          <el-button v-permission="['sys:stuList:add']" type="primary" icon="el-icon-plus" @click="addBtn">新增
          </el-button>
          <el-button type="success" size="small" icon="el-icon-bottom"
                     @click="exportStu()"
          >
            下载模板
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            action=""
            :auto-upload="true"
            :multiple="false"
            :show-file-list="false"
            :http-request="importStu"
            :file-list="fileList"
          >
            <el-button type="warning" size="small" icon="el-icon-plus">导入学生</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-bottom"
                     @click="getStuInfo()"
          >
            导出学生
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="stuName" label="姓名"/>
      <el-table-column prop="stuNum" label="学号"/>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex === '0'" type="blue" size="small">男</el-tag>
          <el-tag v-if="scope.row.sex === '1'" type="danger" size="small">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话"/>
      <el-table-column prop="intoTime" label="入学时间"/>
      <el-table-column prop="collegeName" label="学院"/>
      <el-table-column prop="majorName" label="专业"/>
      <el-table-column prop="className" label="班级"/>
      <el-table-column v-if="$checkPermission(['sys:stuList:edit','sys:stuList:delete','sys:stuList:reset'])"
                       label="操作" align="center" width="320"
      >
        <template slot-scope="scope">
          <el-button v-permission="['sys:stuList:edit']" type="primary" size="small" icon="el-icon-edit"
                     @click="editBtn(scope.row)"
          >编辑
          </el-button>
          <el-button v-permission="['sys:stuList:reset']" type="warning" size="small" icon="el-icon-delete"
                     @click="resetPwdBtn(scope.row)"
          >重置密码
          </el-button>
          <el-button v-permission="['sys:stuList:delete']" type="danger" size="small" icon="el-icon-delete"
                     @click="deleteBtn(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page.sync="searchModel.currentPage"
      :page-sizes="[10,20,40,80,100]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchModel.total"
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
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="collegeId" :rules="Rules.select" label="所属学院">
                <el-select
                  v-model="addModel.collegeId"
                  placeholder="请选择学院"
                  @change="collegeChange"
                >
                  <el-option
                    v-for="item in collegeList"
                    :key="item.collegeId"
                    :label="item.collegeName"
                    :value="item.collegeId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="majorId" :rules="Rules.select" label="所属专业">
                <el-select
                  v-model="addModel.majorId"
                  placeholder="请选择专业"
                  @change="majorChange"
                >
                  <el-option
                    v-for="item in majorList"
                    :key="item.majorId"
                    :label="item.majorName"
                    :value="item.majorId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="classId" :rules="Rules.select" label="所属班级">
                <el-select
                  v-model="addModel.classId"
                  placeholder="请选择班级"
                >
                  <el-option
                    v-for="item in classList"
                    :key="item.classId"
                    :label="item.className"
                    :value="item.classId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="roleId" :rules="Rules.select" label="角色">
                <el-select
                  v-model="addModel.roleId"
                  placeholder="请选择角色"
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="stuName" :rules="Rules.isNull" label="姓名">
                <el-input v-model="addModel.stuName" placeholder="请输入姓名"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="sex" :rules="Rules.sex" label="性别">
                <el-radio-group v-model="addModel.sex">
                  <el-radio :label="'0'">男</el-radio>
                  <el-radio :label="'1'">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="phone" :rules="Rules.phone" label="电话">
                <el-input v-model="addModel.phone" placeholder="请输入电话"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="intoTime" :rules="Rules.time" label="入学时间">
                <el-date-picker
                  v-model="addModel.intoTime"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="请选择入学时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="stuNum" label="学号">
                <el-input v-model="addModel.stuNum" :disabled="true" placeholder="请输入学号"/>
              </el-form-item>
            </el-col>
            <el-col v-if="addModel.type === '0'" :span="12" :offset="0">
              <el-form-item prop="password" label="密码">
                <el-input v-model="addModel.password" :disabled="true" placeholder="请输入密码"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import SysDialog from '@/components/Dialog/SysDialog'
import { getCollegeApi } from '@/api/major'
import { getMajorListApi } from '@/api/classes'
import {
  getClassListApi,
  getRoleListApi,
  addApi,
  getListApi,
  editApi,
  deleteApi,
  getByIdApi,
  getRoleByIdApi,
  resetPasswordApi,
  importStuInfoApi
} from '@/api/student'
import Rules from '@/utils/rules'

export default {
  components: {
    SysDialog
  },
  data() {
    return {
      fileList: [],
      // 搜索班级数据
      searchClassList: [],
      // 搜索专业数据
      searchMajorList: [],
      // 搜索学院数据
      searchCollegeList: [],
      // 表格高度
      tableHeight: 0,
      // 表格数据
      tableList: [],
      // 角色数据
      roleList: [],
      // 班级数据
      classList: [],
      // 专业数据
      majorList: [],
      // 学院数据
      collegeList: [],
      // 表单验证规则
      Rules,
      // 弹框表单绑定对象
      addModel: {
        type: '',
        stuId: '',
        roleId: '',
        collegeId: '',
        majorId: '',
        classId: '',
        stuName: '',
        sex: '',
        phone: '',
        intoTime: '',
        stuNum: '',
        password: ''
      },
      // 弹框属性
      addDialog: {
        title: '',
        visible: false,
        width: 650,
        height: 260
      },
      // 搜索绑定数据
      searchModel: {
        intoTime: '',
        total: 0,
        currentPage: 1,
        pageSize: 10,
        collegeId: '',
        collegeName: '',
        majorId: '',
        majorName: '',
        classId: '',
        className: '',
        stuName: ''
      }
    }
  },
  created() {
    this.getRoleList()
    this.getList()
    this.getSearchCollegeList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 270
    })
  },
  methods: {
    // 导入学生
    async importStu(param) {
      // 判断是否选择了班级
      if (!this.searchModel.classId) {
        this.$message.warning('请选择班级!')
        return false
      }
      // 判断是否选择了入学年份
      if (!this.searchModel.intoTime) {
        this.$message.warning('请选择入学年份!')
        return false
      }
      const file = param.file
      // 通过split方法和fileArr方法获取到文件的后缀名
      const fileArr = file.name.split('.')
      const suffix = fileArr[fileArr.length - 1]
      // 只能导入.xls和.xlsx文件
      if (!/(xls|xlsx)/i.test(suffix)) {
        this.$message.warning('文件格式不正确')
        return false
      }
      // 不能导入大小超过2Mb的文件
      if (file.size > 2 * 1024 * 1024) {
        this.$message('文件过大,请上传小于2MB的文件〜')
        return false
      }
      const formData = new FormData()
      formData.append('file', file)
      formData.append('classId', this.searchModel.classId)
      formData.append('collegeId', this.searchModel.collegeId)
      formData.append('intoTime', this.searchModel.intoTime)
      const res = await importStuInfoApi(formData)
      if (res && res.code === 200) {
        this.$message.success(res.msg)
        this.getList()
      }
    },
    // 导出学生
    getStuInfo() {
      // 判断是否选择了班级
      if (!this.searchModel.classId) {
        this.$message.warning('请选择班级!')
        return false
      }
      const abtn = document.createElement('a')
      // 文件id
      abtn.href = process.env.VUE_APP_BASE_API_PRO + '/api/student/exportStuInfo?classId=' + this.searchModel.classId
      abtn.click()
    },
    // 下载模板
    exportStu() {
      const abtn = document.createElement('a')
      // 文件id
      abtn.href = process.env.VUE_APP_BASE_API_PRO + '/api/student/importStuTemplate'
      abtn.click()
    },
    // 重置密码按钮
    async resetPwdBtn(row) {
      // 信息确认
      const confirm = await this.$myConfirm('确定重置密码吗?【重置后密码为123456】')
      if (confirm) {
        const para = {
          stuId: row.stuId,
          password: '123456'
        }
        const res = await resetPasswordApi(para)
        if (res && res.code === 200) {
          this.$message.success(res.msg)
        }
      }
    },
    // 搜索选择班级时触发(解决select清空之后不能选择的问题)
    searchClassChange() {
      this.$forceUpdate()
    },
    // 选择班级列表
    async getSearchClassList(majorId) {
      const res = await getClassListApi({ majorId: majorId })
      if (res && res.code === 200) {
        this.searchClassList = res.data
      }
    },
    // 搜索选择专业时触发
    searchMajorChange(val) {
      this.searchModel.classId = ''
      this.getSearchClassList(val)
    },
    // 选择专业列表
    async getSearchMajorList(collegeId) {
      const res = await getMajorListApi({ collegeId: collegeId })
      if (res && res.code === 200) {
        this.searchMajorList = res.data
      }
    },
    // 搜索选择学院时触发
    searchCollegeChange(val) {
      this.searchModel.majorId = ''
      this.searchModel.classId = ''
      this.searchMajorList = []
      this.searchClassList = []
      this.getSearchMajorList(val)
    },
    // 选择学院列表
    async getSearchCollegeList() {
      const res = await getCollegeApi()
      if (res && res.code === 200) {
        this.searchCollegeList = res.data
      }
    },
    // 页面改变时触发
    currentChange(val) {
      this.searchModel.currentPage = val
      this.getList()
    },
    // 页容量改变时触发
    sizeChange(val) {
      this.searchModel.pageSize = val
      this.getList()
    },
    // 删除按钮
    async deleteBtn(row) {
      // 信息确认
      const confirm = await this.$myConfirm('确定删除该数据吗?')
      if (confirm) {
        const res = await deleteApi({ stuId: row.stuId })
        if (res && res.code === 200) {
          // 信息提示
          this.$message.success(res.msg)
          // 刷新列表
          this.getList()
        }
      }
    },
    // 编辑按钮
    async editBtn(row) {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      // 加载学院列表
      this.getCollegeList()
      // 根据id查询回显的数据
      const res = await getByIdApi({ stuId: row.stuId })
      if (res && res.code === 200) {
        this.$objCopy(res.data, this.addModel)
        this.getMajorList(this.addModel.collegeId)
        this.getClassList(this.addModel.majorId)
        this.getRoleId(this.addModel.stuId)
      }
      console.log(this.addModel)
      // 设置弹框属性
      this.addDialog.title = '编辑学生'
      this.addDialog.visible = true
      // 设置编辑
      this.addModel.type = '1'
      // 防止在浏览器中获取到密码
      this.addModel.password = ''
    },
    // 获取角色id
    async getRoleId(stuId) {
      const res = await getRoleByIdApi({ stuId: stuId })
      if (res && res.code === 200) {
        this.addModel.roleId = res.data.roleId
      }
    },
    // 获取表格列表
    async getList() {
      const res = await getListApi(this.searchModel)
      if (res && res.code === 200) {
        this.tableList = res.data.records
        this.searchModel.total = res.data.total
      }
    },
    // 获取角色列表
    async getRoleList() {
      const res = await getRoleListApi()
      if (res && res.code === 200) {
        this.roleList = res.data
      }
    },
    // 专业选择事件
    majorChange(val) {
      this.addModel.classId = ''
      this.getClassList(val)
    },
    // 根据专业id获取班级列表
    async getClassList(majorId) {
      const res = await getClassListApi({ majorId: majorId })
      if (res && res.code === 200) {
        this.classList = res.data
      }
    },
    // 学院选择事件
    collegeChange(val) {
      this.addModel.majorId = ''
      this.addModel.classId = ''
      this.getMajorList(val)
    },
    // 根据学院id获取专业列表
    async getMajorList(collegeId) {
      const res = await getMajorListApi({ collegeId: collegeId })
      if (res && res.code === 200) {
        this.majorList = res.data
      }
    },
    // 学院列表
    async getCollegeList() {
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
            // 提示信息
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
      this.searchModel.collegeId = ''
      this.searchModel.majorId = ''
      this.searchModel.classId = ''
      this.searchModel.collegeName = ''
      this.searchModel.majorName = ''
      this.searchModel.className = ''
      this.searchModel.stuName = ''
      this.searchModel.currentPage = 1
      this.searchModel.intoTime = ''
      this.getList()
    },
    // 新增按钮
    addBtn() {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      // 加载学院列表
      this.getCollegeList()
      // 设置弹框属性
      this.addDialog.title = '新增学生'
      this.addDialog.visible = true
      // 设置新增
      this.addModel.type = '0'
      this.addModel.password = '123456'
      this.addModel.stuNum = '自动生成'
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
