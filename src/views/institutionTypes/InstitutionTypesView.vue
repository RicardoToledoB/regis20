<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="institution-types-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Tipos de Institución</h1>
            <CreateInstitutionType @created="handleInstitutionTypeCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="institutionTypes"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="400px"
                  class="p-datatable-striped p-datatable-gridlines institution-types-table"
                >
                  <Column field="name" header="Nombre" />
                  <Column field="commune.name" header="Comuna" />
                  <Column field="institution.name" header="Institución" />
                  
                  <Column header="Fecha Creación">
                    <template #body="slotProps">
                      {{ formatDate(slotProps.data.createdAt) }}
                    </template>
                  </Column>

                  <Column header="Acciones" style="width: 15%">
                    <template #body="slotProps">
                      <EditInstitutionType
                        :institution-type="slotProps.data"
                        @updated="handleInstitutionTypeUpdated"
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
import CreateInstitutionType from '@/components/institutionsTypes/CreateInstitutionType.vue'
import EditInstitutionType from '@/components/institutionsTypes/EditInstitutionType.vue'
import institutionTypeService from '@/services/institutionTypesService'

export default {
  name: 'InstitutionTypesView',

  components: {
    PlantillaContenido,
    CreateInstitutionType,
    EditInstitutionType
  },

  setup() {
    const institutionTypes = ref([])

    const fetchInstitutionTypes = async () => {
      try {
        console.log('🔄 Recargando datos desde el API...')
        const { data } = await institutionTypeService.getAll()
        institutionTypes.value = data
        console.log('✅ Datos recargados correctamente')
      } catch (error) {
        console.error('❌ Error cargando tipos de institución:', error)
      }
    }

    // ✅ Modificado: Recargar todos los datos desde el API
    const handleInstitutionTypeCreated = () => {
      console.log('🎯 Recargando tabla después de crear...')
      fetchInstitutionTypes()
    }

    // ✅ Modificado: Recargar todos los datos desde el API
    const handleInstitutionTypeUpdated = () => {
      console.log('🎯 Recargando tabla después de actualizar...')
      fetchInstitutionTypes()
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('es-CL')
    }

    onMounted(() => {
      console.log('✅ Vista de tipos de institución cargada')
      fetchInstitutionTypes()
    })

    return {
      institutionTypes,
      fetchInstitutionTypes,
      handleInstitutionTypeCreated,
      handleInstitutionTypeUpdated,
      formatDate
    }
  }
}
</script>

<style scoped>
.institution-types-container {
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
  padding: 0.75rem !important;
  background: var(--surface-card);
}

:deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(even) > td) {
  background-color: var(--surface-section) !important;
}

:deep(.p-datatable .p-paginator) {
  padding: 0.5rem;
}

.institution-types-table {
  width: 100%;
  border-collapse: collapse;
}

.institution-types-table th,
.institution-types-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.institution-types-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
</style>