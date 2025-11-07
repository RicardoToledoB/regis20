<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="police-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Policías</h1>
            <CreatePolice @created="handlePoliceCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="police"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  scrollHeight="400px"
                  class="p-datatable-striped p-datatable-gridlines police-table"
                >
                  <Column header="Nombre Completo">
                    <template #body="slotProps">
                      {{ getFullName(slotProps.data) }}
                    </template>
                  </Column>
                  <Column field="rut" header="RUT" />
                  <Column field="email" header="Email" />
                  <Column field="cellphone" header="Celular" />
                  <Column field="institutionType.name" header="Tipo Institución" />
                  <Column field="grade.name" header="Grado" />
                  
                  <Column header="Fecha Creación">
                    <template #body="slotProps">
                      {{ formatDate(slotProps.data.createdAt) }}
                    </template>
                  </Column>

                  <Column header="Acciones" >
                    <template #body="slotProps">
                      <EditPolice
                        :police="slotProps.data"
                        @updated="handlePoliceUpdated"
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
import CreatePolice from '@/components/polices/CreatePolice.vue'
import EditPolice from '@/components/polices/EditPolice.vue'
import policeService from '@/services/policesService'

export default {
  name: 'PoliceView',

  components: {
    PlantillaContenido,
    CreatePolice,
    EditPolice
  },

  setup() {
    const police = ref([])

    const fetchPolice = async () => {
      try {
        console.log('🔄 Recargando datos de policías desde el API...')
        const { data } = await policeService.getAll()
        police.value = data
        console.log('✅ Datos de policías recargados correctamente')
      } catch (error) {
        console.error('❌ Error cargando policías:', error)
      }
    }

    // ✅ Recargar todos los datos desde el API
    const handlePoliceCreated = () => {
      console.log('🎯 Recargando tabla después de crear...')
      fetchPolice()
    }

    // ✅ Recargar todos los datos desde el API
    const handlePoliceUpdated = () => {
      console.log('🎯 Recargando tabla después de actualizar...')
      fetchPolice()
    }

    const getFullName = (policeData) => {
      const names = [policeData.firstName, policeData.secondName].filter(Boolean).join(' ')
      const lastNames = [policeData.firstLastName, policeData.secondLastName].filter(Boolean).join(' ')
      return `${names} ${lastNames}`
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('es-CL')
    }

    onMounted(() => {
      console.log('✅ Vista de policías cargada')
      fetchPolice()
    })

    return {
      police,
      fetchPolice,
      handlePoliceCreated,
      handlePoliceUpdated,
      getFullName,
      formatDate
    }
  }
}
</script>

<style scoped>
.police-container {
  padding: 1rem;
}

.table-container {
  overflow-x: auto;
}



</style>