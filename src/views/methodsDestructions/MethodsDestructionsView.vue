<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="methodsDestructions-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Metodos de Destucción</h1>
            <CreateMethodDestruction @created="handleMethodDestructionCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="methodsDestructions"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="350px"
                  class="p-datatable-striped p-datatable-gridlines methodsDestructions-table"
                >
                  <Column field="name" header="Nombre" />

                  <Column header="Acciones" style="width: 20%">
                    <template #body="slotProps">
                      <!-- ✅ Renderiza un EditMethodDestruction por cada fila -->
                      <EditMethodDestruction
                        :methodDestruction="slotProps.data"
                        @updated="handleMethodDestructionUpdated"
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
import CreateMethodDestruction from '../../components/methodsDestructions/CreateMethodDestruction.vue'
import EditMethodDestruction from '@/components/methodsDestructions/EditMethodDestruction.vue'
import methodsDestructionsService from '@/services/methodsDestructionsService'

export default {
  name: 'methodsDestructionsView',

  components: {
    PlantillaContenido,
    CreateMethodDestruction,
    EditMethodDestruction
  },

  setup() {
    const methodsDestructions = ref([])
    const fetchmethodsDestructions = async () => {
      try {
        const { data } = await methodsDestructionsService.getAll()
        methodsDestructions.value = data
      } catch (error) {
        console.error('❌ Error cargando comunas:', error)
      }
    }

    const handleMethodDestructionCreated = (newMethodDestruction) => {
      methodsDestructions.value.push(newMethodDestruction)
    }

    const handleMethodDestructionUpdated = (updatedMethodDestruction) => {
      const index = methodsDestructions.value.findIndex((c) => c.id === updatedMethodDestruction.id)
      if (index !== -1) {
        methodsDestructions.value[index] = updatedMethodDestruction
      }
    }

    onMounted(() => {
      console.log('✅ Vista de comunas cargada')
      fetchmethodsDestructions()
    })

    return {
      methodsDestructions,
      fetchmethodsDestructions,
      handleMethodDestructionCreated,
      handleMethodDestructionUpdated
    }
  }
}
</script>

<style scoped>
.methodsDestructions-container {
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

.methodsDestructions-table {
  width: 100%;
  border-collapse: collapse;
}

.methodsDestructions-table th,
.methodsDestructions-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.methodsDestructions-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
</style>