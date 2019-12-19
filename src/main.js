import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入axios
import axios from 'axios'
// 导入  按需引入element-ui的js文件
import './ui/element.js'
// 导入字体图标库
import './assets/iconfont/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 设置请求根目录http://127.0.0.1:8888/api/private/v1/
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
