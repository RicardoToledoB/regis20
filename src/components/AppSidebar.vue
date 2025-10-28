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
        <router-link 
          v-for="item in menuItems" 
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
          <Badge 
            v-if="item.badge && !collapsed" 
            :value="item.badge" 
            class="menu-badge"
            :severity="item.badgeSeverity"
          />
        </router-link>
        <br>
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
        
        <router-link 
          v-for="item in mantainersItems" 
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
          <Badge 
            v-if="item.badge && !collapsed" 
            :value="item.badge" 
            class="menu-badge"
            :severity="item.badgeSeverity"
          />
        </router-link>
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
          @click="$router.push('/')"
        >
          <font-awesome-icon icon="fa-solid fa-sign-out-alt" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const collapsed = ref(false)

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

// Menu items con FontAwesome icons
const menuItems = ref([
  {
    label: 'Inicio',
    icon: 'fa-solid fa-home',
    to: '/inicio',
    badge: null
  },
  {
    label: 'Recepcion',
    icon: 'fa-solid fa-inbox', // Cambiado a icono más apropiado
    to: '/receptions',
    badge: null
  },
])

const mantainersItems = ref([
  {
    label: 'Usuarios',
    icon: 'fa-solid fa-users',
    to: '/users',
  },
  {
    label: 'Policia',
    icon: 'fa-solid fa-shield-alt', // Icono más apropiado para policía
    to: '/polices',
  },
   {
    label: 'Institucion',
    icon: 'fa-solid fa-warehouse',
    to: '/institutions',
  },
  {
    label: 'Bodega',
    icon: 'fa-solid fa-warehouse',
    to: '/storages',
  },
  {
    label: 'Tipo Droga',
    icon: 'fa-solid fa-capsules',
    to: '/types-substances',
  },
  {
    label: 'Unidades',
    icon: 'fa-solid fa-building',
    to: '/unities',
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

.menu-badge {
  font-size: 0.7rem;
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