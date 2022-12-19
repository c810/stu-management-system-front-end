<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input
          v-model="searchModel.courseName"
          placeholder="请输入课程名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button icon="el-icon-close" @click="resetBtn" style="color:#FF7670;border-color: #FF7670;">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column
        align="center"
        prop="courseName"
        label="课程名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="courseYear"
        label="开课年份"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="teacherName"
        label="授课教师"
      ></el-table-column>
      <el-table-column align="center" prop="type" label="学期">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === '0'" type="success" size="small">春季</el-tag>
          <el-tag v-if="scope.row.type === '1'" type="warning" size="small">秋季</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="point"
        label="成绩"
      ></el-table-column>
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
  </el-main>
</template>

<script>
import { getCourseListApi } from '@/api/student'
import { getUserId } from '@/utils/auth'

export default {
  data() {
    return {
      tableHeight: 0,
      searchModel: {
        courseName: '',
        currentPage: 1,
        pageSize: 10,
        stuId: getUserId(),
        total: 0
      },
      tableList: []
    }
  },
  created() {
    this.getCourse()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  methods: {
    searchBtn() {
      this.getCourse()
    },
    resetBtn() {
      this.searchModel.courseName = ''
      this.getCourse()
    },
    currentChange(val) {
      this.searchModel.currentPage = val
      this.getCourse()
    },
    sizeChange(val) {
      this.searchModel.pageSize = val
      this.getCourse()
    },
    async getCourse() {
      const res = await getCourseListApi(this.searchModel)
      if (res && res.code === 200) {
        console.log(res)
        console.log(this.searchModel.stuId)
        this.tableList = res.data.records
        this.searchModel.total = res.data.total
      }
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
