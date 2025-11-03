<template>
  <PlantillaContenido>
    <template #contenido>
<div class="users-container" slot="contenido">
    <div class="page-content">
      <div class="flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Usuarios</h1>
        <CreateUser @created="handleUserCreated"></CreateUser>
      </div>
      
      <Card>
        <template #content>
          <div class="table-container">
          <DataTable :value="users" paginator size="large" :rows="5" :rowsPerPageOptions="[5,10,20,50]" scrollable scrollHeight="350px" class="p-datatable-striped p-datatable-gridlines users-table">
            <Column field="firstName" header="Nombre" style="width: 25%"></Column>
            <Column field="email" header="Correo" style="width: 30%"></Column>
            <Column field="rut" header="RUT" style="width: 20%"></Column>
            <Column field="username" header="Nombre de Usuario" style="width: 15%"></Column>
            <Column header="Acciones" style="width: 10%">
              <template #body="slotProps">
                <EditUser :userId="slotProps.data.id" @updated="updateUserInTable"/>
              </template>
            </Column>
          </DataTable>
          </div>
        </template>
      </Card>
    </div>
  </div>
    </template>
  </PlantillaContenido>
  
</template>

<script>
import { ref } from 'vue'
import PlantillaContenido from '../template/PlantillaContenido.vue'
import CreateUser from '../../components/users/CreateUser.vue'
import userService from '@/services/usersService'
import EditUser from '@/components/users/EditUser.vue'
export default {
  name: 'UsersView',

  components: {
    PlantillaContenido,
    CreateUser, 
    EditUser
  },

  setup() {
    const users = ref([
 
    ])

 const fetchUsers = async () => {
      try {
        const { data } = await userService.getAll()
        users.value = data
      } catch (error) {
        console.error("❌ Error cargando usuarios:", error)
      }
    }

    const handleUserCreated = (newUser) => {
      users.value.push(newUser)
    }

    return {
      users,
      fetchUsers,
      handleUserCreated
    }
  },

  mounted() {
    console.log("✅ Vista de usuarios cargada")
    this.fetchUsers()
  },
  methods: {
  updateUserInTable(updatedUser) {
    const index = this.users.findIndex(u => u.id === updatedUser.id)
    if(index !== -1) this.users[index] = updatedUser
  }
}
}
</script>


<style scoped>
.users-container {
  padding: 1.5rem;
}

.table-container {
  margin-top: 1rem;
}

:deep(.p-datatable-table) {
  border-spacing: 0 0.5rem !important;
}

:deep(.p-datatable-thead > tr > th) {
  background: var(--surface-ground) !important;
  font-weight: bold;
  padding: rem !important;
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 0.5rem !important;
  background: var(--surface-card);
}

:deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(even) > td) {
  background-color: var(--surface-section) !important;
}

:deep(.p-datatable .p-paginator) {
  padding: 0.5rem;
}

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