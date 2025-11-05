<template>
  <div class="card flex justify-center">
    <Button label="Crear" @click="openDialog">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-plus" />
      </template>
    </Button>

    <Dialog 
      v-model:visible="visible"
      :style="{ width: '30rem', padding: '0.5rem' }"
      modal
      :headerStyle="{ padding: '1rem 1.5rem' }"
      :contentStyle="{ padding: '1rem 0.5rem 1rem 1rem' }"
      :transition-options="{ name: 'fade', duration: 300 }"
    >
      <template #header>
        <span class="text-xl font-semibold">Crear Locacion</span>
      </template>

      <!-- Spinner mientras se guarda -->
      <div v-if="isLoading" class="flex justify-content-center align-items-center" style="height:200px;">
        <ProgressSpinner />
      </div>

      <!-- Formulario solo cuando no está cargando -->
      <div v-else class="dialog-content">
        <div class="flex flex-column gap-2 mb-2">
          <label>Nombre</label>
          <InputText v-model="form.name" class="p-inputtext-lg" />
        </div>

    
      </div>

      <template #footer>
        <Button label="Cerrar" severity="secondary" @click="closeDialog" :disabled="isLoading"/>
        <Button label="Guardar" @click="saveLocation" :loading="isLoading"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue'
import locations from '@/services/locationsService'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

export default {
  name: "CreateLocation",
  components: {  InputText, Password, Button, Dialog },
  emits: ["created"],

  setup(props, { emit }) {
    const visible = ref(false)
    const isLoading = ref(false)

    const form = reactive({
     name:""
    })



    const openDialog = () => { visible.value = true }
    const closeDialog = () => { visible.value = false }

    const resetForm = () => {
      form.name=""
   
    }

    const saveLocation = async () => {
      try {
        isLoading.value = true
        const payload = { ...form }
        const { data } = await locations.create(payload)

        emit("created", data) // actualiza la tabla Users.vue

        resetForm()
        closeDialog()
      } catch (e) {
        console.error("❌ Error al crear la sustancia:", e)
      } finally {
        isLoading.value = false
      }
    }

    return {
      visible,
      form,
      isLoading,
      openDialog,
      closeDialog,
      saveLocation
    }
  }
}
</script>

<style scoped>
:deep(.p-password .p-inputtext) {
  width: 100%;
}
.dialog-content {
  padding: 0.5rem 0;
}
</style>
