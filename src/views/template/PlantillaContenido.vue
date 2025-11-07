<template>
  <div class="diamond-layout">
    <AppSidebar />
    <AppHeader />
    <main class="diamond-main-content">
      <div class="content-wrapper">
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
  name: "PlantillaContenido",
  components: {
    AppSidebar,
    AppHeader,
    Toast
  }
}
</script>

<style scoped>
.diamond-layout {
  display: flex;
  min-height: 100vh;
}

.diamond-main-content {
  flex: 1;
  margin-left: 270px;
  margin-top: 60px;
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 60px);
}

.sidebar-collapsed ~ .diamond-main-content {
  margin-left: 70px;
}

.content-wrapper {
  padding: 1rem;
  min-height: 100%;
}
</style>