<template>
  <PlantillaContenido>
    <template #contenido>
 <div class="users-container">
    <div class="page-content">
      <div class="flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Bodega</h1>
        <CreateStorage></CreateStorage>
      </div>
      
      <Card>
        <template #content>
          <div class="table-container">
            <table class="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="storage in storages" :key="storage.id">
                  <td>{{ storage.id }}</td>
                  <td>{{ storage.name }}</td>
                  
                  <td>
                    <Button 
                      icon="pi pi-pencil" 
                      class="p-button-text p-button-success" 
                      v-tooltip="'Editar'"
                    />
                   
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </Card>
    </div>
  </div>
    </template>
  </PlantillaContenido>
 
</template>

<script setup>
import { ref } from 'vue'
import CreateStorage from '@/components/storages/CreateStorage.vue'
import PlantillaContenido from '../template/PlantillaContenido.vue'
const storages = ref([
  { id: 1, name: 'Bodega 820'},
  { id: 2, name: 'Bodega 829'}
])
components:{CreateStorage}
</script>

<style scoped>
.users-container {
  padding: 1rem;
}


.table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.users-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
}
</style>