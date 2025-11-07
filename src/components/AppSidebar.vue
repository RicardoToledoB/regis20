<template>
  <div class="app-sidebar" :class="{ 'sidebar-collapsed': collapsed }">
    <!-- Header del Sidebar -->
    <div class="sidebar-header">
      <div class="logo-section" v-if="!collapsed">
        <div>
          <img src="/ssm/logo-ssm.png" alt="Logo" class="logo" />
        </div>
        <div class="brand">
          <span class="brand-name">REGIS20</span>
        </div>
      </div>
      <Button 
        v-else
        class="p-button-text p-button-plain logo-btn"
        @click="toggleSidebar"
      >
        <img src="/ssm/logo-ssm.png" alt="Logo" class="logo-collapsed" />
      </Button>
      <Button v-if="!collapsed"
        @click="toggleSidebar" 
        class="p-button-text p-button-secondary toggle-btn"
        v-tooltip="collapsed ? 'Expandir' : 'Contraer'"
      >
        <i :class="collapsed ? 'pi pi-chevron-right' : 'pi pi-chevron-left'" />
      </Button>
    </div>

    <!-- Menú de Navegación -->
    <div class="navigation-section">
      <div class="menu-container">
        <!-- Módulo Principal -->
        <div class="menu-section" v-if="!collapsed">
          <span class="section-label">Principal</span>
        </div>
        <router-link 
          v-for="item in mainMenu" 
          :key="item.to"
          :to="item.to" 
          class="menu-item"
          :class="{ 
            'active-route': $route.path === item.to,
            'collapsed-item': collapsed
          }"
        >
          <div class="menu-item-content">
            <i :class="item.icon" class="menu-icon" />
            <span class="menu-text" v-if="!collapsed">{{ item.label }}</span>
          </div>
        </router-link>
        
        <div v-if="!collapsed">
          <hr>
          <div class="menu-section">
            <span class="section-label">Mantenedores</span>
          </div>
        </div>
        <div v-else>
          <hr>
        </div>

        <!-- Seguridad y Usuarios -->
        <div class="menu-dropdown" v-if="!collapsed">
          <div 
            class="dropdown-header"
            @click="toggleDropdown('security')"
          >
            <div class="dropdown-header-content">
              <i class="pi pi-shield menu-icon" />
              <span class="menu-text">Seguridad y Usuarios</span>
            </div>
            <i 
              :class="openDropdowns.security ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" 
              class="dropdown-arrow"
            />
          </div>
          <div 
            class="dropdown-content" 
            :class="{ 'dropdown-open': openDropdowns.security }"
          >
            <router-link 
              v-for="item in securityMenu" 
              :key="item.to"
              :to="item.to" 
              class="dropdown-item"
              :class="{ 'active-route': $route.path === item.to }"
            >
              <i :class="item.icon" class="menu-icon" />
              <span class="menu-text">{{ item.label }}</span>
            </router-link>
          </div>
        </div>

        <!-- Versión colapsada para Seguridad -->
        <template v-else>
          <router-link 
            v-for="item in securityMenu" 
            :key="item.to"
            :to="item.to" 
            class="menu-item collapsed-item"
            :class="{ 'active-route': $route.path === item.to }"
          >
            <div class="menu-item-content">
              <i :class="item.icon" class="menu-icon" />
            </div>
          </router-link>
        </template>

        <!-- Geografía y Ubicaciones -->
        <div class="menu-dropdown" v-if="!collapsed">
          <div 
            class="dropdown-header"
            @click="toggleDropdown('geography')"
          >
            <div class="dropdown-header-content">
              <i class="pi pi-map-marker menu-icon" />
              <span class="menu-text">Geografía y Ubicaciones</span>
            </div>
            <i 
              :class="openDropdowns.geography ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" 
              class="dropdown-arrow"
            />
          </div>
          <div 
            class="dropdown-content" 
            :class="{ 'dropdown-open': openDropdowns.geography }"
          >
            <router-link 
              v-for="item in geographyMenu" 
              :key="item.to"
              :to="item.to" 
              class="dropdown-item"
              :class="{ 'active-route': $route.path === item.to }"
            >
              <i :class="item.icon" class="menu-icon" />
              <span class="menu-text">{{ item.label }}</span>
            </router-link>
          </div>
        </div>

        <!-- Versión colapsada para Geografía -->
        <template v-else>
          <router-link 
            v-for="item in geographyMenu" 
            :key="item.to"
            :to="item.to" 
            class="menu-item collapsed-item"
            :class="{ 'active-route': $route.path === item.to }"
          >
            <div class="menu-item-content">
              <i :class="item.icon" class="menu-icon" />
            </div>
          </router-link>
        </template>

        <!-- Instituciones y Personal -->
        <div class="menu-dropdown" v-if="!collapsed">
          <div 
            class="dropdown-header"
            @click="toggleDropdown('institutions')"
          >
            <div class="dropdown-header-content">
              <i class="pi pi-building menu-icon" />
              <span class="menu-text">Instituciones y Personal</span>
            </div>
            <i 
              :class="openDropdowns.institutions ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" 
              class="dropdown-arrow"
            />
          </div>
          <div 
            class="dropdown-content" 
            :class="{ 'dropdown-open': openDropdowns.institutions }"
          >
            <router-link 
              v-for="item in institutionsMenu" 
              :key="item.to"
              :to="item.to" 
              class="dropdown-item"
              :class="{ 'active-route': $route.path === item.to }"
            >
              <i :class="item.icon" class="menu-icon" />
              <span class="menu-text">{{ item.label }}</span>
            </router-link>
          </div>
        </div>

        <!-- Versión colapsada para Instituciones -->
        <template v-else>
          <router-link 
            v-for="item in institutionsMenu" 
            :key="item.to"
            :to="item.to" 
            class="menu-item collapsed-item"
            :class="{ 'active-route': $route.path === item.to }"
          >
            <div class="menu-item-content">
              <i :class="item.icon" class="menu-icon" />
            </div>
          </router-link>
        </template>

        <!-- Inventario y Sustancias -->
        <div class="menu-dropdown" v-if="!collapsed">
          <div 
            class="dropdown-header"
            @click="toggleDropdown('inventory')"
          >
            <div class="dropdown-header-content">
              <i class="pi pi-box menu-icon" />
              <span class="menu-text">Inventario y Sustancias</span>
            </div>
            <i 
              :class="openDropdowns.inventory ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" 
              class="dropdown-arrow"
            />
          </div>
          <div 
            class="dropdown-content" 
            :class="{ 'dropdown-open': openDropdowns.inventory }"
          >
            <router-link 
              v-for="item in inventoryMenu" 
              :key="item.to"
              :to="item.to" 
              class="dropdown-item"
              :class="{ 'active-route': $route.path === item.to }"
            >
              <i :class="item.icon" class="menu-icon" />
              <span class="menu-text">{{ item.label }}</span>
            </router-link>
          </div>
        </div>

        <!-- Versión colapsada para Inventario -->
        <template v-else>
          <router-link 
            v-for="item in inventoryMenu" 
            :key="item.to"
            :to="item.to" 
            class="menu-item collapsed-item"
            :class="{ 'active-route': $route.path === item.to }"
          >
            <div class="menu-item-content">
              <i :class="item.icon" class="menu-icon" />
            </div>
          </router-link>
        </template>
      </div>
    </div>

    <!-- Footer del Sidebar -->
    <hr>
    <div class="sidebar-footer" v-if="!collapsed">
      <div class="app-version">
        <span>v1.0.0</span>
      </div>
      <div class="footer-actions">
        <Button 
          class="p-button-text p-button-plain"
          v-tooltip="'Cerrar Sesión'"
          @click="showLogoutConfirmation"
        >
          <i class="pi pi-sign-out" />
        </Button>
      </div>
    </div>

    <!-- Diálogo de Confirmación de Cierre de Sesión -->
    <Dialog 
      v-model:visible="showLogoutDialog" 
      modal
      :style="{ width: '400px' }"
      header="Confirmar Cierre de Sesión"
      :draggable="false"
    >
      <div class="confirmation-content">
        <div class="confirmation-icon">
          <i class="pi pi-question-circle" />
        </div>
        <div class="confirmation-message">
          <p>¿Estás seguro de que deseas cerrar sesión?</p>
          <p class="confirmation-warning">Se perderán los datos no guardados.</p>
        </div>
      </div>
      <template #footer>
        <Button 
          label="Cancelar" 
          severity="secondary" 
          @click="showLogoutDialog = false" 
          class="p-button-text"
        />
        <Button 
          label="Sí, Cerrar Sesión" 
          severity="danger" 
          @click="confirmLogout" 
          autofocus
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()
const collapsed = ref(false)
const showLogoutDialog = ref(false)

// Control de dropdowns abiertos
const openDropdowns = reactive({
  security: false,
  geography: false,
  institutions: false,
  inventory: false
})

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

const toggleDropdown = (dropdownName) => {
  openDropdowns[dropdownName] = !openDropdowns[dropdownName]
}

// Mostrar diálogo de confirmación
const showLogoutConfirmation = () => {
  showLogoutDialog.value = true
}

// Confirmar cierre de sesión
const confirmLogout = () => {
  // Limpiar todas las variables del localStorage relacionadas con la sesión
  const sessionKeys = [
    'userName',
    'sessionTime', 
    'sessionLastUpdate',
    'token',
    'userRole',
    'userId'
  ]
  
  sessionKeys.forEach(key => {
    localStorage.removeItem(key)
  })
  
  // También limpiar sessionStorage por si acaso
  sessionStorage.clear()
  
  // Cerrar el diálogo
  showLogoutDialog.value = false
  
  // Redirigir al login
  router.push('/')
}

// Menú Principal (siempre visible) - Ahora con iconos de PrimeVue
const mainMenu = ref([
  {
    label: 'Inicio',
    icon: 'pi pi-home',
    to: '/inicio',
  },
  {
    label: 'Recepción',
    icon: 'pi pi-inbox',
    to: '/receptions',
  },
])

// Seguridad y Usuarios
const securityMenu = ref([
  {
    label: 'Usuarios',
    icon: 'pi pi-users',
    to: '/users',
  },
  {
    label: 'Perfiles',
    icon: 'pi pi-id-card',
    to: '/roles',
  },
])

// Geografía y Ubicaciones
const geographyMenu = ref([
  {
    label: 'Comunas',
    icon: 'pi pi-map',
    to: '/communes',
  },
  {
    label: 'Locaciones',
    icon: 'pi pi-location-arrow',
    to: '/locations',
  },
  {
    label: 'Destinos',
    icon: 'pi pi-arrows-alt',
    to: '/destinations',
  },
])

// Instituciones y Personal
const institutionsMenu = ref([
  {
    label: 'Tipo de Institución',
    icon: 'pi pi-building',
    to: '/institution-type',
  },
  {
    label: 'Instituciones',
    icon: 'pi pi-bank',
    to: '/institutions',
  },
  {
    label: 'Grados',
    icon: 'pi pi-star',
    to: '/grades',
  },
  {
    label: 'Policías',
    icon: 'pi pi-user',
    to: '/polices',
  },
])

// Inventario y Sustancias
const inventoryMenu = ref([
  {
    label: 'Ubicación de Bodega',
    icon: 'pi pi-warehouse',
    to: '/storages',
  },
  {
    label: 'Tipo de Droga',
    icon: 'pi pi-heart',
    to: '/types-substances',
  },
  {
    label: 'Tipo de Contenedor',
    icon: 'pi pi-box',
    to: '/packagings',
  },
  {
    label: 'Método de Destrucción',
    icon: 'pi pi-trash',
    to: '/methods-destructions',
  },
])
</script>

<style scoped>
.app-sidebar {
  width: 270px;
  height: 100vh;
  background: var(--surface-900);
  color: var(--surface-0);
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--surface-700);
}

.sidebar-collapsed {
  width: 70px;
}

/* Header */
.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--surface-700);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  width: 50px;
  height: auto;
}

.logo-collapsed {
  width: 40px;
  height: auto;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: white; /* Texto REGIS20 en blanco */
}

.toggle-btn {
  color: var(--surface-300);
  width: 2rem;
  height: 2rem;
}

.logo-btn {
  color: var(--primary-color);
  width: 2.5rem;
  height: 2.5rem;
}

/* Navegación */
.navigation-section {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.menu-container {
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;
}

.menu-section {
  padding: 1rem 0.5rem 0.5rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--surface-400);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Items de menú */
.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--surface-300);
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  margin-bottom: 0.25rem;
}

.menu-item:hover {
  background: var(--surface-700);
  color: var(--surface-0);
}

.menu-item.active-route {
  background: var(--primary-color);
  color: white;
}

/* Dropdown Styles */
.menu-dropdown {
  margin-bottom: 0.25rem;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  color: var(--surface-300);
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-header:hover {
  background: var(--surface-700);
  color: var(--surface-0);
}

.dropdown-header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
  color: var(--surface-400);
}

.dropdown-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin-left: 1rem;
}

.dropdown-open {
  max-height: 500px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  color: var(--surface-300);
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  margin-bottom: 0.125rem;
}

.dropdown-item:hover {
  background: var(--surface-700);
  color: var(--surface-0);
}

.dropdown-item.active-route {
  background: var(--primary-500);
  color: white;
}

/* Contenido común */
.menu-item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.menu-text {
  font-weight: 500;
  font-size: 0.9rem;
}

.collapsed-item {
  justify-content: center;
  padding: 0.75rem;
}

.collapsed-item .menu-item-content {
  justify-content: center;
}

/* Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--surface-700);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-version {
  font-size: 0.75rem;
  color: var(--surface-400);
}

.footer-actions .p-button {
  color: var(--surface-400);
  width: 2rem;
  height: 2rem;
}

.footer-actions .p-button:hover {
  color: var(--surface-0);
  background: var(--surface-700);
}

/* Estilos del diálogo de confirmación */
.confirmation-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.confirmation-icon {
  font-size: 3rem;
  color: var(--primary-color);
}

.confirmation-message p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
}

.confirmation-warning {
  color: var(--red-500);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Scrollbar */
.navigation-section::-webkit-scrollbar {
  width: 4px;
}

.navigation-section::-webkit-scrollbar-track {
  background: var(--surface-800);
}

.navigation-section::-webkit-scrollbar-thumb {
  background: var(--surface-600);
  border-radius: 2px;
}

.navigation-section::-webkit-scrollbar-thumb:hover {
  background: var(--surface-500);
}
</style>