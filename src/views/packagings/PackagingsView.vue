<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="packagings-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Tipo de contenedor</h1>
            <CreatePackaging @created="handlePackagingCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="packagings"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="350px"
                  class="p-datatable-striped p-datatable-gridlines packagings-table"
                >
                  <Column field="name" header="Nombre" />

                  <Column header="Acciones" style="width: 20%">
                    <template #body="slotProps">
                      <!-- ✅ Renderiza un EditPackaging por cada fila -->
                      <EditPackaging
                        :packaging="slotProps.data"
                        @updated="handlePackagingUpdated"
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
import CreatePackaging from '../../components/packagings/CreatePackaging.vue'
import EditPackaging from '@/components/packagings/EditPackaging.vue'
import packagingsService from '@/services/packagingsService'

export default {
  name: 'packagingsView',

  components: {
    PlantillaContenido,
    CreatePackaging,
    EditPackaging
  },

  setup() {
    const packagings = ref([])
    const fetchpackagings = async () => {
      try {
        const { data } = await packagingsService.getAll()
        packagings.value = data
      } catch (error) {
        console.error('❌ Error cargando comunas:', error)
      }
    }

    const handlePackagingCreated = (newPackaging) => {
      packagings.value.push(newPackaging)
    }

    const handlePackagingUpdated = (updatedPackaging) => {
      const index = packagings.value.findIndex((c) => c.id === updatedPackaging.id)
      if (index !== -1) {
        packagings.value[index] = updatedPackaging
      }
    }

    onMounted(() => {
      console.log('✅ Vista de comunas cargada')
      fetchpackagings()
    })

    return {
      packagings,
      fetchpackagings,
      handlePackagingCreated,
      handlePackagingUpdated
    }
  }
}
</script>

<style scoped>
.packagings-container {
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

.packagings-table {
  width: 100%;
  border-collapse: collapse;
}

.packagings-table th,
.packagings-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.packagings-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
</style>