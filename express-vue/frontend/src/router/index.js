import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/IndexPage';
import Show from '@/components/ShowPage';
import Join from '@/components/Join';

Vue.use(Router)

export default new Router({
  mode : 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    // {
    //   path : '/:id',
    //   name : "show",
    //   component : Show
    // },
    {
      path : '/join',
      name : 'join',
      component : Join
    }
  ]
})
