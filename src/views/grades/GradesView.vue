<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="grades-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Grados</h1>
            <CreateGrade @created="handleGradeCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="grades"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="400px"
                  class="p-datatable-striped p-datatable-gridlines grades-table"
                >
                  <Column field="name" header="Nombre" />
                  <Column field="description" header="Descripción" />
                  <Column field="institutionType.name" header="Tipo de Institución" />
                  
                  <Column header="Fecha Creación">
                    <template #body="slotProps">
                      {{ formatDate(slotProps.data.createdAt) }}
                    </template>
                  </Column>

                  <Column header="Acciones" style="width: 15%">
                    <template #body="slotProps">
                      <EditGrade
                        :grade="slotProps.data"
                        @updated="handleGradeUpdated"
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
import CreateGrade from '@/components/grades/CreateGrade.vue'
import EditGrade from '@/components/grades/EditGrade.vue'
import gradeService from '@/services/gradesService'

export default {
  name: 'GradesView',

  components: {
    PlantillaContenido,
    CreateGrade,
    EditGrade
  },

  setup() {
    const grades = ref([])

    const fetchGrades = async () => {
      try {
        console.log('🔄 Recargando datos de grados desde el API...')
        const { data } = await gradeService.getAll()
        grades.value = data
        console.log('✅ Datos de grados recargados correctamente')
      } catch (error) {
        console.error('❌ Error cargando grados:', error)
      }
    }

    // ✅ Recargar todos los datos desde el API
    const handleGradeCreated = () => {
      console.log('🎯 Recargando tabla después de crear...')
      fetchGrades()
    }

    // ✅ Recargar todos los datos desde el API
    const handleGradeUpdated = () => {
      console.log('🎯 Recargando tabla después de actualizar...')
      fetchGrades()
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('es-CL')
    }

    onMounted(() => {
      console.log('✅ Vista de grados cargada')
      fetchGrades()
    })

    return {
      grades,
      fetchGrades,
      handleGradeCreated,
      handleGradeUpdated,
      formatDate
    }
  }
}
</script>

<style scoped>
.grades-container {
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

.grades-table {
  width: 100%;
  border-collapse: collapse;
}

.grades-table th,
.grades-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.grades-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
</style>