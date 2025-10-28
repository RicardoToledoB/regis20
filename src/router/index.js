import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Users from '../views/user/Users.vue'
import Receptions from '../views/reception/Receptions.vue'
import Polices from '../views/police/Polices.vue'
import Institutions from '@/views/institution/Institutions.vue'
import Storages from '@/views/storage/storages.vue'
import TypesSubstances from '@/views/typeSubstance/TypesSubstances.vue'
import Unities from '@/views/unities/Unities.vue'
import Login from '@/views/Login.vue'
const routes = [
  {
    path: '/inicio',
    name: 'Home',
    component: Home
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/receptions',
    name: 'Receptions',
    component: Receptions
  },
  {
    path: '/polices',
    name: 'Polices',
    component: Polices
  },
  {
    path: '/institutions',
    name: 'Institutions',
    component: Institutions
  },
   {
    path: '/storages',
    name: 'Storages',
    component: Storages
  },
  {
    path: '/types-substances',
    name: 'TypesSubstances',
    component: TypesSubstances
  },
  {
    path: '/unities',
    name: 'Unities',
    component: Unities
  },
  {
  path: '/',
  name: 'login',
  component: Login
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router