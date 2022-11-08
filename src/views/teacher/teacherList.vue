<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.teacherName" placeholder="请输入教师姓名"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color:#FF7670;border-color: #FF7670;" icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" :data="tableList" border stripe>
      <el-table-column prop="teacherName" label="姓名"/>
      <el-table-column prop="phone" label="电话"/>
      <el-table-column prop="teacherNum" label="编号"/>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex === '0'" type="blue" size="small">男</el-tag>
          <el-tag v-if="scope.row.sex === '1'" type="danger" size="small">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
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
    <!-- 弹框 -->
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
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="teacherName" label="姓名">
                <el-input v-model="addModel.teacherName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="sex" label="性别">
                <el-radio-group v-model="addModel.sex">
                  <el-radio :label="'0'">男</el-radio>
                  <el-radio :label="'1'">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="phone" label="电话">
                <el-input v-model="addModel.phone"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="teacherNum" label="编号">
                <el-input v-model="addModel.teacherNum"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="addModel.type === '0'" :span="12" :offset="0">
              <el-form-item prop="password" label="密码">
                <el-input v-model="addModel.password"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="roleId" label="角色">
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
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import { addApi, listApi, editApi, deleteApi, getRoleApi, getRoleByIdApi } from '@/api/teacher'
import SysDialog from '@/components/Dialog/SysDialog.vue'

export default {
  components: {
    SysDialog
  },
  data() {
    return {
      tableHeight: 0,
      rules: {
        teacherName: [
          {
            trigger: 'change',
            required: true,
            message: '请填写教师姓名'
          }
        ],
        sex: [
          {
            trigger: 'change',
            required: true,
            message: '请选择性别'
          }
        ],
        phone: [
          {
            trigger: 'change',
            required: true,
            message: '请填写电话'
          }
        ],
        teacherNum: [
          {
            trigger: 'change',
            required: true,
            message: '请填写编号'
          }
        ],
        password: [
          {
            trigger: 'change',
            required: true,
            message: '请填写密码'
          }
        ]
      },
      addModel: {
        type: '',
        teacherId: '',
        teacherName: '',
        sex: '',
        phone: '',
        teacherNum: '',
        password: '',
        roleId: ''
      },
      // 弹框属性
      addDialog: {
        title: '',
        height: 180,
        width: 650,
        visible: false
      },
      searchModel: {
        currentPage: 1,
        pageSize: 10,
        teacherName: '',
        total: 0
      },
      tableList: [],
      roleList: []
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
          teacherId: row.teacherId
        })
        if (res && res.code === 200) {
          // 信息提示
          this.$message.success(res.msg)
          this.getList()
        }
      }
    },
    async editBtn(row) {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      this.$objCopy(row, this.addModel)
      // 获取角色列表
      const res = await getRoleApi()
      if (res && res.code === 200) {
        this.roleList = res.data
      }
      // 角色数据回显
      const role = await getRoleByIdApi({ teacherId: row.teacherId })
      if (role && role.code === 200) {
        this.addModel.roleId = role.data.roleId
      }
      // 设置弹框属性
      this.addDialog.title = '编辑教师'
      this.addDialog.visible = true
      this.addModel.type = '1'
    },
    // 获取列表
    async getList() {
      const res = await listApi(this.searchModel)
      if (res && res.code === 200) {
        console.log(res)
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
            // 信息提示
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
    async addBtn() {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      // 获取角色列表
      const res = await getRoleApi()
      if (res && res.code === 200) {
        this.roleList = res.data
      }
      // 设置弹框属性
      this.addDialog.title = '新增教师'
      this.addDialog.visible = true
      this.addModel.type = '0'
    },
    resetBtn() {
      this.searchModel.teacherName = ''
      this.getList()
    },
    searchBtn() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
