import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN' // 设置为中文

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// 权限框架注册全局
import permission from '@/permission/index.js' // 权限判断指令
Vue.use(permission)
// 引入权限检测
import checkPermission from '@/utils/permission'
Vue.prototype.$checkPermission = checkPermission
// 工具的挂载
// 清空表单
import resetForm from '@/utils/resetForm'
Vue.prototype.$resetForm = resetForm
// 信息提示框
import myConfirm from '@/utils/myConfirm'
Vue.prototype.$myConfirm = myConfirm
// 对象快速复制
import objCopy from '@/utils/objCopy'
Vue.prototype.$objCopy = objCopy
// 首页数据展示echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
