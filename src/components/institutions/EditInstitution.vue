<template>
  <div>
    <!-- Botón para abrir el diálogo -->
    <Button
      icon="pi pi-pencil"
      class="p-button-rounded p-button-info"
      @click="openDialog"
    />

    <!-- Diálogo de edición -->
    <Dialog
      v-model:visible="visible"
      modal
       :style="{ width: '30rem' }"

      :headerStyle="{ padding: '1rem 1.5rem' }"
      :contentStyle="{ padding: '1rem 1.5rem' }"
      :transition-options="{ name: 'fade', duration: 300 }"
    >
      <template #header>
        <span class="text-xl font-semibold">Editar Institución</span>
      </template>

      <!-- Contenido -->
      <div class="dialog-content">
        <div
          v-if="isLoading"
          class="flex justify-content-center align-items-center"
          style="height: 200px;"
        >
          <ProgressSpinner />
        </div>

        <div v-else class="flex flex-column gap-4">
          <div class="field">
            <label for="name">Nombre</label>
            <InputText
              id="name"
              v-model="form.name"
              class="  w-full"
              placeholder="Ingrese el nombre de la comuna"
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <template #footer>
        <Button
          label="Cerrar"
          severity="secondary"
          @click="closeDialog"
          :disabled="isLoading"
        />
        <Button
          label="Guardar"
          icon="pi pi-save"
          @click="updateInstitution"
          :loading="isLoading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'
import institutionsService from '@/services/institutionsService'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  name: 'EditInstitution',
  components: { InputText, Button, Dialog, ProgressSpinner },
  props: {
    institution: {
      type: Object,
      required: true
    }
  },
  emits: ['updated'],

  setup(props, { emit }) {
    const visible = ref(false)
    const isLoading = ref(false)
    const form = reactive({
      name: ''
    })

    // ✅ Cargar los datos de la comuna en el formulario cuando cambia la prop
    watch(
      () => props.institution,
      (newVal) => {
        if (newVal) {
          form.name = newVal.name || ''
        }
      },
      { immediate: true, deep: true }
    )

    // ✅ Resetear formulario cuando se abre el diálogo
    watch(
      () => visible.value,
      (isVisible) => {
        if (isVisible && props.institution) {
          form.name = props.institution.name || ''
        }
      }
    )

    // ✅ Abrir diálogo
    const openDialog = () => {
      visible.value = true
    }

    // ✅ Cerrar diálogo
    const closeDialog = () => {
      visible.value = false
    }

    // ✅ Actualizar comuna
    const updateInstitution = async () => {
      if (!form.name.trim()) {
        console.error('❌ El nombre no puede estar vacío')
        return
      }

      try {
        isLoading.value = true
        const payload = { name: form.name.trim() }

        const { data } = await institutionsService.update(props.institution.id, payload)

        emit('updated', data)
        closeDialog()
      } catch (e) {
        console.error('❌ Error al actualizar comuna:', e)
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
      updateInstitution
    }
  }
}
</script>

<style scoped>
.dialog-content {
  padding: 0.5rem 0;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

:deep(.p-inputtext) {
  width: 100%;
}
</style>