<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="destructions-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-4">
            <h1>Gestión de Destrucciones</h1>
          </div>

          <Card>
            <template #content>
              <div class="table-container">
                <DataTable
                  v-model:filters="filters"
                  :value="destructions"
                  paginator
                  size="small"
                  :rows="10"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  class="p-datatable-striped p-datatable-gridlines"
                  :loading="loading"
                  dataKey="id"
                  :globalFilterFields="[
                    'id',
                    'act_number',
                    'date_destruction',
                    'observation',
                    'state',
                    'weight',
                    'methodDestruction.name',
                    'user.username',
                  ]"
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

                  <template #empty> No se encontraron destrucciones. </template>
                  <template #loading> Cargando destrucciones. Por favor espere. </template>

                  <Column field="id" header="ID" sortable></Column>

                  <Column field="act_number" header="N° Acta" sortable>
                    <template #body="slotProps">
                      <Tag v-if="!slotProps.data.act_number" value="PENDIENTE" severity="warning" />
                      <span v-else>{{ slotProps.data.act_number }}</span>
                    </template>
                  </Column>

                  <Column field="date_destruction" header="Fecha Destrucción" sortable>
                    <template #body="slotProps">
                      <Tag
                        v-if="!slotProps.data.date_destruction"
                        value="PENDIENTE"
                        severity="warning"
                      />
                      <span v-else>{{ slotProps.data.date_destruction }}</span>
                    </template>
                  </Column>

                  <Column field="weight" header="Peso (kg)" sortable>
                    <template #body="slotProps">
                      {{ slotProps.data.weight ? Number(slotProps.data.weight).toFixed(2) : 'N/A' }}
                    </template>
                  </Column>

                  <Column field="methodDestruction.name" header="Método" sortable>
                    <template #body="slotProps">
                      {{ slotProps.data.methodDestruction?.name || 'N/A' }}
                    </template>
                  </Column>

                  <Column field="state" header="Estado" sortable>
                    <template #body="slotProps">
                      <Tag
                        :value="slotProps.data.state"
                        :severity="getStateSeverity(slotProps.data.state)"
                      />
                    </template>
                  </Column>

                  <Column field="user.username" header="Usuario" sortable>
                    <template #body="slotProps">
                      {{ slotProps.data.user?.username || 'N/A' }}
                    </template>
                  </Column>

                  <Column field="observation" header="Observación">
                    <template #body="slotProps">
                      <Tag
                        v-if="!slotProps.data.observation"
                        value="PENDIENTE"
                        severity="warning"
                      />
                      <span
                        v-else
                        v-tooltip.top="{
                          value: slotProps.data.observation,
                          disabled: !slotProps.data.observation,
                        }"
                      >
                        {{
                          slotProps.data.observation.substring(0, 30) +
                          (slotProps.data.observation.length > 30 ? '...' : '')
                        }}
                      </span>
                    </template>
                  </Column>

                  <Column header="Acciones">
                    <template #body="slotProps">
                      <div class="flex align-items-center gap-2">
                        <EditDestruction
                          :destruction="slotProps.data"
                          @updated="handleDestructionUpdated"
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
import { FilterMatchMode } from 'primevue/api'
import PlantillaContenido from '../template/PlantillaContenido.vue'
import destructionsService from '@/services/destructionsService.js'
import CreateDestruction from '@/components/destructions/CreateDestruction.vue'
import EditDestruction from '@/components/destructions/EditDestruction.vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Tag from 'primevue/tag'

export default {
  name: 'DestructionsView',
  components: {
    PlantillaContenido,
    CreateDestruction,
    EditDestruction,
    Card,
    DataTable,
    Column,
    Button,
    InputText,
    IconField,
    InputIcon,
    Tag,
  },

  setup() {
    const destructions = ref([])
    const loading = ref(false)
    const toast = useToast()
    const confirm = useConfirm()

    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    const fetchDestructions = async () => {
      try {
        loading.value = true
        const { data } = await destructionsService.getAll()
        destructions.value = data.content || data || []
        console.log('✅ Destrucciones cargadas:', destructions.value)
      } catch (error) {
        console.error('❌ Error cargando destrucciones:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las destrucciones',
          life: 3000,
        })
      } finally {
        loading.value = false
      }
    }

    const handleDestructionCreated = (newDestruction) => {
      destructions.value.unshift(newDestruction)
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Destrucción creada correctamente',
        life: 3000,
      })
      console.log('✅ Nueva destrucción agregada:', newDestruction)
    }

    const handleDestructionUpdated = (updatedDestruction) => {
      const index = destructions.value.findIndex((d) => d.id === updatedDestruction.id)
      if (index !== -1) {
        destructions.value.splice(index, 1, updatedDestruction)
      } else {
        fetchDestructions()
      }
      toast.add({
        severity: 'success',
        summary: 'Actualizada',
        detail: 'Destrucción actualizada correctamente',
        life: 3000,
      })
    }

    const confirmDelete = (destruction) => {
      confirm.require({
        message: `¿Estás seguro de eliminar la destrucción #${destruction.act_number}?`,
        header: 'Confirmar eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          deleteDestruction(destruction.id)
        },
      })
    }

    const deleteDestruction = async (id) => {
      try {
        await destructionsService.delete(id)
        destructions.value = destructions.value.filter((d) => d.id !== id)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Destrucción eliminada correctamente',
          life: 3000,
        })
      } catch (error) {
        console.error('❌ Error eliminando destrucción:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la destrucción',
          life: 3000,
        })
      }
    }

    const getStateSeverity = (state) => {
      const severities = {
        COMPLETADO: 'success',
        PENDIENTE: 'warning',
        CANCELADO: 'danger',
        BORRADOR: 'info',
      }
      return severities[state] || 'info'
    }

    onMounted(() => {
      console.log('✅ Vista de destrucciones cargada')
      fetchDestructions()
    })

    return {
      destructions,
      loading,
      filters,
      fetchDestructions,
      handleDestructionCreated,
      handleDestructionUpdated,
      confirmDelete,
      getStateSeverity,
    }
  },
}
</script>

<style scoped>
.destructions-container {
  padding: 1.5rem;
}

.table-container {
  margin-top: 1rem;
}
</style>
