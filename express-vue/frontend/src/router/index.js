import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/IndexPage';
import Join from '@/components/Join';
import Login from '@/components/Login';

Vue.use(Router)

export default new Router({
  mode : 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path : '/join',
      name : 'join',
      component : Join
    },
    {
      path : '/login',
      name : 'login',
      component : Login
    }
  ]
})
