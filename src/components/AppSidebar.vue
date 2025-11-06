<template>
  <div class="diamond-sidebar" :class="{ 'sidebar-collapsed': collapsed }">
    <!-- Header del Sidebar -->
    <div class="sidebar-header">
      <div class="logo-section" v-if="!collapsed">
        <div>
          <Image src="public/ssm/logo-ssm.png" alt="Image" width="50" />
        </div>
        <div class="brand">
          <span class="brand-name" style="color: white;">REGIS20</span>
        </div>
      </div>
      <Button 
        v-else
        class="p-button-text p-button-plain logo-btn"
        @click="toggleSidebar"
      >
        <font-awesome-icon icon="fa-solid fa-gem" class="logo-icon" />
        <Image src="public/ssm/logo-ssm.png" alt="Image" width="60" />
      </Button>
      <Button v-if="!collapsed"
        @click="toggleSidebar" 
        class="p-button-text p-button-secondary toggle-btn"
        v-tooltip="collapsed ? 'Expandir' : 'Contraer'"
      >
        <font-awesome-icon :icon="collapsed ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left'" />
      </Button>
    </div>

    <!-- Menú de Navegación -->
    <div class="navigation-section">
      <div class="custom-menu">
        <!-- Módulo Principal -->
        <div class="menu-section" v-if="!collapsed">
          <span class="section-label">Principal</span>
        </div>
        <router-link 
          v-for="item in mainMenu" 
          :key="item.to"
          :to="item.to" 
          class="custom-menu-item"
          :class="{ 
            'active-route': $route.path === item.to,
            'collapsed-item': collapsed
          }"
        >
          <div class="menu-item-content">
            <font-awesome-icon :icon="item.icon" class="menu-icon" />
            <span class="menu-text" v-if="!collapsed">{{ item.label }}</span>
          </div>
        </router-link>
        <div v-if="!collapsed">
          <hr>
            <br>
              <center>Mantenedores</center><br>
            <hr>
          <br>
        </div>
        <div v-else>
          <hr><br>
        </div>
        <!-- Seguridad y Usuarios -->
        <div class="menu-dropdown" v-if="!collapsed">
          <div 
            class="dropdown-header"
            @click="toggleDropdown('security')"
          >
            <div class="dropdown-header-content">
              <font-awesome-icon icon="fa-solid fa-shield-halved" class="menu-icon" />
              <span class="menu-text">Seguridad y Usuarios</span>
            </div>
            <font-awesome-icon 
              :icon="openDropdowns.security ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'" 
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
              class="dropdown-menu-item"
              :class="{ 'active-route': $route.path === item.to }"
            >
              <font-awesome-icon :icon="item.icon" class="menu-icon" />
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
            class="custom-menu-item collapsed-item"
            :class="{ 'active-route': $route.path === item.to }"
          >
            <div class="menu-item-content">
              <font-awesome-icon :icon="item.icon" class="menu-icon" />
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
              <font-awesome-icon icon="fa-solid fa-map" class="menu-icon" />
              <span class="menu-text">Geografía y Ubicaciones</span>
            </div>
            <font-awesome-icon 
              :icon="openDropdowns.geography ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'" 
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
              class="dropdown-menu-item"
              :class="{ 'active-route': $route.path === item.to }"
            >
              <font-awesome-icon :icon="item.icon" class="menu-icon" />
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
            class="custom-menu-item collapsed-item"
            :class="{ 'active-route': $route.path === item.to }"
          >
            <div class="menu-item-content">
              <font-awesome-icon :icon="item.icon" class="menu-icon" />
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
              <font-awesome-icon icon="fa-solid fa-building-user" class="menu-icon" />
              <span class="menu-text">Instituciones y Personal</span>
            </div>
            <font-awesome-icon 
              :icon="openDropdowns.institutions ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'" 
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
              class="dropdown-menu-item"
              :class="{ 'active-route': $route.path === item.to }"
            >
              <font-awesome-icon :icon="item.icon" class="menu-icon" />
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
            class="custom-menu-item collapsed-item"
            :class="{ 'active-route': $route.path === item.to }"
          >
            <div class="menu-item-content">
              <font-awesome-icon :icon="item.icon" class="menu-icon" />
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
              <font-awesome-icon icon="fa-solid fa-boxes-stacked" class="menu-icon" />
              <span class="menu-text">Inventario y Sustancias</span>
            </div>
            <font-awesome-icon 
              :icon="openDropdowns.inventory ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'" 
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
              class="dropdown-menu-item"
              :class="{ 'active-route': $route.path === item.to }"
            >
              <font-awesome-icon :icon="item.icon" class="menu-icon" />
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
            class="custom-menu-item collapsed-item"
            :class="{ 'active-route': $route.path === item.to }"
          >
            <div class="menu-item-content">
              <font-awesome-icon :icon="item.icon" class="menu-icon" />
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
          <font-awesome-icon icon="fa-solid fa-sign-out-alt" />
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
          <font-awesome-icon icon="fa-solid fa-question-circle" />
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
  router.push('/login')
}

// Menú Principal (siempre visible)
const mainMenu = ref([
  {
    label: 'Inicio',
    icon: 'fa-solid fa-home',
    to: '/inicio',
  },
  {
    label: 'Recepción',
    icon: 'fa-solid fa-truck-loading',
    to: '/receptions',
  },
])

// Seguridad y Usuarios
const securityMenu = ref([
  {
    label: 'Usuarios',
    icon: 'fa-solid fa-user-gear',
    to: '/users',
  },
  {
    label: 'Perfiles',
    icon: 'fa-solid fa-id-card',
    to: '/roles',
  },
])

// Geografía y Ubicaciones
const geographyMenu = ref([
  {
    label: 'Comunas',
    icon: 'fa-solid fa-map-location-dot',
    to: '/communes',
  },
  {
    label: 'Locaciones',
    icon: 'fa-solid fa-location-dot',
    to: '/locations',
  },
  {
    label: 'Destinos',
    icon: 'fa-solid fa-route',
    to: '/destinations',
  },
])

// Instituciones y Personal
const institutionsMenu = ref([
  {
    label: 'Tipo de Institución',
    icon: 'fa-solid fa-building-shield',
    to: '/institution-type',
  },
  {
    label: 'Instituciones',
    icon: 'fa-solid fa-building-columns',
    to: '/institutions',
  },
  {
    label: 'Grados',
    icon: 'fa-solid fa-ranking-star',
    to: '/grades',
  },
  {
    label: 'Policías',
    icon: 'fa-solid fa-user-police',
    to: '/polices',
  },
])

// Inventario y Sustancias
const inventoryMenu = ref([
  {
    label: 'Ubicación de Bodega',
    icon: 'fa-solid fa-warehouse',
    to: '/storages',
  },
  {
    label: 'Tipo de Droga',
    icon: 'fa-solid fa-tablets',
    to: '/types-substances',
  },
  {
    label: 'Tipo de Contenedor',
    icon: 'fa-solid fa-box-archive',
    to: '/packagings',
  },
  {
    label: 'Método de Destrucción',
    icon: 'fa-solid fa-trash-can',
    to: '/methods-destructions',
  },
])
</script>

<style scoped>
.diamond-sidebar {
  width: 270px;
  height: 100vh;
  background: linear-gradient(180deg, var(--surface-900) 0%, var(--surface-800) 100%);
  color: var(--surface-0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  padding: 1.5rem 1rem 1rem;
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

.logo-icon {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.brand {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
}

.toggle-btn {
  color: var(--surface-300) !important;
  width: 2rem;
  height: 2rem;
}

.logo-btn {
  color: var(--primary-color) !important;
  width: 2.5rem;
  height: 2.5rem;
}

/* Navegación */
.navigation-section {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.custom-menu {
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;
}

.menu-section {
  padding: 1rem 0.5rem 0.5rem;
  margin-top: 0.5rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--surface-400);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Items de menú normales */
.custom-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  color: var(--surface-300);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  margin-bottom: 0.25rem;
}

.custom-menu-item:hover {
  background: var(--surface-700);
  color: var(--surface-0);
  border-color: var(--surface-600);
}

.custom-menu-item.active-route {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-600));
  color: white;
  box-shadow: 0 4px 12px rgba(var(--primary-500), 0.3);
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
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.dropdown-header:hover {
  background: var(--surface-700);
  color: var(--surface-0);
  border-color: var(--surface-600);
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
  margin-left: 1.5rem;
}

.dropdown-open {
  max-height: 500px;
}

.dropdown-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  color: var(--surface-300);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-bottom: 0.125rem;
  border: 1px solid transparent;
}

.dropdown-menu-item:hover {
  background: var(--surface-700);
  color: var(--surface-0);
  border-color: var(--surface-600);
}

.dropdown-menu-item.active-route {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  box-shadow: 0 2px 8px rgba(var(--primary-500), 0.2);
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
  padding: 0.75rem !important;
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

.footer-actions {
  display: flex;
  gap: 0.5rem;
}

.footer-actions .p-button {
  color: var(--surface-400) !important;
  width: 2rem;
  height: 2rem;
}

.footer-actions .p-button:hover {
  color: var(--surface-0) !important;
  background: var(--surface-700) !important;
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
  font-size: 0.9rem !important;
  font-weight: 500;
}

/* Scrollbar personalizado */
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