<template>
  <div>
    <Button
      icon="pi pi-play"
      class="p-button-text p-button-success"
      v-tooltip="'Procesar destrucción'"
      @click="openDialog"
    />

    <Dialog
      v-model:visible="visible"
      maximizable
      modal
      :style="{ width: '50rem' }"
      header="Procesar Destrucción"
    >
      <template #header>
        <span class="text-xl font-semibold">Procesar Destrucción #{{ destruction.id }}</span>
      </template>

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
              dateFormat="dd-mm-yy"
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
              v-model="form.methodDestruction"
              :options="methodsDestructions"
              optionLabel="name"
              placeholder="Seleccione un método"
              :class="{ 'p-invalid': errors.methodDestruction }"
            />
            <small v-if="errors.methodDestruction" class="p-error">{{
              errors.methodDestruction
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

        <!-- Sección de Sustancias Asociadas al final -->
        <div v-if="destructionDetails.length > 0" class="mt-5">
          <h5 class="mb-3">Sustancias a Destruir</h5>
          <DataTable
            :value="destructionDetails"
            size="small"
            class="p-datatable-sm"
            responsiveLayout="scroll"
          >
            <Column field="id" header="ID" style="width: 60px" />
            <Column header="Sustancia">
              <template #body="slotProps">
                {{ slotProps.data.substance?.substanceType?.name || '—' }}
              </template>
            </Column>
            <Column header="N° NUE">
              <template #body="slotProps">
                {{ slotProps.data.substance?.nue || '—' }}
              </template>
            </Column>
            <Column header="N° Acta">
              <template #body="slotProps">
                {{ slotProps.data.substance?.reception?.number || '—' }}
              </template>
            </Column>
            <Column field="weight" header="Peso (gr)">
              <template #body="slotProps">
                {{ slotProps.data.weight ? Number(slotProps.data.weight).toFixed(2) : '—' }}
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="closeDialog" text />
        <Button
          label="Guardar"
          icon="pi pi-check"
          @click="updateDestruction"
          :loading="isSaving"
          :disabled="isLoading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import destructionsService from '@/services/destructionsHeaderService.js'
import destructionDetailsService from '@/services/destructionDetailsService.js'
import methodsDestructionsService from '@/services/methodsDestructionsService.js'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import ProgressSpinner from 'primevue/progressspinner'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default {
  name: 'EditDestruction',
  components: {
    Button,
    Dialog,
    InputText,
    InputNumber,
    Calendar,
    Dropdown,
    Textarea,
    ProgressSpinner,
    DataTable,
    Column,
  },
  props: {
    destruction: {
      type: Object,
      required: true,
    },
  },
  emits: ['updated'],

  setup(props, { emit }) {
    const toast = useToast()
    const visible = ref(false)
    const isLoading = ref(false)
    const isSaving = ref(false)
    const methodsDestructions = ref([])
    const destructionDetails = ref([])

    const stateOptions = ref([
      'PENDIENTE',
      'COMPLETADO',
      'CANCELADO',
      'BORRADOR',
      'DESTRUCCION_MASIVA',
    ])

    const form = ref({
      act_number: '',
      date_destruction: null,
      observation: '',
      state: 'COMPLETADO',
      weight: null,
      methodDestruction: null,
    })

    const errors = ref({})

    const parseDateDDMMYYYY = (dateStr) => {
      if (!dateStr) return null
      const [day, month, year] = dateStr.split('-')
      return new Date(year, month - 1, day)
    }

    const openDialog = async () => {
      visible.value = true
      isLoading.value = true
      await Promise.all([loadMethodsDestructions(), loadDestructionDetails()])
      loadDestructionData()
      isLoading.value = false
    }

    const loadDestructionDetails = async () => {
      try {
        const { data } = await destructionDetailsService.getByHeaderId(props.destruction.id)
        destructionDetails.value = data.content || data || []
        console.log('✅ Detalles de destrucción cargados:', destructionDetails.value)
      } catch (error) {
        console.error('❌ Error cargando detalles de destrucción:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los detalles de la destrucción',
          life: 3000,
        })
        destructionDetails.value = []
      }
    }

    const closeDialog = () => {
      visible.value = false
      errors.value = {}
    }

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

    const loadDestructionData = () => {
      form.value = {
        act_number: props.destruction.act_number || '',
        date_destruction: '',
        observation: props.destruction.observation || '',
        state: 'COMPLETADO',
        weight: props.destruction.weight || null,
        methodDestruction: props.destruction.methodDestruction || null,
      }
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

      if (!form.value.methodDestruction) {
        errors.value.methodDestruction = 'Debe seleccionar un método de destrucción'
      }

      return Object.keys(errors.value).length === 0
    }

    const updateDestruction = async () => {
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
        const payload = {
          act_number: form.value.act_number,
          date_destruction: formatDate(form.value.date_destruction),
          observation: form.value.observation || null,
          state: form.value.state,
          weight: Number(form.value.weight),
          methodDestruction: form.value.methodDestruction,
          user: props.destruction.user,
        }

        console.log('📤 Actualizando destrucción:', payload)
        const { data } = await destructionsService.update(props.destruction.id, payload)
        console.log('✅ Destrucción actualizada:', data)

        // Actualizar todos los destruction_details a estado COMPLETADO
        if (destructionDetails.value.length > 0) {
          console.log('📤 Actualizando detalles de destrucción a COMPLETADO...')
          const updatePromises = destructionDetails.value.map((detail) => {
            const detailPayload = {
              ...detail,
              state: 'COMPLETADO',
              destructionHeader: props.destruction,
              substance: detail.substance,
              storage: detail.storage,
            }
            return destructionDetailsService.update(detail.id, detailPayload)
          })

          await Promise.all(updatePromises)
          console.log('✅ Todos los detalles actualizados a COMPLETADO')
        }

        emit('updated', data)
        closeDialog()
      } catch (error) {
        console.error('❌ Error actualizando destrucción:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response?.data?.message || 'No se pudo actualizar la destrucción',
          life: 3000,
        })
      } finally {
        isSaving.value = false
      }
    }

    return {
      visible,
      isLoading,
      isSaving,
      form,
      errors,
      methodsDestructions,
      destructionDetails,
      stateOptions,
      openDialog,
      closeDialog,
      updateDestruction,
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
