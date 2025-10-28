<template>
      <PlantillaContenido>
          <template #contenido>
 <div class="home-container" >
    <div class="page-content">
      <h1>Inicio</h1>
      
      <div class="grid">
        <div class="col-12 md:col-6 lg:col-3">
          <Card class="stats-card">
            <template #content>
              <div class="stat-item">
                <i class="pi pi-users stat-icon"></i>
                <div class="stat-info">
                  <span class="stat-number">1,254</span>
                  <span class="stat-label">Usuarios</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <Card class="stats-card">
            <template #content>
              <div class="stat-item">
                <i class="pi pi-shopping-cart stat-icon"></i>
                <div class="stat-info">
                  <span class="stat-number">524</span>
                  <span class="stat-label">Ventas</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <Card class="stats-card">
            <template #content>
              <div class="stat-item">
                <i class="pi pi-chart-line stat-icon"></i>
                <div class="stat-info">
                  <span class="stat-number">$12.4k</span>
                  <span class="stat-label">Ingresos</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
        
        <div class="col-12 md:col-6 lg:col-3">
          <Card class="stats-card">
            <template #content>
              <div class="stat-item">
                <i class="pi pi-comments stat-icon"></i>
                <div class="stat-info">
                  <span class="stat-number">89</span>
                  <span class="stat-label">Comentarios</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      
      <div class="grid mt-4">
        <div class="col-12 lg:col-8">
          <Card>
            <template #title>Actividad Reciente</template>
            <template #content>
              <p>Gráficos y actividad reciente irían aquí...</p>
            </template>
          </Card>
        </div>
        
        <div class="col-12 lg:col-4">
          <Card>
            <template #title>Notificaciones</template>
            <template #content>
              <p>Lista de notificaciones recientes...</p>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
</PlantillaContenido>

 
</template>

<script setup>
import PlantillaContenido from './template/PlantillaContenido.vue';
// Lógica del dashboard puede ir aquí
</script>

