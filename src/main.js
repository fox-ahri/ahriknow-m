import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Vueaxios from 'vue-axios'
import store from './store'
import { Lazyload } from 'vant'
import url from './assets/url'
Vue.prototype.url = url
import "mavon-editor/dist/highlightjs/styles/tomorrow-night.min.css"

Vue.config.productionTip = false
Vue.use(Lazyload)
Vue.use(Vueaxios, axios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
