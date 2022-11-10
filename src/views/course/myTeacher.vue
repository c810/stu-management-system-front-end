<template>
  <el-main>
    <!--搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input
          v-model="searchModel.courseName"
          placeholder="请输入课程名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button icon="el-icon-close" style="color:#FF7670;border-color: #FF7670;" @click="resetBtn">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column
        align="center"
        prop="courseName"
        label="课程名称"
      />
      <el-table-column
        align="center"
        prop="courseYear"
        label="开课年份"
      />
      <el-table-column align="center" prop="courseName" label="课程名称">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '0'" type="success" size="small">春季</el-tag>
          <el-tag v-if="scope.row.type === '1'" type="warning" size="small">秋季</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="className"
        label="班级"
      />
      <el-table-column
        align="center"
        prop="classYear"
        label="招生年份"
      />
      <el-table-column align="center" label="操作" width="230">
        <template slot-scope="scope">
          <div class="mybtn">
            <el-button type="success" size="mini" style="margin-right: 15px" icon="el-icon-plus"
                       @click="exportStu(scope.row)"
            >
              导出学生
            </el-button>
            <el-upload
              action=""
              :auto-upload="true"
              :multiple="false"
              :show-file-list="false"
              :http-request="uploadFileFn"
              :file-list="fileList"
              :before-upload="(file) => {beforeUpload(file,scope.row)}"
            >
              <el-button type="primary" size="mini" icon="el-icon-plus">导入成绩</el-button>
            </el-upload>
          </div>
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
  </el-main>
</template>

<script>
import { getCourseListApi, importStuInfoApi } from '@/api/teacher'
import { getUserId } from '@/utils/auth'

export default {
  data() {
    return {
      para: {
        courseId: '',
        classId: ''
      },
      fileList: [],
      searchModel: {
        currentPage: 1,
        pageSize: 10,
        teacherId: getUserId(),
        courseName: '',
        total: 0
      },
      tableList: [],
      tableHeight: 0
    }
  },
  created() {
    this.getCourseList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  methods: {
    // 文件校验方法
    beforeUpload(file, row) {
      console.log(row)
      this.para.classId = row.classId
      this.para.courseId = row.courseId
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
      return true
    },
    // 导入(文件发生改变就会触发的事件)
    async uploadFileFn(param) {
      const file = param.file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('classId', this.para.classId)
      formData.append('courseId', this.para.courseId)
      const res = await importStuInfoApi(formData)
      if (res && res.code === 200) {
        this.$message.success(res.msg)
      }
    },
    // 导出学生
    exportStu(row) {
      const abtn = document.createElement('a')
      // 文件id
      abtn.href = process.env.VUE_APP_BASE_API_PRO + '/api/teacher/exportStuInfo?classId=' + row.classId
      abtn.click()
    },
    currentChange(val) {
      this.searchModel.currentPage = val
      this.getCourseList()
    },
    sizeChange(val) {
      this.searchModel.pageSize = val
      this.getCourseList()
    },
    async getCourseList() {
      const res = await getCourseListApi(this.searchModel)
      if (res && res.code === 200) {
        console.log(res)
        this.tableList = res.data.records
        this.searchModel.total = res.data.total
      }
    },
    resetBtn() {
      this.searchModel.courseName = ''
      this.getCourseList()
    },
    searchBtn() {
      this.getCourseList()
    }
  }
}
</script>

<style lang="scss" scoped>
.mybtn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
