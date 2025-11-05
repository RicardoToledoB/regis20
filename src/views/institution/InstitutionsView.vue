<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="institutions-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Instituciones</h1>
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
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="350px"
                  class="p-datatable-striped p-datatable-gridlines institutions-table"
                >
                  <Column field="name" header="Nombre" />

                  <Column header="Acciones" style="width: 20%">
                    <template #body="slotProps">
                      <!-- ✅ Renderiza un EditInstitution por cada fila -->
                      <EditInstitution
                        :institution="slotProps.data"
                        @updated="handleInstitutionUpdated"
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
import CreateInstitution from '../../components/institutions/CreateInstitution.vue'
import EditInstitution from '@/components/institutions/EditInstitution.vue'
import institutionsService from '@/services/institutionsService'

export default {
  name: 'institutionsView',

  components: {
    PlantillaContenido,
    CreateInstitution,
    EditInstitution
  },

  setup() {
    const institutions = ref([])
    const fetchinstitutions = async () => {
      try {
        const { data } = await institutionsService.getAll()
        institutions.value = data
      } catch (error) {
        console.error('❌ Error cargando comunas:', error)
      }
    }

    const handleInstitutionCreated = (newInstitution) => {
      institutions.value.push(newInstitution)
    }

    const handleInstitutionUpdated = (updatedInstitution) => {
      const index = institutions.value.findIndex((c) => c.id === updatedInstitution.id)
      if (index !== -1) {
        institutions.value[index] = updatedInstitution
      }
    }

    onMounted(() => {
      console.log('✅ Vista de comunas cargada')
      fetchinstitutions()
    })

    return {
      institutions,
      fetchinstitutions,
      handleInstitutionCreated,
      handleInstitutionUpdated
    }
  }
}
</script>

<style scoped>
.institutions-container {
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

.institutions-table {
  width: 100%;
  border-collapse: collapse;
}

.institutions-table th,
.institutions-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.institutions-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
</style>