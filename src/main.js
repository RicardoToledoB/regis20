import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import 'primevue/resources/themes/aura-light-blue/theme.css' // Tema más moderno
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// Componentes PrimeVue
import Sidebar from 'primevue/sidebar'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Card from 'primevue/card'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import Fieldset from 'primevue/fieldset'
import Splitter from 'primevue/splitter';
import Calendar from 'primevue/calendar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import ProgressSpinner from 'primevue/progressspinner'
import Textarea from "primevue/textarea"


import axiosClient from '@/services/axiosClient'

//iconos
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faHome, 
  faInbox, 
  faUsers, 
  faWarehouse,
  faCapsules,
  faShieldHalved, // Para policía
  faBuilding,
  faGem,
  faSignOutAlt,
  faChevronLeft, // ← Singular
  faChevronRight, // ← Singular
  faPlus  
} from '@fortawesome/free-solid-svg-icons'

// Agregar iconos a la librería
library.add(
  faHome, 
  faInbox, 
  faUsers, 
  faWarehouse, 
  faCapsules, 
  faShieldHalved, 
  faBuilding, 
  faGem, 
  faSignOutAlt, 
  faChevronLeft, 
  faChevronRight,
  faPlus  
)

const app = createApp(App)
app.config.globalProperties.$axios = axiosClient // ya incluye el interceptor

app.use(PrimeVue)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(ToastService)
app.use(router)

// Registrar componentes globalmente
app.component('Sidebar', Sidebar)
app.component('Button', Button)
app.component('Menu', Menu)
app.component('Card', Card)
app.component('Dropdown', Dropdown)
app.component('Checkbox', Checkbox)
app.component('Password', Password)
app.component('InputText', InputText)
app.component('Toast', Toast)
app.component('Avatar', Avatar)
app.component('Badge', Badge)
app.component('Image', Image)
app.component('Dialog', Dialog)
app.component('Fieldset', Fieldset)
app.component('Splitter', Splitter)
app.component('Calendar', Calendar)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ColumnGroup',ColumnGroup)
app.component('Row',Row)
app.component('ProgressSpinner',ProgressSpinner)
app.component('Textarea',Textarea)


app.mount('#app')