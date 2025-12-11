<template>
  <div>
    <Button
      icon="pi pi-pencil"
      severity="info"
      text
      rounded
      @click="openDialog"
      v-tooltip="'Editar'"
    />

    <Dialog
      v-model:visible="visible"
      :style="{ width: 'auto', padding: '0.5rem' }"
      modal
      :headerStyle="{ padding: '1rem 1.5rem' }"
      :transition-options="{ name: 'fade', duration: 300 }"
    >
      <template #header>
        <span class="text-xl font-semibold">Editar Tipo de Sustancia</span>
      </template>

      <div class="dialog-content">
        <div
          v-if="isLoading"
          class="flex justify-content-center align-items-center"
          style="height: 200px"
        >
          <ProgressSpinner />
        </div>

        <div v-else class="flex flex-column gap-4">
          <div>
            <label>Nombre</label>
            <InputText v-model="form.name" class="w-full" />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cerrar" severity="secondary" @click="closeDialog" :disabled="isLoading" />
        <Button label="Guardar" severity="success" @click="updateSubstance" :loading="isLoading" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import substances_types_service from '@/services/substancesTypesService'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'

export default {
  name: 'EditSubstance',
  components: { InputText, Button, Dialog, ProgressSpinner },
  props: {
    substance: {
      type: Object,
      required: true,
    },
  },
  emits: ['updated'],

  setup(props, { emit }) {
    const visible = ref(false)
    const isLoading = ref(false)
    const toast = useToast()

    const form = reactive({
      name: '',
    })

    const openDialog = async () => {
      if (props.substance) {
        form.name = props.substance.name || ''
      }
      visible.value = true
    }

    const closeDialog = () => {
      visible.value = false
    }

    const updateSubstance = async () => {
      if (!form.name.trim()) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El nombre es requerido',
          life: 3000,
        })
        return
      }

      try {
        isLoading.value = true
        const payload = { name: form.name }
        const { data } = await substances_types_service.update(props.substance.id, payload)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Tipo de sustancia actualizado correctamente',
          life: 3000,
        })
        emit('updated', data)
        closeDialog()
      } catch (e) {
        console.error('❌ Error al actualizar sustancia:', e)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la sustancia',
          life: 3000,
        })
      } finally {
        isLoading.value = false
      }
    }

    return {
      visible,
      isLoading,
      form,
      openDialog,
      closeDialog,
      updateSubstance,
    }
  },
}
</script>

<style scoped>
.dialog-content {
  padding: 0.1rem 0;
}

.field {
  flex-direction: column;
  gap: 0.2rem;
}

.field label {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

:deep(.p-password .p-inputtext) {
  width: 100%;
}
</style>
