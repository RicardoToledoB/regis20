<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="storage-destruction-container">
        <div class="page-content">
          <h1>Almacenamiento y Destrucción</h1>

          <TabView>
            <!-- Pestaña de Almacenamiento -->
            <TabPanel header="Almacenamiento" leftIcon="pi pi-warehouse">
              <div class="storages-container">
                <div class="flex justify-content-between align-items-center mb-4">
                  <Button
                    v-if="selectedStorages.length > 0"
                    label="Enviar a Destrucción2"
                    icon="pi pi-trash"
                    @click="openDestructionDialog"
                    severity="warning"
                  />
                </div>

                <Card>
                  <template #content>
                    <div class="table-container">
                      <DataTable
                        :selection="selectedStorages"
                        @update:selection="updateSelection"
                        :value="storages"
                        paginator
                        size="large"
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20, 50]"
                        scrollable
                        scrollHeight="400px"
                        class="p-datatable-striped p-datatable-gridlines storages-table"
                        dataKey="id"
                      >
                        <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                        <Column field="id" header="N° de Muestra" />
                        <Column header="N° NUE">
                          <template #body="slotProps">
                            {{
                              slotProps.data.substance?.nue || slotProps.data.substance?.id || '—'
                            }}
                          </template>
                        </Column>
                        <Column header="N° de Acta">
                          <template #body="slotProps">
                            {{ slotProps.data.substance?.reception?.number || '—' }}
                          </template>
                        </Column>
                        <Column field="counter_sample_quantity" header="Peso neto(gr)" />
                        <Column header="Estado">
                          <template #body="slotProps">
                            {{ slotProps.data.state || '—' }}
                          </template>
                        </Column>
                        <Column header="Fecha">
                          <template #body="slotProps">
                            {{ formatDate(slotProps.data.createdAt) }}
                          </template>
                        </Column>
                      </DataTable>
                    </div>
                  </template>
                </Card>
              </div>
            </TabPanel>

            <!-- Pestaña de Destrucción -->
            <TabPanel header="Destrucción" leftIcon="pi pi-ban">
              <div class="destructions-container">
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
                        :loading="loadingDestructions"
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

                        <Column field="id" header="ID" />
                        <Column field="act_number" header="N° Acta" />
                        <Column field="date_destruction" header="Fecha Destrucción">
                          <template #body="slotProps">
                            {{ formatDate(slotProps.data.date_destruction) }}
                          </template>
                        </Column>
                        <Column field="weight" header="Peso (gr)" />
                        <Column header="Método">
                          <template #body="slotProps">
                            {{ slotProps.data.methodDestruction?.name || '—' }}
                          </template>
                        </Column>
                        <Column field="state" header="Estado">
                          <template #body="slotProps">
                            <Tag
                              :value="slotProps.data.state"
                              :severity="getDestructionSeverity(slotProps.data.state)"
                            />
                          </template>
                        </Column>
                        <Column field="observation" header="Observación" />
                        <Column header="Acciones" bodyStyle="text-align:center">
                          <template #body="slotProps">
                            <EditDestruction
                              :destruction="slotProps.data"
                              @updated="onDestructionUpdated"
                            />
                            <Button
                              icon="pi pi-trash"
                              severity="danger"
                              text
                              @click="confirmDelete(slotProps.data.id)"
                            />
                          </template>
                        </Column>
                      </DataTable>
                    </div>
                  </template>
                </Card>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>

      <!-- Diálogo de Destrucción -->
      <Dialog
        v-model:visible="destructionDialogVisible"
        modal
        header="Crear Destrucción desde Almacenamiento"
        :style="{ width: '60rem' }"
        @update:visible="closeDestructionDialog"
      >
        <CreateDestruction
          :substances="selectedStorages"
          @close="closeDestructionDialog"
          @created="onDestructionCreated"
        />
      </Dialog>

      <!-- Diálogo de Edición de Destrucción -->
      <Dialog
        v-model:visible="editDestructionDialogVisible"
        modal
        header="Editar Destrucción"
        :style="{ width: '50rem' }"
        @update:visible="closeEditDestructionDialog"
      >
        <EditDestruction
          :destruction="selectedDestruction"
          @close="closeEditDestructionDialog"
          @updated="onDestructionUpdated"
        />
      </Dialog>

      <!-- Confirmación de Eliminación -->
      <ConfirmDialog />
    </template>
  </PlantillaContenido>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import PlantillaContenido from '@/views/template/PlantillaContenido.vue'
import CreateDestruction from '@/components/destructions/CreateDestruction.vue'
import EditDestruction from '@/components/destructions/EditDestruction.vue'
import storagesService from '@/services/storagesService'
import destructionsService from '@/services/destructionsHeaderService'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import ConfirmDialog from 'primevue/confirmdialog'

export default {
  name: 'StorageAndDestruction',
  components: {
    PlantillaContenido,
    CreateDestruction,
    EditDestruction,
    TabView,
    TabPanel,
    Card,
    DataTable,
    Column,
    Dialog,
    Button,
    Tag,
    InputText,
    IconField,
    InputIcon,
    ConfirmDialog,
  },
  setup() {
    const confirm = useConfirm()
    const toast = useToast()

    // Estado de Almacenamiento
    const storages = ref([])
    const selectedStorages = ref([])

    // Estado de Destrucción
    const destructions = ref([])
    const loadingDestructions = ref(false)
    const selectedDestruction = ref(null)

    // Diálogos
    const destructionDialogVisible = ref(false)
    const editDestructionDialogVisible = ref(false)

    // Filtros
    const filters = reactive({
      global: { value: null, matchMode: 'contains' },
    })

    // Cargar almacenamientos
    const loadStorages = async () => {
      try {
        const { data } = await storagesService.getAll()
        storages.value = data.content || data || []
      } catch (error) {
        console.error('Error cargando almacenamientos:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los almacenamientos',
          life: 3000,
        })
      }
    }

    // Cargar destrucciones
    const loadDestructions = async () => {
      try {
        loadingDestructions.value = true
        const { data } = await destructionsService.getAll()
        destructions.value = data.content || data || []
      } catch (error) {
        console.error('Error cargando destrucciones:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las destrucciones',
          life: 3000,
        })
      } finally {
        loadingDestructions.value = false
      }
    }

    // Actualizar selección
    const updateSelection = (val) => {
      selectedStorages.value = val
    }

    // Abrir diálogo de destrucción
    const openDestructionDialog = () => {
      destructionDialogVisible.value = true
    }

    // Cerrar diálogo de destrucción
    const closeDestructionDialog = () => {
      destructionDialogVisible.value = false
      selectedStorages.value = []
      loadStorages()
    }

    // Al crear destrucción
    const onDestructionCreated = () => {
      loadDestructions()
      closeDestructionDialog()
    }

    // Editar destrucción
    const editDestruction = (destruction) => {
      selectedDestruction.value = destruction
      editDestructionDialogVisible.value = true
    }

    // Cerrar diálogo de edición
    const closeEditDestructionDialog = () => {
      editDestructionDialogVisible.value = false
      selectedDestruction.value = null
    }

    // Al actualizar destrucción
    const onDestructionUpdated = () => {
      loadDestructions()
      closeEditDestructionDialog()
    }

    // Confirmar eliminación
    const confirmDelete = (id) => {
      confirm.require({
        message: '¿Estás seguro de que deseas eliminar esta destrucción?',
        header: 'Confirmar Eliminación',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          try {
            await destructionsService.delete(id)
            toast.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Destrucción eliminada correctamente',
              life: 3000,
            })
            loadDestructions()
          } catch (error) {
            console.error('Error eliminando destrucción:', error)
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la destrucción',
              life: 3000,
            })
          }
        },
      })
    }

    // Formatear fecha
    const formatDate = (date) => {
      if (!date) return '—'
      return new Date(date).toLocaleDateString('es-CL')
    }

    // Severidad del tag de estado
    const getDestructionSeverity = (state) => {
      switch (state) {
        case 'COMPLETADO':
          return 'success'
        case 'PENDIENTE':
          return 'warning'
        case 'CANCELADO':
          return 'danger'
        default:
          return 'info'
      }
    }

    onMounted(() => {
      loadStorages()
      loadDestructions()
    })

    return {
      storages,
      selectedStorages,
      destructions,
      loadingDestructions,
      destructionDialogVisible,
      editDestructionDialogVisible,
      selectedDestruction,
      filters,
      updateSelection,
      openDestructionDialog,
      closeDestructionDialog,
      onDestructionCreated,
      editDestruction,
      closeEditDestructionDialog,
      onDestructionUpdated,
      confirmDelete,
      formatDate,
      getDestructionSeverity,
    }
  },
}
</script>

<style scoped>
.storage-destruction-container {
  padding: 1rem;
}

.page-content {
  width: 100%;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-color);
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-color);
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

:deep(.p-tabview-nav) {
  background: var(--surface-50);
  border-bottom: 2px solid var(--surface-200);
}

:deep(.p-tabview-panels) {
  padding: 1.5rem 0;
}
</style>
