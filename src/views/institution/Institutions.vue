<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="users-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Gestión de Instituciones</h1>
            <CreateInstitution @created="handleInstitutionCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="institutions"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5,10,20,50]"
                  scrollable
                  scrollHeight="350px"
                  class="p-datatable-striped p-datatable-gridlines users-table"
                >
                  <Column field="id" header="ID" style="width: 10%"></Column>
                  <Column field="name" header="Nombre" style="width: 60%"></Column>
                  <Column header="Acciones" style="width: 30%">
                    <template #body="slotProps">
                      <EditInstitution 
                        :institution="slotProps.data" 
                        @updated="updateInstitutionInTable"
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
import institutionsService from '@/services/institutionsService.js'
import CreateInstitution from '@/components/institutions/CreateInstitution.vue'
import EditInstitution from '@/components/institutions/EditInstitution.vue' // 👉 la crearás igual que EditUser.vue
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default {
  name: 'InstitutionsView',
  components: {
    PlantillaContenido,
    CreateInstitution,
    EditInstitution,
    Card,
    DataTable,
    Column
  },

  setup() {
    const institutions = ref([])

    const fetchInstitutions = async () => {
      try {
        const { data } = await institutionsService.getAll()
        institutions.value = data
      } catch (error) {
        console.error("❌ Error cargando instituciones:", error)
      }
    }

    const handleInstitutionCreated = (newInstitution) => {
      institutions.value.push(newInstitution)
    }

    const updateInstitutionInTable = (updatedInstitution) => {
      const index = institutions.value.findIndex(i => i.id === updatedInstitution.id)
      if (index !== -1) institutions.value[index] = updatedInstitution
    }

    onMounted(() => {
      console.log("✅ Vista de instituciones cargada")
      fetchInstitutions()
    })

    return {
      institutions,
      fetchInstitutions,
      handleInstitutionCreated,
      updateInstitutionInTable
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

.users-table {
  width: 100%;
  border-collapse: collapse;
}
</style>
