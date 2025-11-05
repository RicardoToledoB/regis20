<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="storagesLocations-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Ubicación de Bodegas</h1>
            <CreateStorageLocation @created="handleStorageLocationCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="storagesLocations"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="350px"
                  class="p-datatable-striped p-datatable-gridlines storagesLocations-table"
                >
                  <Column field="name" header="Nombre" />

                  <Column header="Acciones" style="width: 20%">
                    <template #body="slotProps">
                      <!-- ✅ Renderiza un EditStorageLocation por cada fila -->
                      <EditStorageLocation
                        :storageLocation="slotProps.data"
                        @updated="handleStorageLocationUpdated"
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
import CreateStorageLocation from '@/components/storagesLocations/CreateStorageLocation.vue'
import EditStorageLocation from '@/components/storagesLocations/EditStorageLocation.vue'
import storagesLocationsService from '@/services/storagesLocationsService'

export default {
  name: 'storagesLocationsView',

  components: {
    PlantillaContenido,
    CreateStorageLocation,
    EditStorageLocation
  },

  setup() {
    const storagesLocations = ref([])
    const fetchstoragesLocations = async () => {
      try {
        const { data } = await storagesLocationsService.getAll()
        storagesLocations.value = data
      } catch (error) {
        console.error('❌ Error cargando comunas:', error)
      }
    }

    const handleStorageLocationCreated = (newStorageLocation) => {
      storagesLocations.value.push(newStorageLocation)
    }

    const handleStorageLocationUpdated = (updatedStorageLocation) => {
      const index = storagesLocations.value.findIndex((c) => c.id === updatedStorageLocation.id)
      if (index !== -1) {
        storagesLocations.value[index] = updatedStorageLocation
      }
    }

    onMounted(() => {
      console.log('✅ Vista de comunas cargada')
      fetchstoragesLocations()
    })

    return {
      storagesLocations,
      fetchstoragesLocations,
      handleStorageLocationCreated,
      handleStorageLocationUpdated
    }
  }
}
</script>

<style scoped>
.storagesLocations-container {
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

.storagesLocations-table {
  width: 100%;
  border-collapse: collapse;
}

.storagesLocations-table th,
.storagesLocations-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.storagesLocations-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
</style>