<template>
  <PlantillaContenido>
    <template #contenido>
<div class="users-container">
    <div class="page-content">
      <div class="flex justify-content-between align-items-center mb-4">
        <h1>Recepción</h1>
        <CreateReception></CreateReception>
      </div>
      
      <Card>
        <template #content>
          <div class="table-container">
            <table class="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.role }}</td>
                  <td>
                    <span :class="`status-badge status-${user.status}`">
                      {{ user.status }}
                    </span>
                  </td>
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
import CreateReception from '@/components/register/CreateRegister.vue'
import PlantillaContenido from '../template/PlantillaContenido.vue'
const users = ref([
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'María García', email: 'maria@example.com', role: 'User', status: 'active' },
  { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'User', status: 'inactive' },
  { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'Moderator', status: 'active' }
])
components:{CreateReception}
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