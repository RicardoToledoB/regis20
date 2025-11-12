import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Users from '@/views/user/Users.vue'
import Receptions from '@/views/reception/Receptions.vue'
import Polices from '@/views/police/Polices.vue'
import Institutions from '@/views/institution/InstitutionsView.vue'
import Storages from '@/views/storageLocation/StoragesLocationsView.vue'
import TypesSubstances from '@/views/typeSubstance/TypesSubstances.vue'
import Unities from '@/views/unities/Unities.vue'
import Communes from '@/views/communes/CommunesView.vue'
import Locations from '@/views/locations/LocationsView.vue'
import MethodsDestructions from '@/views/methodsDestructions/MethodsDestructionsView.vue'
import Packagings from '@/views/packagings/PackagingsView.vue'
import Roles from '@/views/roles/RolesView.vue'
import InstitutionTypes from '@/views/institutionTypes/InstitutionTypesView.vue'
import Grades from '@/views/grades/GradesView.vue'
import Destinations from '@/views/destinations/DestinationsView.vue'
import PreAnalisis from '@/views/preanalysis/PreAnalysis.vue'
import Login from '@/views/Login.vue'
const routes = [
  {
    path: '/inicio',
    name: 'Home',
    component: Home
  },
  {
    path: '/grades',
    name: 'Grades',
    component: Grades
  },
   {
    path: '/destinations',
    name: 'Destinations',
    component: Destinations
  },
  {
    path: '/institution-type',
    name: 'InstitutionTypes',
    component: InstitutionTypes
  },
  {
    path: '/roles',
    name: 'Roles',
    component: Roles
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
    path: '/communes',
    name: 'Communes',
    component: Communes
  },
   {
    path: '/locations',
    name: 'Locations',
    component: Locations
  },
   {
    path: '/methods-destructions',
    name: 'MethodsDestructions',
    component: MethodsDestructions
  },
  {
    path: '/packagings',
    name: 'Packagings',
    component: Packagings
  },
  {
    path: '/pre-analysis',
    name: 'PreAnalisis',
    component: PreAnalisis
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