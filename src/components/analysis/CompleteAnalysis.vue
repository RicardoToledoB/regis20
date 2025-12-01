<template>
  <div class="card flex justify-center">
    <Button
      icon="pi pi-cog"
      class="p-button-text p-button-warning"
      label="Procesar"
      @click="openDialog"
    />

    <Dialog
      v-model:visible="visible"
      :style="{ width: '700px' }"
      modal
      :headerStyle="{ padding: '1rem 1.5rem' }"
      :transition-options="{ name: 'fade', duration: 200 }"
      @hide="handleClose"
    >
      <template #header>
        <span class="text-xl font-semibold">Procesar Análisis</span>
      </template>

      <div class="dialog-content">
        <!-- DATOS FIJOS: tarjeta mejorada -->
        <Card class="mb-3 p-card-compact">
          <template #title>
            <div class="flex align-items-center justify-content-between w-full">
              <div class="flex align-items-center gap-3">
                <div class="text-xl font-bold">Análisis #{{ form.id || '-' }}</div>
              </div>
              <Tag :value="form.state || '—'" :severity="stateSeverity(form.state)" />
            </div>
          </template>
          <template #content>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field small">
                  <label class="muted">Recepción</label>
                  <div class="value">#{{ form.preAnalysis?.reception?.number || '—' }}</div>
                </div>
                <div class="field small">
                  <label class="muted">Usuario</label>
                  <div class="value">
                    {{
                      form.user?.firstName
                        ? form.user.firstName + ' ' + (form.user.lastName || '')
                        : '—'
                    }}
                  </div>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="field small">
                  <label class="muted">Peso muestreado (g)</label>
                  <div class="value">{{ form.preAnalysis?.weight_sampled ?? '—' }}</div>
                </div>
                <div class="field small">
                  <label class="muted">Sustancia</label>
                  <div class="value">
                    {{ form.preAnalysis?.substance?.substanceType?.name || '—' }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <hr class="my-3" />

        <!-- CAMPOS EDITABLES -->
        <h3 class="font-semibold mb-2">Completar análisis</h3>

        <div class="grid formgrid">
          <div class="col-12 md:col-6 field">
            <label>N° Protocolo</label>
            <InputText v-model="form.number_protocol" />
          </div>

          <div class="col-12 md:col-6 field">
            <label>Fecha análisis</label>
            <Calendar v-model="form.date_analysis" dateFormat="dd/mm/yy" showIcon />
          </div>

          <div class="col-12 field">
            <label>Descripción</label>
            <Textarea autoResize rows="2" v-model="form.description" />
          </div>

          <div class="col-12 md:col-6 field">
            <label>Color</label>
            <InputText v-model="form.color" />
          </div>

          <div class="col-12 md:col-6 field">
            <label>Olor</label>
            <InputText v-model="form.smell" />
          </div>

          <!-- NUEVOS CAMPOS -->
          <div class="col-12 md:col-6 field">
            <label>Grado de fragmentación</label>
            <InputText v-model="form.gradeFrac" />
          </div>

          <div class="col-12 md:col-6 field">
            <label>Grado de humedad</label>
            <InputText v-model="form.gradeHum" />
          </div>

          <div class="col-12 md:col-6 field">
            <label>Resultado</label>
            <Dropdown
              v-model="form.result"
              :options="resultOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccione resultado"
            />
          </div>

          <!-- Editor de Composición -->
          <div class="col-12 field">
            <label>Composición</label>
            <div class="wysiwyg-toolbar">
              <button type="button" class="tool" @click.prevent="exec('bold')">
                <i class="pi pi-bold"></i>
              </button>
              <button type="button" class="tool" @click.prevent="exec('italic')">
                <i class="pi pi-italic"></i>
              </button>
              <button type="button" class="tool" @click.prevent="exec('underline')">
                <i class="pi pi-underline"></i>
              </button>
              <button type="button" class="tool" @click.prevent="exec('insertUnorderedList')">
                <i class="pi pi-list"></i>
              </button>
              <button type="button" class="tool" @click.prevent="exec('insertOrderedList')">
                <i class="pi pi-list-ol"></i>
              </button>
              <button type="button" class="tool" @click.prevent="execLink">
                <i class="pi pi-link"></i>
              </button>
            </div>

            <div
              ref="editor"
              class="wysiwyg-editor"
              contenteditable
              @input="onEditorInput"
              role="textbox"
              aria-multiline="true"
            ></div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="Guardar"
          severity="success"
          @click="submit"
          :loading="isSaving"
          :disabled="isSaving"
        />
        <Button label="Cerrar" severity="secondary" @click="closeDialog" :disabled="isSaving" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import { useToast } from 'primevue/usetoast'
import analysisService from '@/services/analysisService'

export default {
  name: 'CompleteAnalysis',
  components: { Button, Dialog, Card, Tag, InputText, Textarea, Dropdown },
  props: {
    analysis: { type: Object, default: null },
  },
  emits: ['processed'],
  setup(props, { emit }) {
    const visible = ref(false)

    // Form con valores editables
    const form = ref({})

    // Opciones para el resultado
    const resultOptions = ref([
      { label: 'POSITIVO', value: 'POSITIVO' },
      { label: 'NEGATIVO', value: 'NEGATIVO' },
    ])

    // Copia profunda del analysis cuando se abre el modal
    const openDialog = () => {
      form.value = JSON.parse(JSON.stringify(props.analysis || {}))
      visible.value = true
    }

    const closeDialog = () => {
      visible.value = false
    }

    const handleClose = () => {
      visible.value = false
    }

    const toast = useToast()
    const isSaving = ref(false)

    // Emitir los datos para guardar (y persistir en backend)
    const submit = async () => {
      if (!form.value || !form.value.id) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Análisis inválido', life: 3000 })
        return
      }

      isSaving.value = true
      try {
        // Forzar estado COMPLETADO al procesar
        const payload = { ...form.value, state: 'COMPLETADO' }
        const { data } = await analysisService.update(form.value.id, payload)
        toast.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Análisis actualizado',
          life: 3000,
        })
        emit('processed', data || form.value)
        visible.value = false
      } catch (err) {
        console.error('Error guardando análisis:', err)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el análisis',
          life: 4000,
        })
      } finally {
        isSaving.value = false
      }
    }

    const stateSeverity = (state) => {
      if (!state) return 'info'
      switch ((state || '').toString().toUpperCase()) {
        case 'PENDIENTE':
          return 'warning'
        case 'COMPLETADO':
        case 'FINALIZADO':
        case 'PROCESADO':
          return 'success'
        case 'BORRADOR':
          return 'info'
        case 'ERROR':
        case 'RECHAZADO':
          return 'danger'
        default:
          return 'info'
      }
    }

    const editor = ref(null)

    const exec = (command, value = null) => {
      if (!editor.value) return
      editor.value.focus()
      try {
        document.execCommand(command, false, value)
      } catch (e) {
        console.warn('execCommand no soportado', e)
      }
    }

    const execLink = () => {
      const url = window.prompt('Ingrese URL (http://...)')
      if (url) exec('createLink', url)
    }

    const onEditorInput = () => {
      console.log('algo')

      if (!editor.value) return
      form.value.composition = editor.value.innerHTML
    }

    // cuando se abre el diálogo, inicializar editor con el HTML existente
    const openDialogOrig = openDialog
    const openDialogWrap = () => {
      openDialogOrig()
      // next tick to ensure DOM
      setTimeout(() => {
        if (editor.value) editor.value.innerHTML = form.value.composition || ''
      }, 0)
    }

    return {
      visible,
      form,
      resultOptions,
      openDialog: openDialogWrap,
      closeDialog,
      handleClose,
      submit,
      stateSeverity,
      editor,
      exec,
      execLink,
      onEditorInput,
      isSaving,
    }
  },
}
</script>

<style scoped>
.dialog-content {
  padding: 0.5rem 0;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
}

.field label {
  font-weight: 500;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.value {
  font-weight: 600;
  color: #333;
}

.muted {
  color: #6b6b6b;
  font-size: 0.85rem;
}

.small label {
  font-size: 0.78rem;
  color: #6b6b6b;
}

.p-card-compact .p-card-body {
  padding: 0.75rem 0.75rem;
}

.wysiwyg-toolbar {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.wysiwyg-toolbar .tool {
  background: #fff;
  border: 1px solid #dcdcdc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.wysiwyg-editor {
  min-height: 160px;
  border: 1px solid #e6e6e6;
  padding: 0.5rem;
  border-radius: 6px;
  background: #fff;
  overflow: auto;
}

.wysiwyg-editor:focus {
  outline: 2px solid rgba(0, 123, 255, 0.12);
}
</style>
