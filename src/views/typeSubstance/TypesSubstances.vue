<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="users-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Tipos de Sustancias</h1>
            <CreateSubstance @created="handleSubstancesCreated"></CreateSubstance>
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="typesSubstances"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="350px"
                  class="p-datatable-striped p-datatable-gridlines users-table"
                >
                  <Column field="name" header="Nombre" style="width: 25%"></Column>

                  <Column header="Acciones" style="width: 10%">
                    <template #body="slotProps">
                      <EditSubstance
                        :substance="slotProps.data"
                        @updated="handleSubstanceUpdated"
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
import { ref } from 'vue'
import PlantillaContenido from '../template/PlantillaContenido.vue'
import CreateSubstance from '../../components/typesSubtance/CreateSubstance.vue'
import EditSubstance from '../../components/typesSubtance/EditSubstance.vue'
import substances_types from '@/services/substancesTypesService'

export default {
  name: 'TypesSubstancesView',

  components: {
    PlantillaContenido,
    CreateSubstance,
    EditSubstance,
  },

  setup() {
    const typesSubstances = ref([])

    const fetchSubstance = async () => {
      try {
        const { data } = await substances_types.getAll()
        typesSubstances.value = data
      } catch (error) {
        console.error('❌ Error cargando Sustancia:', error)
      }
    }

    const handleSubstancesCreated = (newSubstance) => {
      typesSubstances.value.push(newSubstance)
    }

    const handleSubstanceUpdated = (updatedSubstance) => {
      const index = typesSubstances.value.findIndex((s) => s.id === updatedSubstance.id)
      if (index !== -1) {
        typesSubstances.value[index] = updatedSubstance
      }
    }

    return {
      typesSubstances,
      fetchSubstance,
      handleSubstancesCreated,
      handleSubstanceUpdated,
    }
  },

  mounted() {
    console.log('✅ Vista de sustancias cargada')
    this.fetchSubstance()
  },
}
</script>

<style scoped>
.users-container {
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
  padding: rem !important;
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

.users-table th,
.users-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.users-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
