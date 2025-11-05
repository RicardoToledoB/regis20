<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="destinations-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Destinos</h1>
            <CreateDestination @created="handleDestinationCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="destinations"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="350px"
                  class="p-datatable-striped p-datatable-gridlines destinations-table"
                >
                  <Column field="name" header="Nombre" />

                  <Column header="Acciones" style="width: 20%">
                    <template #body="slotProps">
                      <!-- ✅ Renderiza un EditDestination por cada fila -->
                      <EditDestination
                        :destination="slotProps.data"
                        @updated="handleDestinationUpdated"
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
import CreateDestination from '../../components/destinations/CreateDestination.vue'
import EditDestination from '@/components/destinations/EditDestination.vue'
import destinationsService from '@/services/destinationsService'

export default {
  name: 'destinationsView',

  components: {
    PlantillaContenido,
    CreateDestination,
    EditDestination
  },

  setup() {
    const destinations = ref([])
    const fetchdestinations = async () => {
      try {
        const { data } = await destinationsService.getAll()
        destinations.value = data
      } catch (error) {
        console.error('❌ Error cargando comunas:', error)
      }
    }

    const handleDestinationCreated = (newDestination) => {
      destinations.value.push(newDestination)
    }

    const handleDestinationUpdated = (updatedDestination) => {
      const index = destinations.value.findIndex((c) => c.id === updatedDestination.id)
      if (index !== -1) {
        destinations.value[index] = updatedDestination
      }
    }

    onMounted(() => {
      console.log('✅ Vista de comunas cargada')
      fetchdestinations()
    })

    return {
      destinations,
      fetchdestinations,
      handleDestinationCreated,
      handleDestinationUpdated
    }
  }
}
</script>

<style scoped>
.destinations-container {
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

.destinations-table {
  width: 100%;
  border-collapse: collapse;
}

.destinations-table th,
.destinations-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.destinations-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
</style>