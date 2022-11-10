<template>
  <el-main>
    <!--  搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input
          v-model="searchModel.title"
          placeholder="请填写公告标题"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button icon="el-icon-close" style="color:#FF7670;border-color: #FF7670;" @click="closeBtn"
        >重置
        </el-button
        >
        <el-button type="primary" icon="el-icon-plus" @click="addBtn"
        >新增
        </el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="noticeContent" label="内容"></el-table-column>
      <el-table-column prop="createTime" label="发布时间"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="editBtn(scope.row)"
          >编辑
          </el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="deleteBtn(scope.row)"
          >删除
          </el-button
          >
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

    <!-- 新增弹框 -->
    <sys-dialog
      :title="dialog.title"
      :height="dialog.height"
      :width="dialog.width"
      :visible="dialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="addModel"
          ref="addForm"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="normal"
        >
          <el-form-item prop="title" label="标题">
            <el-input v-model="addModel.title"></el-input>
          </el-form-item>
          <el-form-item prop="noticeContent" label="内容">
            <el-input
              type="textarea"
              v-model="addModel.noticeContent"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import SysDialog from '@/components/Dialog/SysDialog'
import { addApi, listApi, editApi, deleteApi } from '@/api/notice'

export default {
  components: {
    SysDialog
  },
  data() {
    return {
      tableHeight: 0,
      rules: {
        title: [
          {
            trigger: 'blur',
            required: true,
            message: '请输入公告标题'
          }
        ],
        noticeContent: [
          {
            trigger: 'blur',
            required: true,
            message: '请输入公告内容'
          }
        ]
      },
      addModel: {
        type: '',
        noticeId: '',
        title: '',
        noticeContent: ''
      },
      dialog: {
        title: '',
        height: 150,
        width: 650,
        visible: false
      },
      searchModel: {
        currentPage: 1,
        pageSize: 10,
        title: '',
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
    currentChange(val) {
      this.searchModel.currentPage = val
      this.getList()
    },
    sizeChange(val) {
      this.searchModel.pageSize = val
      this.getList()
    },
    async deleteBtn(row) {
      const confirm = await this.$myConfirm('确定删除该数据吗?')
      if (confirm) {
        const res = await deleteApi({
          noticeId: row.noticeId
        })
        if (res && res.code === 200) {
          this.getList()
          this.$message.success(res.msg)
          this.dialog.visible = false
        }
      }
    },
    editBtn(row) {
      this.$resetForm('addForm', this.addModel)
      this.$objCopy(row, this.addModel)
      this.dialog.title = '编辑公告'
      this.dialog.visible = true
      this.addModel.type = '1'
    },
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
            this.getList()
            this.$message.success(res.msg)
            this.dialog.visible = false
          }
        }
      })
    },
    onClose() {
      this.dialog.visible = false
    },
    addBtn() {
      this.$resetForm('addForm', this.addModel)
      this.dialog.title = '新增公告'
      this.dialog.visible = true
      this.addModel.type = '0'
    },
    closeBtn() {
      this.searchModel.title = ''
      this.getList()
    },
    searchBtn() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
