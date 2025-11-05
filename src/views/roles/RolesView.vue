<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="roles-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Perfiles</h1>
            <CreateRole @created="handleRoleCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="roles"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="350px"
                  class="p-datatable-striped p-datatable-gridlines roles-table"
                >
                  <Column field="name" header="Nombre" />

                  <Column header="Acciones" style="width: 20%">
                    <template #body="slotProps">
                      <!-- ✅ Renderiza un EditRole por cada fila -->
                      <EditRole
                        :role="slotProps.data"
                        @updated="handleRoleUpdated"
                      />
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
import { ref, onMounted } from 'vue'
import PlantillaContenido from '../template/PlantillaContenido.vue'
import CreateRole from '../../components/roles/CreateRole.vue'
import EditRole from '@/components/roles/EditRole.vue'
import rolesService from '@/services/rolesService'

export default {
  name: 'rolesView',

  components: {
    PlantillaContenido,
    CreateRole,
    EditRole
  },

  setup() {
    const roles = ref([])
    const fetchroles = async () => {
      try {
        const { data } = await rolesService.getAll()
        roles.value = data
      } catch (error) {
        console.error('❌ Error cargando comunas:', error)
      }
    }

    const handleRoleCreated = (newRole) => {
      roles.value.push(newRole)
    }

    const handleRoleUpdated = (updatedRole) => {
      const index = roles.value.findIndex((c) => c.id === updatedRole.id)
      if (index !== -1) {
        roles.value[index] = updatedRole
      }
    }

    onMounted(() => {
      console.log('✅ Vista de comunas cargada')
      fetchroles()
    })

    return {
      roles,
      fetchroles,
      handleRoleCreated,
      handleRoleUpdated
    }
  }
}
</script>

<style scoped>
.roles-container {
  padding: 1rem;
}

.table-container {
  overflow-x: auto;
}

:deep(.p-datatable-table) {
  border-spacing: 0 0.5rem !important;
}

:deep(.p-datatable-thead > tr > th) {
  background: var(--surface-ground) !important;
  font-weight: bold;
  padding: 1rem !important;
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

.roles-table {
  width: 100%;
  border-collapse: collapse;
}

.roles-table th,
.roles-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.roles-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
</style>