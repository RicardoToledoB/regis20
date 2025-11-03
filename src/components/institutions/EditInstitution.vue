<template>
  <Button 
    icon="pi pi-pencil" 
    class="p-button-text p-button-success" 
    @click="openDialog" 
    v-tooltip="'Editar'"
  />

  <Dialog v-model:visible="visible" header="Editar Institución" :style="{ width: '30rem' }">
    <div class="p-fluid">
      <div class="field">
        <label for="name">Nombre</label>
        <InputText id="name" v-model="editData.name" />
      </div>
    </div>
    <template #footer>
      <Button label="Cancelar" severity="secondary" @click="visible = false" />
      <Button label="Guardar" icon="pi pi-save" @click="updateInstitution" />
    </template>
  </Dialog>
</template>

<script>
import { ref, watch } from 'vue'
import institutionsService from '@/services/institutionsService.js'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

export default {
  name: 'EditInstitution',
  components: { Button, Dialog, InputText },
  props: {
    institution: { type: Object, required: true }
  },
  emits: ['updated'],

  setup(props, { emit }) {
    const visible = ref(false)
    const editData = ref({ ...props.institution })

    watch(() => props.institution, (newVal) => {
      editData.value = { ...newVal }
    })

    const openDialog = () => {
      visible.value = true
    }

    const updateInstitution = async () => {
      try {
        const { data } = await institutionsService.update(editData.value.id, editData.value)
        emit("updated", data)
        visible.value = false
        console.log("✅ Institución actualizada:", data)
      } catch (error) {
        console.error("❌ Error al actualizar institución:", error)
      }
    }

    return { visible, editData, openDialog, updateInstitution }
  }
}
</script>
