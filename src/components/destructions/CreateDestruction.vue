<template>
  <div>
    <!-- Botón para abrir dialog solo si no hay substances (modo standalone) -->
    <Button
      v-if="!substances || substances.length === 0"
      label="Nueva Destrucción"
      icon="pi pi-plus"
      @click="openDialog"
    />

    <!-- Contenido directo cuando se pasan substances (modo embebido) -->
    <div v-if="substances && substances.length > 0">
      <div
        v-if="isLoading"
        class="flex justify-content-center align-items-center"
        style="height: 250px"
      >
        <ProgressSpinner />
      </div>

      <div v-else class="dialog-content">
        <div class="grid formgrid p-fluid">
          <div class="field col-12 md:col-6">
            <label for="act_number">N° Acta <span class="required">*</span></label>
            <InputText
              id="act_number"
              v-model="form.act_number"
              placeholder="Ej: 01/2025"
              :class="{ 'p-invalid': errors.act_number }"
            />
            <small v-if="errors.act_number" class="p-error">{{ errors.act_number }}</small>
          </div>

          <div class="field col-12 md:col-6">
            <label for="date_destruction">Fecha Destrucción <span class="required">*</span></label>
            <Calendar
              id="date_destruction"
              v-model="form.date_destruction"
              dateFormat="dd/mm/yy"
              showIcon
              :class="{ 'p-invalid': errors.date_destruction }"
            />
            <small v-if="errors.date_destruction" class="p-error">{{
              errors.date_destruction
            }}</small>
          </div>

          <div class="field col-12 md:col-6">
            <label for="methodDestruction"
              >Método de Destrucción <span class="required">*</span></label
            >
            <Dropdown
              id="methodDestruction"
              v-model="form.methodDestructionId"
              :options="methodsDestructions"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione un método"
              :class="{ 'p-invalid': errors.methodDestructionId }"
            />
            <small v-if="errors.methodDestructionId" class="p-error">{{
              errors.methodDestructionId
            }}</small>
          </div>

          <div class="field col-12">
            <label for="observation">Observación</label>
            <Textarea
              id="observation"
              v-model="form.observation"
              rows="3"
              placeholder="Ingrese una observación (opcional)"
            />
          </div>
        </div>

        <!-- Mostrar almacenamientos seleccionados al final -->
        <div class="mt-4">
          <h4 class="mb-2">Almacenamientos Seleccionados</h4>
          <DataTable
            :value="substances"
            class="p-datatable-sm"
            responsiveLayout="scroll"
            :rows="5"
            :paginator="substances.length > 5"
          >
            <Column field="id" header="N° Muestra" :style="{ width: '100px' }" />
            <Column header="N° NUE" :style="{ width: '120px' }">
              <template #body="slotProps">
                {{ slotProps.data.substance?.nue || slotProps.data.substance?.id || '—' }}
              </template>
            </Column>
            <Column header="N° Acta" :style="{ width: '120px' }">
              <template #body="slotProps">
                {{ slotProps.data.substance?.reception?.number || '—' }}
              </template>
            </Column>
            <Column header="Peso (gr)" :style="{ width: '120px' }">
              <template #body="slotProps">
                {{ Number(slotProps.data.counter_sample_quantity || 0).toFixed(2) }}
              </template>
            </Column>
          </DataTable>

          <div class="mt-3 flex justify-content-end">
            <p class="text-lg font-bold">
              Peso Total: <span class="text-primary">{{ totalWeight.toFixed(2) }} gr</span>
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-content-end gap-2 mt-3">
        <Button label="Cancelar" icon="pi pi-times" @click="handleCancel" text />
        <Button
          label="Guardar"
          icon="pi pi-check"
          @click="saveDestruction"
          :loading="isSaving"
          :disabled="isLoading"
        />
      </div>
    </div>

    <!-- Dialog solo para modo standalone -->
    <Dialog
      v-if="!substances || substances.length === 0"
      v-model:visible="visible"
      maximizable
      modal
      :style="{ width: '50rem' }"
      header="Nueva Destrucción"
    >
      <template #header>
        <span class="text-xl font-semibold">Nueva Destrucción</span>
      </template>

      <div
        v-if="isLoading"
        class="flex justify-content-center align-items-center"
        style="height: 250px"
      >
        <ProgressSpinner />
      </div>

      <div v-else class="dialog-content">
        <!-- Mostrar almacenamientos seleccionados si existen -->
        <div v-if="substances && substances.length > 0" class="mb-4">
          <h4 class="mb-2">Almacenamientos Seleccionados</h4>
          <DataTable
            :value="substances"
            class="p-datatable-sm"
            responsiveLayout="scroll"
            :rows="5"
            :paginator="substances.length > 5"
          >
            <Column field="id" header="N° Muestra" :style="{ width: '100px' }" />
            <Column header="N° NUE" :style="{ width: '120px' }">
              <template #body="slotProps">
                {{ slotProps.data.substance?.nue || slotProps.data.substance?.id || '—' }}
              </template>
            </Column>
            <Column header="N° Acta" :style="{ width: '120px' }">
              <template #body="slotProps">
                {{ slotProps.data.substance?.reception?.number || '—' }}
              </template>
            </Column>
            <Column header="Peso (gr)" :style="{ width: '120px' }">
              <template #body="slotProps">
                {{ Number(slotProps.data.counter_sample_quantity || 0).toFixed(2) }}
              </template>
            </Column>
          </DataTable>

          <div class="mt-3 flex justify-content-end">
            <p class="text-lg font-bold">
              Peso Total: <span class="text-primary">{{ totalWeight.toFixed(2) }} gr</span>
            </p>
          </div>
        </div>

        <div class="grid formgrid p-fluid">
          <div class="field col-12 md:col-6">
            <label for="act_number">N° Acta <span class="required">*</span></label>
            <InputText
              id="act_number"
              v-model="form.act_number"
              placeholder="Ej: 01/2025"
              :class="{ 'p-invalid': errors.act_number }"
            />
            <small v-if="errors.act_number" class="p-error">{{ errors.act_number }}</small>
          </div>

          <div class="field col-12 md:col-6">
            <label for="date_destruction">Fecha Destrucción <span class="required">*</span></label>
            <Calendar
              id="date_destruction"
              v-model="form.date_destruction"
              dateFormat="dd/mm/yy"
              showIcon
              :class="{ 'p-invalid': errors.date_destruction }"
            />
            <small v-if="errors.date_destruction" class="p-error">{{
              errors.date_destruction
            }}</small>
          </div>

          <div class="field col-12 md:col-6">
            <label for="methodDestruction"
              >Método de Destrucción <span class="required">*</span></label
            >
            <Dropdown
              id="methodDestruction"
              v-model="form.methodDestructionId"
              :options="methodsDestructions"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione un método"
              :class="{ 'p-invalid': errors.methodDestructionId }"
            />
            <small v-if="errors.methodDestructionId" class="p-error">{{
              errors.methodDestructionId
            }}</small>
          </div>

          <div class="field col-12">
            <label for="observation">Observación</label>
            <Textarea
              id="observation"
              v-model="form.observation"
              rows="3"
              placeholder="Ingrese una observación (opcional)"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="closeDialog" text />
        <Button
          label="Guardar"
          icon="pi pi-check"
          @click="saveDestruction"
          :loading="isSaving"
          :disabled="isLoading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import destructionsService from '@/services/destructionsHeaderService.js'
import destructionDetailsService from '@/services/destructionDetailsService.js'
import methodsDestructionsService from '@/services/methodsDestructionsService.js'
import storagesService from '@/services/storagesService.js'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  name: 'CreateDestruction',
  components: {
    Button,
    Dialog,
    DataTable,
    Column,
    InputText,
    InputNumber,
    Calendar,
    Dropdown,
    Textarea,
    ProgressSpinner,
  },
  props: {
    substances: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['created', 'close'],

  setup(props, { emit }) {
    const toast = useToast()
    const visible = ref(false)
    const isLoading = ref(false)
    const isSaving = ref(false)
    const methodsDestructions = ref([])

    const stateOptions = ref(['PENDIENTE', 'COMPLETADO', 'CANCELADO', 'BORRADOR'])

    const form = ref({
      act_number: '',
      date_destruction: null,
      observation: '',
      state: 'COMPLETADO',
      methodDestructionId: null,
    })

    const errors = ref({})

    // Calcular peso total de todos los storages seleccionados (en gramos)
    const totalWeight = computed(() => {
      if (!props.substances || props.substances.length === 0) return 0
      return props.substances.reduce((total, storage) => {
        return total + Number(storage.counter_sample_quantity || 0)
      }, 0)
    })

    const loadMethodsDestructions = async () => {
      try {
        const { data } = await methodsDestructionsService.getAll()
        methodsDestructions.value = data.content || data || []
      } catch (error) {
        console.error('❌ Error cargando métodos de destrucción:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los métodos de destrucción',
          life: 3000,
        })
      }
    }

    // Cargar métodos automáticamente cuando se pasan substances
    watch(
      () => props.substances,
      async (newVal) => {
        if (newVal && newVal.length > 0) {
          isLoading.value = true
          await loadMethodsDestructions()
          isLoading.value = false
        }
      },
      { immediate: true },
    )

    const openDialog = async () => {
      visible.value = true
      isLoading.value = true
      await loadMethodsDestructions()
      isLoading.value = false
    }

    const closeDialog = () => {
      visible.value = false
      resetForm()
    }

    const handleCancel = () => {
      emit('close')
      resetForm()
    }

    const formatDate = (date) => {
      if (!date) return ''
      const d = new Date(date)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}-${month}-${year}`
    }

    const validateForm = () => {
      errors.value = {}

      if (!form.value.act_number) {
        errors.value.act_number = 'El número de acta es requerido'
      }

      if (!form.value.date_destruction) {
        errors.value.date_destruction = 'La fecha de destrucción es requerida'
      }

      if (!form.value.methodDestructionId) {
        errors.value.methodDestructionId = 'Debe seleccionar un método de destrucción'
      }

      // Validar que haya peso total calculado
      if (totalWeight.value <= 0) {
        toast.add({
          severity: 'warn',
          summary: 'Atención',
          detail: 'No hay almacenamientos seleccionados o el peso total es 0',
          life: 3000,
        })
        return false
      }

      return Object.keys(errors.value).length === 0
    }

    const saveDestruction = async () => {
      if (!validateForm()) {
        toast.add({
          severity: 'warn',
          summary: 'Atención',
          detail: 'Por favor complete todos los campos requeridos',
          life: 3000,
        })
        return
      }

      isSaving.value = true
      try {
        const userId = parseInt(localStorage.getItem('user_id')) || 1

        // 1. Crear el destruction_header
        const headerPayload = {
          act_number: form.value.act_number,
          date_destruction: formatDate(form.value.date_destruction),
          observation: form.value.observation || null,
          state: form.value.state,
          weight: totalWeight.value,
          methodDestruction: { id: form.value.methodDestructionId },
          user: { id: userId },
        }

        console.log('📤 Creando destruction header:', headerPayload)
        const { data: createdHeader } = await destructionsService.create(headerPayload)
        console.log('✅ Destruction header creado:', createdHeader)

        // 2. Crear un destruction_detail por cada storage
        if (props.substances && props.substances.length > 0) {
          let successCount = 0
          let errorCount = 0

          for (const storage of props.substances) {
            try {
              const detailPayload = {
                state: 'COMPLETADO',
                weight: Number(storage.counter_sample_quantity || 0),
                destructionHeader: createdHeader,
                substance: storage.substance,
                storage: storage,
              }

              console.log('📤 Creando destruction detail:', detailPayload)
              await destructionDetailsService.create(detailPayload)

              // Actualizar el estado del storage a "Enviado a destrucción"
              try {
                const storageUpdatePayload = {
                  id: storage.id,
                  substance: storage.substance,
                  storageLocation: storage.storageLocation,
                  counter_sample_quantity: storage.counter_sample_quantity,
                  description: storage.description,
                  state: 'Enviado a destrucción',
                  created_at: storage.created_at,
                }

                console.log('📤 Actualizando storage:', storageUpdatePayload)
                await storagesService.update(storage.id, storageUpdatePayload)
              } catch (updateError) {
                console.warn(
                  '⚠️ No se pudo actualizar estado del storage:',
                  storage.id,
                  updateError,
                )
              }

              successCount++
            } catch (detailError) {
              console.error('❌ Error creando detail para storage:', storage.id, detailError)
              errorCount++
            }
          }

          console.log(`✅ Details creados: ${successCount} exitosos, ${errorCount} con error`)

          if (errorCount > 0) {
            toast.add({
              severity: 'warn',
              summary: 'Advertencia',
              detail: `Se creó la destrucción pero ${errorCount} detalle(s) tuvieron errores`,
              life: 4000,
            })
          }
        }

        emit('created', createdHeader)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Destrucción creada correctamente',
          life: 3000,
        })
        if (props.substances && props.substances.length > 0) {
          emit('close')
        } else {
          closeDialog()
        }
      } catch (error) {
        console.error('❌ Error creando destrucción:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response?.data?.message || 'No se pudo crear la destrucción',
          life: 3000,
        })
      } finally {
        isSaving.value = false
      }
    }

    const resetForm = () => {
      form.value = {
        act_number: '',
        date_destruction: null,
        observation: '',
        state: 'BORRADOR',
        methodDestructionId: null,
      }
      errors.value = {}
    }

    return {
      visible,
      isLoading,
      isSaving,
      form,
      errors,
      methodsDestructions,
      stateOptions,
      totalWeight,
      openDialog,
      closeDialog,
      handleCancel,
      saveDestruction,
    }
  },
}
</script>

<style scoped>
.dialog-content {
  padding: 1rem 0;
}

.required {
  color: red;
}

.field {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
</style>
