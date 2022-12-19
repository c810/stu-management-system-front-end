<template>
  <el-main>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe highlight-current-row ref="table">
      <el-table-column align="center" prop="teachLevel" label="教学水平评分">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.teachLevel"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          >
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="reaction" label="课堂互动评分">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.reaction"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          >
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="attitude" label="教学态度评分">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.attitude"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          >
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="homework" label="作业布置评分">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.homework"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          >
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="bookChosen" label="教材选择评分">
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.bookChosen"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          >
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="recommend" label="是否推荐评优">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.recommend === '1'" type="primary">推荐</el-tag>
          <el-tag v-if="scope.row.recommend === '0'" type="danger">不推荐</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="evaluateDate" label="评价时间"></el-table-column>
      <el-table-column align="center" width="200px" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="checkBtn(scope.row)">查看建议
          </el-button>
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
    ></el-pagination>
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
        <span class="advice">{{ advice }}</span>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import { getUserId } from '@/utils/auth'
import { clearUnreadEvaluateApi, getMyEvaluateListApi } from '@/api/evaluate'
import SysDialog from '@/components/Dialog/SysDialog'

export default {
  components: {
    SysDialog
  },
  data() {
    return {
      unreadMessage: this.$route.query.unreadMessage,
      dialog: {
        title: '',
        visible: false,
        width: 600,
        height: 200
      },
      tableHeight: 0,
      searchModel: {
        teacherId: getUserId(),
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableList: [],
      advice: '',
      getOneTeacher: {
        teacherId: getUserId(),
        unreadMessage: 0
      }
    }
  },
  created() {
    this.getMyEvaluateList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180
    })
  },
  methods: {
    onClose() {
      this.dialog.visible = false
    },
    onConfirm() {
      this.dialog.visible = false
    },
    checkBtn(val) {
      this.dialog.title = '学生建议'
      this.advice = val.advice
      this.dialog.visible = true
    },
    currentChange(val) {
      this.searchModel.currentPage = val
      this.getMyEvaluateList()
    },
    sizeChange(val) {
      this.searchModel.pageSize = val
      this.getMyEvaluateList()
    },
    async getMyEvaluateList() {
      var _this = this
      await this.clearUnreadEvaluate()
      const res = await getMyEvaluateListApi(this.searchModel)
      if (res && res.code === 200) {
        console.log(res)
        this.tableList = res.data.records
        console.log(this.tableList)
        this.tableList.forEach(function(item, index) {
          item.evaluateDate = item.evaluateDate.substring(0, 10)
          console.log(_this.unreadMessage)
          if (index < _this.unreadMessage) {
            setTimeout(() => {
              _this.$refs.table.setCurrentRow(item, true)
            }, index * 2000 + 1)
            setTimeout(() => {
              _this.$refs.table.setCurrentRow()
            }, index * 2000 + 500)
            setTimeout(() => {
              _this.$refs.table.setCurrentRow(item, true)
            }, index * 2000 + 1000)
            setTimeout(() => {
              _this.$refs.table.setCurrentRow()
            }, index * 2000 + 1500)
          }
          // clearTimeout(t1)
          // clearTimeout(t2)
          // clearTimeout(t3)

          // item.evaluateDate = item.evaluateDate.substring(0, 10) + ' ' + item.evaluateDate.substring(11, 19)
        })
        this.unreadMessage = 0

        this.searchModel.total = res.data.total
        /* this.evaluateList.forEach(function(value, index) {
          if (value.teacherId) {
          }
        }) */
      }
    },
    async clearUnreadEvaluate() {
      const res2 = await clearUnreadEvaluateApi(this.getOneTeacher)
    }
  }
}
</script>

<style scoped>
.advice {
  margin: 20px;
  font-size: 16px;
  line-height: 24px;
}

.el-main >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #9b0d14;
  color: #fff;
}
</style>
