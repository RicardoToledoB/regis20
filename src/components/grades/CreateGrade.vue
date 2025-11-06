<template>
  <div class="card flex justify-center">
    <Button label="Crear Grado" @click="openDialog">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-plus" />
      </template>
    </Button>

    <Dialog 
      v-model:visible="visible"
      :style="{ width: '35rem', padding: '0.5rem' }"
      modal
      :headerStyle="{ padding: '1rem 1.5rem' }"
      :contentStyle="{ padding: '1rem 0.5rem 1rem 1rem' }"
      :transition-options="{ name: 'fade', duration: 300 }"
    >
      <template #header>
        <span class="text-xl font-semibold">Crear Grado</span>
      </template>

      <!-- Spinner mientras se guarda -->
      <div v-if="isLoading" class="flex justify-content-center align-items-center" style="height:200px;">
        <ProgressSpinner />
      </div>

      <!-- Formulario solo cuando no está cargando -->
      <div v-else class="dialog-content">
        <div class="flex flex-column gap-4">
          <div class="field">
            <label for="name">Nombre</label>
            <InputText 
              id="name"
              v-model="form.name" 
              class="p-inputtext-lg w-full" 
              placeholder="Ingrese el nombre del grado"
            />
          </div>

          <div class="field">
            <label for="description">Descripción</label>
            <InputText 
              id="description"
              v-model="form.description" 
              class="p-inputtext-lg w-full" 
              placeholder="Ingrese la descripción"
            />
          </div>

          <div class="field">
            <label for="institutionType">Tipo de Institución</label>
            <Dropdown
              id="institutionType"
              v-model="form.institutionType"
              :options="institutionTypes"
              optionLabel="name"
              placeholder="Seleccione un tipo de institución"
              class="w-full"
              :filter="true"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cerrar" severity="secondary" @click="closeDialog" :disabled="isLoading"/>
        <Button label="Guardar" @click="saveGrade" :loading="isLoading"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import gradeService from '@/services/gradesService'
import institutionTypeService from '@/services/institutionTypesService'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  name: "CreateGrade",
  components: { InputText, Button, Dialog, Dropdown, ProgressSpinner },
  emits: ["created"],

  setup(props, { emit }) {
    const visible = ref(false)
    const isLoading = ref(false)
    const institutionTypes = ref([])

    const form = reactive({
      name: "",
      description: "",
      institutionType: null
    })

    const fetchInstitutionTypes = async () => {
      try {
        const { data } = await institutionTypeService.getAll()
        institutionTypes.value = data
      } catch (error) {
        console.error('❌ Error cargando tipos de institución:', error)
      }
    }

    const openDialog = async () => {
      visible.value = true
      if (institutionTypes.value.length === 0) {
        await fetchInstitutionTypes()
      }
    }

    const closeDialog = () => { 
      visible.value = false 
      resetForm()
    }

    const resetForm = () => {
      form.name = ""
      form.description = ""
      form.institutionType = null
    }

    const saveGrade = async () => {
      if (!form.name.trim() || !form.institutionType) {
        console.error('❌ Nombre y Tipo de Institución son requeridos')
        return
      }

      try {
        isLoading.value = true
        const payload = { 
          name: form.name.trim(),
          description: form.description.trim(),
          institutionType: form.institutionType
        }
        
        console.log('📤 Enviando payload:', payload)
        const { data } = await gradeService.create(payload)

        // ✅ Emitir solo un evento para indicar que se debe recargar
        emit("created")
        closeDialog()
      } catch (e) {
        console.error("❌ Error al crear el grado:", e)
      } finally {
        isLoading.value = false
      }
    }

    return {
      visible,
      form,
      institutionTypes,
      isLoading,
      openDialog,
      closeDialog,
      saveGrade
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