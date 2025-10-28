<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-right">
        <span class="page-title">{{ currentPageTitle }}</span>
      </div>
      
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentPageTitle = computed(() => {
  const routeName = route.name
  switch (routeName) {
    case 'Home': return 'inicio'
    case 'Users': return 'Gestión de Usuarios'
    case 'Receptions': return 'Recepcion'
    case 'Polices': return 'Policia'
    case 'Institutions': return 'Institucion'
    case 'Storages': return 'Bodega'
    case 'TypesSubstances': return 'Tipo de Sustancia'
    case 'Unities': return 'Unidades'

    default: return 'Recepcion'
    //el case viene del name del index.js de las rutas
  }
})
</script>

<style scoped>
.app-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  height: 60px;
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  z-index: 999;
  transition: left 0.3s ease;
}

.sidebar-collapsed ~ .app-header {
  left: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 1.5rem;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.header-right {
  display: flex;
  gap: 0.5rem;
}

.header-btn {
  color: #6c757d !important;
}
</style>