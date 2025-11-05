<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="communes-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Comunas</h1>
            <CreateCommune @created="handleCommuneCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="communes"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="350px"
                  class="p-datatable-striped p-datatable-gridlines communes-table"
                >
                  <Column field="name" header="Nombre" />

                  <Column header="Acciones" style="width: 20%">
                    <template #body="slotProps">
                      <!-- ✅ Renderiza un EditCommune por cada fila -->
                      <EditCommune
                        :commune="slotProps.data"
                        @updated="handleCommuneUpdated"
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
import CreateCommune from '../../components/communes/CreateCommune.vue'
import EditCommune from '@/components/communes/EditCommune.vue'
import communesService from '@/services/communesService'

export default {
  name: 'CommunesView',

  components: {
    PlantillaContenido,
    CreateCommune,
    EditCommune
  },

  setup() {
    const communes = ref([])

    const fetchCommunes = async () => {
      try {
        const { data } = await communesService.getAll()
        communes.value = data
      } catch (error) {
        console.error('❌ Error cargando comunas:', error)
      }
    }

    const handleCommuneCreated = (newCommune) => {
      communes.value.push(newCommune)
    }

    const handleCommuneUpdated = (updatedCommune) => {
      const index = communes.value.findIndex((c) => c.id === updatedCommune.id)
      if (index !== -1) {
        communes.value[index] = updatedCommune
      }
    }

    onMounted(() => {
      console.log('✅ Vista de comunas cargada')
      fetchCommunes()
    })

    return {
      communes,
      fetchCommunes,
      handleCommuneCreated,
      handleCommuneUpdated
    }
  }
}
</script>

<style scoped>
.communes-container {
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

.communes-table {
  width: 100%;
  border-collapse: collapse;
}

.communes-table th,
.communes-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.communes-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
</style>