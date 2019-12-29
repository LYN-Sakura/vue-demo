import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入axios
import axios from 'axios'
// 导入  按需引入elem,.ent-ui的js文件
import './ui/element.js'
// 导入字体图标库
import './assets/iconfont/iconfont.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入全局样式表
import './assets/css/global.css'
// 获取树形表格
import TreeTable from 'vue-table-with-tree-grid'
// 导入进度条js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 设置请求根目录http://127.0.0.1:8888/api/private/v1/
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器 加载进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 响应拦截器 进度条结束
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 全局挂载异步请求axios
Vue.prototype.$http = axios
// 全局注册树形表格
Vue.component('zk-table', TreeTable)
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
