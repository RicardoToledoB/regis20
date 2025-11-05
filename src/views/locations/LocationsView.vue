<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="locations-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Locaciones</h1>
            <CreateLocation @created="handleLocationCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="locations"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="350px"
                  class="p-datatable-striped p-datatable-gridlines locations-table"
                >
                  <Column field="name" header="Nombre" />

                  <Column header="Acciones" style="width: 20%">
                    <template #body="slotProps">
                      <!-- ✅ Renderiza un EditLocation por cada fila -->
                      <EditLocation
                        :location="slotProps.data"
                        @updated="handleLocationUpdated"
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
import CreateLocation from '../../components/locations/CreateLocation.vue'
import EditLocation from '@/components/locations/EditLocation.vue'
import locationsService from '@/services/locationsService'

export default {
  name: 'locationsView',

  components: {
    PlantillaContenido,
    CreateLocation,
    EditLocation
  },

  setup() {
    const locations = ref([])
    const fetchlocations = async () => {
      try {
        const { data } = await locationsService.getAll()
        locations.value = data
      } catch (error) {
        console.error('❌ Error cargando comunas:', error)
      }
    }

    const handleLocationCreated = (newLocation) => {
      locations.value.push(newLocation)
    }

    const handleLocationUpdated = (updatedLocation) => {
      const index = locations.value.findIndex((c) => c.id === updatedLocation.id)
      if (index !== -1) {
        locations.value[index] = updatedLocation
      }
    }

    onMounted(() => {
      console.log('✅ Vista de comunas cargada')
      fetchlocations()
    })

    return {
      locations,
      fetchlocations,
      handleLocationCreated,
      handleLocationUpdated
    }
  }
}
</script>

<style scoped>
.locations-container {
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

.locations-table {
  width: 100%;
  border-collapse: collapse;
}

.locations-table th,
.locations-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.locations-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
</style>