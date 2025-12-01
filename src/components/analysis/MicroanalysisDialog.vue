<template>
  <Dialog
    :visible="visible"
    modal
    header="Microanálisis"
    :style="{ width: '700px' }"
    @update:visible="closeDialog"
  >
    <div class="p-fluid">
      <div class="grid formgrid">
        <div class="col-12 md:col-6 field">
          <label>Fecha</label>
          <Calendar v-model="formData.date" dateFormat="dd/mm/yy" showIcon />
        </div>

        <div class="col-12 md:col-6 field">
          <label>Aumento Utilizado</label>
          <InputText v-model="formData.aumento" placeholder="Ej: 40x, 100x" />
        </div>
        <div class="col-12 md:col-6 field">
          <label>Tricomas Glandulares</label>
          <InputText v-model="formData.ttgland" />
        </div>

        <div class="col-12 md:col-6 field">
          <label>Tricomas no Glandulares</label>
          <InputText v-model="formData.ttnogland" />
        </div>

        <div class="col-12 md:col-6 field">
          <label>Estomas</label>
          <InputText v-model="formData.stomas" />
        </div>

        <div class="col-12 md:col-6 field">
          <label>Celulas Epidermicas</label>
          <InputText v-model="formData.celepi" />
        </div>

        <div class="col-12 md:col-6 field">
          <label>Celulas con Resina</label>
          <InputText v-model="formData.celresi" />
        </div>

        <div class="col-12 md:col-6 field">
          <label>Cristales</label>
          <InputText v-model="formData.cris" />
        </div>

        <div class="col-12 field">
          <label>Observación</label>
          <Textarea
            v-model="formData.observation"
            rows="3"
            placeholder="Observaciones adicionales"
          />
        </div>
        <div class="col-12 field">
          <label>Conclusión</label>
          <Textarea
            v-model="formData.conclution"
            rows="3"
            placeholder="Conclusión del microanálisis"
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
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import microanalysisService from '@/services/microanalysisService.js'

export default {
  name: 'MicroanalysisDialog',
  components: {
    Dialog,
    InputText,
    Textarea,
    Calendar,
    Button,
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

    const formData = ref({
      ttgland: '',
      ttnogland: '',
      stomas: '',
      celepi: '',
      celresi: '',
      cris: '',
      conclution: '',
      observation: '',
      date: null,
      aumento: '',
    })

    // Cargar datos del microanálisis existente cuando se abre
    watch(
      () => props.visible,
      async (newVal) => {
        if (newVal && props.analysis?.id) {
          try {
            const { data } = await microanalysisService.getById(props.analysis.id)
            const microanalysis = data.content?.[0] || data?.[0]

            if (microanalysis) {
              formData.value = {
                ttgland: microanalysis.ttgland || '',
                ttnogland: microanalysis.ttnogland || '',
                stomas: microanalysis.stomas || '',
                celepi: microanalysis.celepi || '',
                celresi: microanalysis.celresi || '',
                cris: microanalysis.cris || '',
                conclution: microanalysis.conclution || '',
                observation: microanalysis.observation || '',
                date: microanalysis.date ? new Date(microanalysis.date) : null,
                aumento: microanalysis.aumento || '',
              }
            } else {
              resetForm()
            }
          } catch (error) {
            console.error('Error cargando microanálisis:', error)
            resetForm()
          }
        }
      },
    )

    const resetForm = () => {
      formData.value = {
        ttgland: '',
        ttnogland: '',
        stomas: '',
        celepi: '',
        celresi: '',
        cris: '',
        conclution: '',
        observation: '',
        date: null,
        aumento: '',
      }
    }

    const formatDate = (date) => {
      if (!date) return null
      const d = new Date(date)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}-${month}-${year}`
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
        const payload = {
          ttgland: formData.value.ttgland || null,
          ttnogland: formData.value.ttnogland || null,
          stomas: formData.value.stomas || null,
          celepi: formData.value.celepi || null,
          celresi: formData.value.celresi || null,
          cris: formData.value.cris || null,
          conclution: formData.value.conclution || null,
          observation: formData.value.observation || null,
          date: formData.value.date ? formatDate(formData.value.date) : null,
          aumento: formData.value.aumento || null,
          analysis: props.analysis,
          user: { id: parseInt(localStorage.getItem('user_id')) || 1 },
        }

        console.log('📤 Enviando payload:', payload)

        // Intentar obtener si existe microanálisis
        const { data: existing } = await microanalysisService.getById(props.analysis.id)
        const microanalysis = existing.content?.[0] || existing?.[0]

        if (microanalysis) {
          // Actualizar existente
          await microanalysisService.update(microanalysis.id, payload)
          toast.add({
            severity: 'success',
            summary: 'Actualizado',
            detail: 'Microanálisis actualizado correctamente',
            life: 3000,
          })
        } else {
          // Crear nuevo
          console.log('Creando nuevo microanálisis', payload)
          await microanalysisService.create(payload)
          toast.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'Microanálisis guardado correctamente',
            life: 3000,
          })
        }

        emit('saved')
        closeDialog()
      } catch (error) {
        console.error('Error guardando microanálisis:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el microanálisis',
          life: 3000,
        })
      } finally {
        isSaving.value = false
      }
    }

    return {
      formData,
      isSaving,
      closeDialog,
      submit,
      formatDate,
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
