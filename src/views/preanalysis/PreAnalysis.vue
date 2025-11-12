<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="preanalysis-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Gestión de Pre-Análisis</h1>
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  v-model:filters="filters"
                  :value="preAnalysisList"
                  paginator
                  size="small"
                  :rows="10"
                  :rowsPerPageOptions="[5,10,20,50]"
                  scrollable
                  class="p-datatable-striped p-datatable-gridlines users-table"
                  :loading="loading"
                  dataKey="id"
                  :globalFilterFields="['id', 'substance.substanceType.name', 'reception.id', 'weight_sampled', 'observation', 'destination.name', 'methodDestruction.name', 'user.firstName', 'user.lastName']"
                >
                  <template #header>
                    <div class="flex justify-content-end">
                      <IconField iconPosition="left">
                        <InputIcon>
                          <i class="pi pi-search" />
                        </InputIcon>
                        <InputText 
                          v-model="filters['global'].value" 
                          placeholder="Buscar en todos los campos..." 
                        />
                      </IconField>
                    </div>
                  </template>
                  
                  <template #empty> No se encontraron pre-análisis. </template>
                  <template #loading> Cargando pre-análisis. Por favor espere. </template>
                      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                  <Column field="reception" header="N° de Acta" >
                    <template #body="slotProps">
                      #{{ slotProps.data.reception?.number || '—' }}
                    </template>
                  </Column>
                  <Column field="substance" header="Sustancia" >
                    <template #body="slotProps">
                      {{ getSubstanceName(slotProps.data.substance) }}
                    </template>
                  </Column>

           

                  <Column field="weight_sampled" header="Peso(gr)" >
                    <template #body="slotProps">
                      {{ slotProps.data.weight_sampled ?? '—' }}
                    </template>
                  </Column>

                  <Column field="observation" header="Observación" >
                    <template #body="slotProps">
                      {{ slotProps.data.observation || 'Sin observación' }}
                    </template>
                  </Column>

                  <Column field="destination" header="Destino" >
                    <template #body="slotProps">
                      {{ slotProps.data.destination?.name || '—' }}
                    </template>
                  </Column>

                  <Column field="methodDestruction" header="Mét. Destrucción" >
                    <template #body="slotProps">
                      {{ slotProps.data.methodDestruction?.name || '—' }}
                    </template>
                  </Column>

                  <Column header="Acciones" >
                    <template #body="slotProps">
                      <div class="flex align-items-center gap-2">
                        <Button 
                          icon="pi pi-eye" 
                          class="p-button-text p-button-info"
                          v-tooltip="'Ver Detalle'"
                          @click="viewPreAnalysis(slotProps.data)"
                        />
                        <Button 
                          icon="pi pi-file-pdf" 
                          class="p-button-text p-button-help"
                          v-tooltip="'Generar Informe PDF'"
                          @click="generatePDF(slotProps.data)"
                        />
                      </div>
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
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import PlantillaContenido from '../template/PlantillaContenido.vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import preAnalysisService from '@/services/preAnalysisService.js'
import { generarActaPDF } from '@/others/generarActaBtn.js'

export default {
  name: 'PreAnalysisView',
  components: {
    PlantillaContenido,
    Card,
    DataTable,
    Column,
    Button,
    InputText,
    IconField,
    InputIcon
  },

  setup() {
    const preAnalysisList = ref([])
    const loading = ref(false)
    const toast = useToast()

    // Definir los filtros
    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      substance: { value: null, matchMode: FilterMatchMode.CONTAINS },
      reception: { value: null, matchMode: FilterMatchMode.CONTAINS },
      weight_sampled: { value: null, matchMode: FilterMatchMode.CONTAINS },
      observation: { value: null, matchMode: FilterMatchMode.CONTAINS },
      destination: { value: null, matchMode: FilterMatchMode.CONTAINS },
      methodDestruction: { value: null, matchMode: FilterMatchMode.CONTAINS },
      user: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })

    const fetchPreAnalysis = async () => {
      try {
        loading.value = true
        const { data } = await preAnalysisService.getAll()
        preAnalysisList.value = data.content || data || []
        console.log("✅ Pre-análisis cargados:", preAnalysisList.value)
      } catch (error) {
        console.error("❌ Error cargando pre-análisis:", error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los pre-análisis',
          life: 3000
        })
      } finally {
        loading.value = false
      }
    }

    const getSubstanceName = (substance) => {
      if (!substance) return '—'
      return substance.substanceType?.name || `Sustancia #${substance.id}`
    }

    const getUserName = (user) => {
      if (!user) return '—'
      return `${user.firstName || ''} ${user.lastName || ''}`.trim() || `Usuario #${user.id}`
    }

    const viewPreAnalysis = (preAnalysis) => {
      console.log("👁️ Ver pre-análisis:", preAnalysis)
      toast.add({
        severity: 'info',
        summary: 'Ver detalle',
        detail: `Mostrando pre-análisis #${preAnalysis.id}`,
        life: 2500
      })
    }

    const generatePDF = async (preAnalysis) => {
      try {
        toast.add({
          severity: 'info',
          summary: 'Generando PDF...',
          detail: `Creando informe para pre-análisis #${preAnalysis.id}`,
          life: 2000
        })

        generarActaPDF(preAnalysis.reception, [preAnalysis.substance])

        toast.add({
          severity: 'success',
          summary: 'PDF generado',
          detail: `Informe del pre-análisis #${preAnalysis.id} descargado`,
          life: 3000
        })
      } catch (error) {
        console.error("❌ Error generando PDF:", error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo generar el PDF del pre-análisis',
          life: 3000
        })
      }
    }

    onMounted(() => {
      console.log("✅ Vista de pre-análisis cargada")
      fetchPreAnalysis()
    })

    return {
      preAnalysisList,
      loading,
      filters,
      getSubstanceName,
      getUserName,
      viewPreAnalysis,
      generatePDF
    }
  }
}
</script>

<style scoped>
.preanalysis-container {
  padding: 1.5rem;
}

.table-container {
  margin-top: 1rem;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

/* Estilos para los filtros */
:deep(.p-column-filter) {
  width: 100%;
}

:deep(.p-datatable-filter-row td) {
  padding: 0.5rem;
}
</style>