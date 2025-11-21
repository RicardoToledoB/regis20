<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="storages-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Almacenes / Contramuestras</h1>
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="storages"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="400px"
                  class="p-datatable-striped p-datatable-gridlines storages-table"
                >
                  <Column field="id" header="#" />
                  <Column header="Sustancia">
                    <template #body="slotProps">
                      {{ slotProps.data.substance?.nue || slotProps.data.substance?.id || '—' }}
                    </template>
                  </Column>
                  <Column header="Recepción">
                    <template #body="slotProps">
                      {{ slotProps.data.reception?.number || '—' }}
                    </template>
                  </Column>
                  <Column field="weight" header="Peso (gr)" />
                  <Column header="Ubicación">
                    <template #body="slotProps">
                      {{ slotProps.data.storageLocation?.name || '—' }}
                    </template>
                  </Column>
                  <Column field="observation" header="Observación" />
                  <Column header="Fecha">
                    <template #body="slotProps">
                      {{ formatDate(slotProps.data.createdAt) }}
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
import storagesService from '@/services/storagesService.js'

export default {
  name: 'StoragesView',

  components: {
    PlantillaContenido,
  },

  setup() {
    const storages = ref([])

    const fetchStorages = async () => {
      try {
        console.log('🔄 Recargando datos de almacenamientos desde el API...')
        const { data } = await storagesService.getAll()
        storages.value = data.content || data || []
        console.log('✅ Datos de almacenamientos recargados correctamente')
      } catch (error) {
        console.error('❌ Error cargando almacenamientos:', error)
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('es-CL')
    }

    onMounted(() => {
      console.log('✅ Vista de almacenamientos cargada')
      fetchStorages()
    })

    return {
      storages,
      fetchStorages,
      formatDate,
    }
  },
}
</script>

<style scoped>
.storages-container {
  padding: 1rem;
}

.table-container {
  overflow-x: auto;
}
</style>
