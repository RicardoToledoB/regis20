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
      :style="{ width: '600px' }"
      modal
      :headerStyle="{ padding: '1rem 1.5rem' }"
      :transition-options="{ name: 'fade', duration: 200 }"
      @hide="handleClose"
    >
      <template #header>
        <span class="text-xl font-semibold">Procesar Análisis</span>
      </template>

      <div class="dialog-content">
        <div class="field">
          <label>ID Análisis</label>
          <div>{{ analysis?.id || '—' }}</div>
        </div>
        <div class="field">
          <label>Sustancia</label>
          <div>{{ analysis?.preAnalysis?.substance?.substanceType?.name || '—' }}</div>
        </div>
        <div class="field">
          <label>Recepción</label>
          <div>#{{ analysis?.preAnalysis?.reception?.number || '—' }}</div>
        </div>
        <div class="field">
          <label>Estado</label>
          <div>{{ analysis?.state || '—' }}</div>
        </div>
      </div>

      <template #footer>
        <Button label="Cerrar" severity="secondary" @click="closeDialog" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

export default {
  name: 'CompleteAnalysis',
  components: { Button, Dialog },
  props: {
    analysis: { type: Object, default: null },
  },
  emits: ['processed'],
  setup(props, { emit }) {
    const visible = ref(false)

    const openDialog = () => {
      visible.value = true
    }

    const closeDialog = () => {
      visible.value = false
      // emit event in case parent wants to refresh
      emit('processed', props.analysis)
    }

    const handleClose = () => {
      visible.value = false
    }

    return { visible, openDialog, closeDialog, handleClose }
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
