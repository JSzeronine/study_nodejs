import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/components/IndexPage'
import Show from '@/components/ShowPage'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  mode : "hash",
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },{
      path : '/:id',
      name : 'show',
      component : Show
    }
  ]
})
