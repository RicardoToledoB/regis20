<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="users-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Gestión de Recepciones</h1>
            <CreateReception @created="handleReceptionCreated" />
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  :value="receptions"
                  paginator
                  size="large"
                  :rows="5"
                  :rowsPerPageOptions="[5,10,20,50]"
                  scrollable
                  scrollHeight="350px"
                  class="p-datatable-striped p-datatable-gridlines users-table"
                  :loading="loading"
                  :rowClass="rowClass"
                >
                  <Column field="id" header="ID" ></Column>
                  <Column field="number" header="N° Acta" ></Column>
                  <Column field="of_number" header="N° Oficio" ></Column>
                  <Column field="date_reception" header="Fecha Recepción" >
                    <template #body="slotProps">
                      {{ formatDate(slotProps.data.date_reception) }}
                    </template>
                  </Column>
                  <Column field="of_number_date" header="Fecha Oficio" >
                    <template #body="slotProps">
                      {{ formatDate(slotProps.data.of_number_date) }}
                    </template>
                  </Column>
                  <Column field="police" header="Policía" >
                    <template #body="slotProps">
                      {{ getPoliceName(slotProps.data.police) }}
                    </template>
                  </Column>
                  <Column header="Acciones" >
                    <template #body="slotProps">
                     <div class="flex align-items-center gap-2">
                      <EditReception 
                        :reception="slotProps.data" 
                        @updated="handleReceptionUpdated" 
                      />
                       <ViewHistoryReception 
        :reception="slotProps.data"
      />
                      <Button 
                        icon="pi pi-file-pdf" 
                        class="p-button-text p-button-help" 
                        v-tooltip="'Generar PDF'"
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
import { useConfirm } from 'primevue/useconfirm'
import PlantillaContenido from '../template/PlantillaContenido.vue'
import recepcionService from '@/services/receptionsService.js'
import CreateReception from '@/components/receptions/CreateReception.vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import substancesService from '@/services/substancesService.js'
import { generarActaPDF } from '@/others/generarActaBtn.js'
import EditReception from '@/components/receptions/EditReception.vue'
import ViewHistoryReception from '@/components/receptions/ViewHistoryReception.vue'

export default {
  name: 'ReceptionsView',
  components: {
    PlantillaContenido,
    CreateReception,
    EditReception,
    Card,
    DataTable,
    Column,
    Button,
    ViewHistoryReception
  },

  setup() {
    const receptions = ref([])
    const loading = ref(false)
    const toast = useToast()
    const confirm = useConfirm()

    const fetchReceptions = async () => {
      try {
        loading.value = true
        const { data } = await recepcionService.getAll()
        receptions.value = data.content || data || []
        console.log("✅ Recepciones cargadas:", receptions.value)
      } catch (error) {
        console.error("❌ Error cargando recepciones:", error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las recepciones',
          life: 3000
        })
      } finally {
        loading.value = false
      }
    }
    const rowClass = (row) => {
      // PrimeVue puede pasar directamente el objeto fila o un objeto { data, index }
      // Normalizamos para aceptar ambos casos y añadimos logging para depuración.
      const data = row && row.data ? row.data : row
      //console.log('rowClass received:', row, 'normalized:', data)
      if (!data) return ''
      return data.state === 'BORRADOR' ? 'borrador-row' : ''
    }
const handleReceptionUpdated = (updatedReception) => {
  const index = receptions.value.findIndex(r => r.id === updatedReception.id)
  if (index !== -1) {
    receptions.value[index] = updatedReception
  }
  toast.add({ severity: 'success', summary: 'Actualizada', detail: 'Recepción actualizada correctamente', life: 3000 })
}

    const generatePDF = async (reception) => {
      try {
        toast.add({
          severity: 'info',
          summary: 'Generando PDF...',
          detail: `Creando acta para recepción #${reception.id}`,
          life: 2000
        })

        // 1️⃣ Obtener recepción por ID
        const { data: receptionData } = await recepcionService.getById(reception.id)

        // 2️⃣ Obtener sustancias (temporal hasta que llegue el endpoint real)
        const { data: substancesData } = await substancesService.getByReceptionId(reception.id)
        // filtrar por recepción si existe esa relación
        const substances = substancesData.filter(s => s.reception?.id === reception.id)

        // 3️⃣ Llamar a la función del PDF
        generarActaPDF(receptionData, substances)

        toast.add({
          severity: 'success',
          summary: 'PDF generado',
          detail: `Acta de recepción #${reception.number} descargada`,
          life: 3000
        })
      } catch (error) {
        console.error("❌ Error generando PDF:", error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo generar el PDF del acta',
          life: 3000
        })
      }
    }

    // ✅ FUNCIÓN MODIFICADA PARA ACTUALIZAR LA TABLA
    const handleReceptionCreated = (newReception) => {
      // Agregar la nueva recepción al inicio del array
      receptions.value.unshift(newReception)
      
      console.log("✅ Nueva recepción agregada a la tabla:", newReception)
      
      // El toast ahora se muestra desde el componente CreateReception
    }

    const getPoliceName = (police) => {
      if (!police) return 'N/A'
      return `${police.firstName || ''} ${police.firstLastName || ''}`.trim() || 'Sin nombre'
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-CL')
    }

    const viewReception = (reception) => {
      // Aquí puedes implementar la vista de detalles
      console.log("Ver recepción:", reception)
      toast.add({
        severity: 'info',
        summary: 'Ver recepción',
        detail: `Viendo recepción #${reception.id}`,
        life: 2000
      })
    }

    const confirmDelete = (reception) => {
      confirm.require({
        message: `¿Estás seguro de eliminar la recepción #${reception.id}?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          deleteReception(reception.id)
        }
      })
    }

    const deleteReception = async (id) => {
      try {
        await recepcionService.delete(id)
        receptions.value = receptions.value.filter(r => r.id !== id)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Recepción eliminada correctamente',
          life: 3000
        })
      } catch (error) {
        console.error("❌ Error eliminando recepción:", error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la recepción',
          life: 3000
        })
      }
    }

    onMounted(() => {
      console.log("✅ Vista de recepciones cargada")
      fetchReceptions()
    })

    return {
      receptions,
      loading,
      rowClass,
      generatePDF,
      fetchReceptions,
      handleReceptionCreated,
      getPoliceName,
      formatDate,
      viewReception,
      confirmDelete,
      handleReceptionUpdated
    }
  }
}
</script>

<style scoped>
.users-container {
  padding: 1.5rem;
}

.table-container {
  margin-top: 1rem;
}

.borrador-row {
  /* Mantener por compatibilidad: algunos entornos aplican la clase al elemento correcto */
  background-color: #fff6b8 !important; /* Amarillo pastel suave */
}

/* Cuando el style está scoped, los elementos generados por PrimeVue a veces no
   reciben el atributo de scoping en el mismo nodo; usamos :deep() para asegurarnos
   que la regla alcance las filas (tr) y las celdas (td) creadas por DataTable. */
:deep(.borrador-row) > td,
:deep(.borrador-row) td {
  background-color: #fff6b8 !important;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}
</style>