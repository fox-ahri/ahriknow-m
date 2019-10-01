import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import(/* webpackChunkName: "blog" */ './views/Blog.vue'),
      children: [{

        path: 'read',
        name: 'blog-detail',
        component: () => import(/* webpackChunkName: "blog-detail" */ './views/blog/BlogDetail.vue')
      }]
    },
    {
      path: '/notebook',
      name: 'notebook',
      component: () => import(/* webpackChunkName: "notebook" */ './views/Notebook.vue'),
      redirect: '/notebook/survey',
      children: [{

        path: 'survey',
        name: 'notebook-survey',
        component: () => import(/* webpackChunkName: "notebook-survey" */ './views/note/Survey.vue')
      },{

        path: 'bookdetail',
        name: 'notebook-bookdetail',
        component: () => import(/* webpackChunkName: "notebook-bookdetail" */ './views/note/BookDetail.vue')
      }]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
