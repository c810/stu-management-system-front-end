<template>
  <!-- el-main标签,相当于div -->
  <el-main>
    <!-- 搜索栏
      model: 绑定表单的数据,通常是同一个对象
      ref: 相当于div的id,是唯一的
      rules: 表单验证规则 :rules="rules"
      label-width: 表单域标签的宽度
      inline: 是否在同一行显示
      size: 尺寸
    -->
    <el-form ref="searchFromRef" :model="listPara" label-width="80px" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="listPara.nickName" placeholder="请输入姓名"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listPara.phone" placeholder="请输入电话号码"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button icon="el-icon-close" style="color: #FF7670;border-color: #FF7670;" @click="resetBtn">重置</el-button>
        <el-button v-permission="['sys:sysUserList:add']" type="primary" icon="el-icon-plus" @click="addBtn">新增
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格
    data: 表格的数据
    prop: 对应内容的字段名
    -->
    <el-table :height="tableHeight" :data="tableData" border stripe>
      <el-table-column prop="nickName" label="姓名"/>
      <el-table-column prop="phone" label="电话"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column v-if="$checkPermission(['sys:sysUserList:edit','sys:sysUserList:delete'])" label="操作"
                       align="center" width="180"
      >
        <template slot-scope="scope">
          <el-button v-permission="['sys:sysUserList:edit']" type="primary" size="small" icon="el-icon-edit"
                     @click="editBtn(scope.row)"
          >编辑
          </el-button>
          <el-button v-permission="['sys:sysUserList:delete']" type="danger" size="small" icon="el-icon-delete"
                     @click="deleteBtn(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page.sync="listPara.currentPage"
      :page-sizes="[10,20,40,80,100]"
      :page-size="listPara.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listPara.total"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <!-- 新增或编辑弹框组件 -->
    <sys-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :width="dialog.width"
      :height="dialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <!-- 这里的slot插槽会放到子组件(弹框组件)里面的content插槽位置 -->
      <div slot="content">
        <!-- el-form: 当作普通的form看待
          model: 表单数据对象
          ref: 相当于div的id
          rules: 表单验证规则
          label-width: 表单域标签的宽度
          inline: 是否在同一行显示,如果使用el-row布局,不需要该属性
          size: 尺寸
        -->
        <el-form
          ref="addRef"
          :model="addModel"
          label-width="80px"
          size="small"
          style="margin-right: 40px"
        >
          <!-- el-row: 代表一行
               el-col: 代表一列
          -->
          <el-row>
            <el-col :span="12" :offset="0">
              <!-- 普通div -->
              <el-form-item prop="nickName" :rules="Rules.isNull" label="姓名">
                <el-input v-model="addModel.nickName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="phone" :rules="Rules.phone" label="电话">
                <el-input v-model="addModel.phone"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="email" :rules="Rules.email" label="邮箱">
                <el-input v-model="addModel.email"/>
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
              <el-form-item prop="roleId" :rules="Rules.select" label="角色">
                <el-select v-model="addModel.roleId" placeholder="">
                  <el-option
                    v-for="item in roleList"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="username" :rules="Rules.isNull" label="账户">
                <el-input v-model="addModel.username"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="addModel.type === '0'" :span="12" :offset="0">
              <el-form-item prop="password" :rules="Rules.password" label="密码">
                <el-input v-model="addModel.password"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
// 引入获取用户列表
import { getListApi, editUserApi, addUserApi, deleteUserApi, getSysUserRoleApi, getRoleApi } from '@/api/user'
// 引入弹框组件
import SysDialog from '@/components/Dialog/SysDialog'
import Rules from '@/utils/rules'

export default {
  // 注册组件
  components: {
    SysDialog
  },
  data() {
    return {
      Rules,
      // 表单绑定的数据
      addModel: {
        roleId: '',
        type: '', // 0新增,1编辑
        userId: '',
        nickName: '',
        phone: '',
        sex: '',
        email: '',
        username: '',
        password: ''
      },
      // 弹框属性
      dialog: {
        title: '',
        visible: false,
        width: 630,
        height: 220
      },
      // 定义表格的高度
      tableHeight: 0,
      // 列表搜索的参数
      listPara: {
        nickName: '',
        phone: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 表格的数据
      tableData: [],
      // 角色列表
      roleList: []
    }
  },
  mounted() {
    // 计算表格的高度(目前不能随窗口大小调整)
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  created() {
    this.getList()
    // this.getRoleList()
    this.getSysUserRole()
  },
  methods: {
    // 获取管理员角色
    async getSysUserRole() {
      const res = await getSysUserRoleApi()
      if (res && res.code === 200) {
        this.roleList[0] = res.data
      }
    },
    // 获取角色列表
    /* async getRoleList() {
      const res = await getRoleListApi()
      if (res && res.code === 200) {
        this.roleList = res.data
      }
    }, */
    // 获取列表
    async getList() {
      const res = await getListApi(this.listPara)
      console.log('搜索列表')
      console.log(res)
      if (res && res.code === 200) {
        this.tableData = res.data.records
        this.listPara.total = res.data.total
      }
    },
    // 弹框关闭
    onClose() {
      this.dialog.visible = false
    },
    // 弹框确定
    onConfirm() {
      // 表单验证
      this.$refs.addRef.validate(async(valid) => {
        if (valid) {
          let res = null
          if (this.addModel.type === '0') {
            res = await addUserApi(this.addModel)
          } else {
            res = await editUserApi(this.addModel)
          }
          if (res && res.code === 200) {
            // 信息提示
            this.$message({ type: 'success', message: res.msg })
            // 刷新列表
            this.getList()
            // 关闭弹框
            this.dialog.visible = false
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
      this.listPara.phone = ''
      this.listPara.nickName = ''
      this.getList()
    },
    // 新增按钮
    addBtn() {
      this.dialog.title = '新增用户'
      this.dialog.visible = true
      // 清空表单
      this.$resetForm('addRef', this.addModel)
      // 设为新增
      this.addModel.type = '0'
    },
    // 编辑按钮
    async editBtn(row) {
      this.dialog.title = '编辑用户'
      this.dialog.visible = true
      // 清空表单+
      this.$resetForm('addRef', this.addModel)
      // 把当前要编辑的数据复制到表单绑定的数据域
      this.$objCopy(row, this.addModel)
      // 设为编辑
      this.addModel.type = '1'
      // 获取角色
      const res = await getRoleApi({ userId: row.userId })
      if (res && res.code === 200 && res.data) {
        this.addModel.roleId = res.data.roleId
      }
    },
    // 删除按钮
    async deleteBtn(row) {
      // 信息确认
      const confirm = await this.$myConfirm('确定删除该数据吗?')
      if (confirm) {
        const res = await deleteUserApi({ userId: row.userId })
        if (res && res.code === 200) {
          // 信息提示
          this.$message({ type: 'success', message: res.msg })
          // 刷新列表
          this.getList()
        }
      }
    },
    // 页容量改变时触发,val传回来更改后的页容量(每页显示条数)
    sizeChange(val) {
      this.listPara.pageSize = val
      this.getList()
    },
    // 页数改变时触发(当前页)
    currentChange(val) {
      this.listPara.currentPage = val
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
