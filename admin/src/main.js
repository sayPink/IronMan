// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import '@/assets/icon/iconfont.css'
import Bus from './lib/bus'
import publicMethod from '@/lib/util'
import router from './router'
import store from './store'
import '@/lib/vue-mavon-editor'
import IconFont from '@/components/iconFont'
if (process.env.NODE_ENV !== 'production') require('./mock')
// 
Vue.config.productionTip = false
Vue.component('icon-font', IconFont)
Vue.prototype.$bus = Bus;
Vue.prototype.publicMethod = publicMethod;

// 引入富文本
import VueQuillEditor from 'vue-quill-editor'
if (process.browser) {
  const VueQuillEditor = require('vue-quill-editor/dist/ssr')
  Vue.use(VueQuillEditor, /* { default global options } */ )
}
// Vue.use(VueQuillEditor, /* { default global options } */ )

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
