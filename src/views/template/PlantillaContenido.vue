<template>
  <div class="diamond-layout">
    <AppSidebar />
    <AppHeader />
    <main class="diamond-main-content">
      <div class="content-wrapper">
        <!-- SOLO router-view aquí -->
         <slot name="contenido"></slot>
      </div>
    </main>
  </div>
  
  <Toast position="top-right" />
</template>

<script>
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import Toast from 'primevue/toast'

export default {
  name: "PLantillaContenido",
  components: {
    AppSidebar,
    AppHeader,
    Toast
  }
}
</script>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--surface-50);
  color: var(--surface-900);
}

.diamond-layout {
  display: flex;
  min-height: 100vh;
}

.diamond-main-content {
  flex: 1;
  margin-left: 270px;
  margin-top: 50px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: calc(100vh - 70px);
}

.sidebar-collapsed ~ .diamond-main-content {
  margin-left: 70px;
}

.content-wrapper {
  padding: 2rem;
  min-height: 100%;
}

/* Variables CSS personalizadas para el tema Diamond */
:root {
  --primary-color: #6366F1;
  --primary-50: #eef2ff;
  --primary-100: #e0e7ff;
  --primary-500: #6366F1;
  --primary-600: #4f46e5;
  --surface-0: #ffffff;
  --surface-50: #f8fafc;
  --surface-100: #f1f5f9;
  --surface-200: #e2e8f0;
  --surface-300: #cbd5e1;
  --surface-400: #94a3b8;
  --surface-500: #64748b;
  --surface-600: #475569;
  --surface-700: #334155;
  --surface-800: #1e293b;
  --surface-900: #0f172a;
}

/* Mejoras globales para PrimeVue */
.p-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid var(--surface-200);
  border-radius: 12px;
}

.p-card .p-card-title {
  color: var(--surface-900);
  font-weight: 600;
  font-size: 1.25rem;
}

.p-button {
  border-radius: 8px;
  font-weight: 500;
}

/* Estilos específicos para botones PrimeVue */
.p-button {
  padding: 0.50rem 0.78rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.p-button .p-button-label {
  font-weight: 500;
}

/* Asegurar que los iconos dentro de los botones tengan espacio */
.p-button .p-button-icon {
  margin-right: 0.1rem;
}

.p-button:has(.p-button-icon:only-child) {
  padding: 0.75rem;
}
.home-container {
  padding: 1rem;
}



.stats-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  display: block;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}
.settings-container {
  padding: 1rem;
}



.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
}

.field-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>