import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      alias: '/index',
      name: 'home',
      component: Home
    },
    {
      path: '/',
      name: 'blog',
      component: () => import(/* webpackChunkName: "blog" */ './views/Blog.vue'),
      children: [{
        path: 'read',
        name: 'blog-detail',
        component: () => import(/* webpackChunkName: "blog-detail" */ './views/blog/BlogDetail.vue')
      }, {

        path: 'file',
        name: 'blog-file',
        component: () => import(/* webpackChunkName: "blog-file" */ './views/blog/File.vue')
      }, {

        path: 'article',
        name: 'blog-article',
        component: () => import(/* webpackChunkName: "blog-article" */ './views/blog/Article.vue')
      }, {

        path: 'category',
        name: 'blog-category',
        component: () => import(/* webpackChunkName: "blog-category" */ './views/blog/Category.vue')
      }, {

        path: 'search',
        name: 'blog-search',
        component: () => import(/* webpackChunkName: "blog-search" */ './views/blog/Search.vue')
      }]
    },
    {
      path: '/book',
      name: 'book',
      component: () => import(/* webpackChunkName: "book" */ './views/Notebook.vue'),
      redirect: '/book/bookshelf',
      children: [{
        path: 'bookshelf',
        name: 'book-bookshelf',
        component: () => import(/* webpackChunkName: "book-bookshelf" */ './views/note/Survey.vue')
      }, {

        path: 'read',
        name: 'book-read',
        component: () => import(/* webpackChunkName: "book-read" */ './views/note/BookDetail.vue')
      }]
    }, {
      path: '*',
      redirect: '/'
    }
  ]
})
