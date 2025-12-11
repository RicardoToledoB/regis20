<template>
  <Dialog
    :visible="visible"
    modal
    header="Examen Químico"
    :style="{ width: '700px' }"
    @update:visible="closeDialog"
  >
    <div class="p-fluid">
      <div class="grid formgrid">
        <div class="col-12 md:col-6 field">
          <label>Método</label>
          <InputText v-model="formData.method" placeholder="Método utilizado" disabled />
        </div>

        <div class="col-12 md:col-6 field">
          <label>Resultado</label>
          <Dropdown
            v-model="formData.result"
            :options="resultOptions"
            placeholder="Seleccione resultado"
            optionLabel="label"
            optionValue="value"
          />
        </div>

        <div class="col-12 field">
          <label>Conclusión</label>
          <Textarea
            v-model="formData.conclution"
            rows="4"
            placeholder="Conclusión del examen químico"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" severity="secondary" @click="closeDialog" :disabled="isSaving" />
      <Button
        label="Guardar"
        severity="success"
        @click="submit"
        :loading="isSaving"
        :disabled="isSaving"
      />
    </template>
  </Dialog>
</template>

<script>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import { useToast } from 'primevue/usetoast'
import chemicalTestsService from '@/services/chemicalTestsService.js'

export default {
  name: 'ChemicalTestDialog',
  components: {
    Dialog,
    InputText,
    Textarea,
    Button,
    Dropdown,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    analysis: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:visible', 'saved'],
  setup(props, { emit }) {
    const toast = useToast()
    const isSaving = ref(false)
    const existingChemicalTestId = ref(null)

    const resultOptions = [
      { label: 'Reacción Cualitativa Positiva', value: 'Reacción Cualitativa Positiva' },
      { label: 'Reacción Cualitativa Negativa', value: 'Reacción Cualitativa Negativa' },
    ]

    const formData = ref({
      method: 'Fast Blue',
      result: '',
      conclution: '',
    })

    // Watcher para actualizar automáticamente la conclusión según el resultado
    watch(
      () => formData.value.result,
      (newResult) => {
        if (newResult === 'Reacción Cualitativa Positiva') {
          formData.value.conclution =
            'Formación de color rojo púrpura por reacción del reactivo Azul Sólido B (Fast Blue) con compuestos cannabinoides'
        } else if (newResult === 'Reacción Cualitativa Negativa') {
          formData.value.conclution =
            'No hay formación de color rojo púrpura por reacción del reactivo Azul Sólido B (Fast Blue) con compuestos cannabinoides.'
        } else {
          formData.value.conclution = ''
        }
      },
    )

    // Cargar datos del examen químico existente cuando se abre
    watch(
      () => props.visible,
      async (newVal) => {
        if (newVal && props.analysis?.id) {
          try {
            const { data } = await chemicalTestsService.getByAnalysisId(props.analysis.id)
            const chemicalTest = data.content?.[0] || data?.[0]
            if (chemicalTest) {
              existingChemicalTestId.value = chemicalTest.id
              formData.value = {
                method: chemicalTest.method || '',
                result: chemicalTest.result || '',
                conclution: chemicalTest.conclution || '',
              }
            } else {
              existingChemicalTestId.value = null
              resetForm()
            }
          } catch (error) {
            console.error('Error cargando examen químico:', error)
            existingChemicalTestId.value = null
            resetForm()
          }
        }
      },
    )

    const resetForm = () => {
      existingChemicalTestId.value = null
      formData.value = {
        method: 'Fast Blue',
        result: '',
        conclution: '',
      }
    }

    const closeDialog = () => {
      emit('update:visible', false)
    }

    const submit = async () => {
      if (!props.analysis?.id) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Análisis inválido',
          life: 3000,
        })
        return
      }

      isSaving.value = true
      try {
        // Convertir resultado mostrado a Positivo/Negativo
        let savedResult = 'NEGATIVO'
        if (formData.value.result === 'Reacción Cualitativa Positiva') {
          savedResult = 'POSITIVO'
        }

        const payload = {
          method: formData.value.method || null,
          result: savedResult,
          conclution: formData.value.conclution || null,
          analysis: props.analysis,
          user: { id: parseInt(localStorage.getItem('user_id')) || 1 },
        }

        console.log('📤 Enviando payload:', payload)

        if (existingChemicalTestId.value) {
          // Actualizar existente
          await chemicalTestsService.update(existingChemicalTestId.value, payload)
          toast.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Examen químico actualizado correctamente',
            life: 3000,
          })
        } else {
          // Crear nuevo
          console.log('Creando nuevo examen químico', payload)
          await chemicalTestsService.create(payload)
          toast.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'Examen químico guardado. Análisis COMPLETADO',
            life: 3000,
          })
        }

        // Actualizar estado del análisis a COMPLETADO y guardar resultado en result
        try {
          const analysisService = (await import('@/services/analysisService.js')).default
          await analysisService.update(props.analysis.id, {
            ...props.analysis,
            state: 'COMPLETADO',
            result: savedResult,
          })
        } catch (stateErr) {
          console.warn('No se pudo actualizar el estado del análisis:', stateErr)
        }

        emit('saved')
        closeDialog()
      } catch (error) {
        console.error('Error guardando examen químico:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el examen químico',
          life: 3000,
        })
      } finally {
        isSaving.value = false
      }
    }

    return {
      formData,
      isSaving,
      existingChemicalTestId,
      resultOptions,
      closeDialog,
      submit,
      resetForm,
    }
  },
}
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.field label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
</style>
