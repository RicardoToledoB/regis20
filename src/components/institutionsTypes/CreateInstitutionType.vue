<template>
  <div class="card flex justify-center">
    <Button label="Crear Tipo de Institución" @click="openDialog">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-plus" />
      </template>
    </Button>

    <Dialog 
      v-model:visible="visible"
      :style="{ width: '35rem', padding: '0.5rem' }"
      modal
      :headerStyle="{ padding: '1rem 1.5rem' }"
       
      :transition-options="{ name: 'fade', duration: 300 }"
    >
      <template #header>
        <span class="text-xl font-semibold">Crear Tipo de Institución</span>
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
              class="  w-full" 
              placeholder="Ingrese el nombre del tipo"
            />
          </div>

          <div class="field">
            <label for="commune">Comuna</label>
            <Dropdown
              id="commune"
              v-model="form.communeId"
              :options="communes"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione una comuna"
              class="w-full"
              :filter="true"
            />
          </div>

          <div class="field">
            <label for="institution">Institución</label>
            <Dropdown
              id="institution"
              v-model="form.institutionId"
              :options="institutions"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione una institución"
              class="w-full"
              :filter="true"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cerrar" severity="secondary" @click="closeDialog" :disabled="isLoading"/>
        <Button label="Guardar" @click="saveInstitutionType" :loading="isLoading"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import institutionTypeService from '@/services/institutionTypesService'
import institutionsService from '@/services/institutionsService'
import communesService from '@/services/communesService'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  name: "CreateInstitutionType",
  components: { InputText, Button, Dialog, Dropdown, ProgressSpinner },
  emits: ["created"],

  setup(props, { emit }) {
    const visible = ref(false)
    const isLoading = ref(false)
    const institutions = ref([])
    const communes = ref([]) // ✅ Agregada la variable communes

    const form = reactive({
      name: "",
      communeId: null, // ✅ Cambiado de commune a communeId
      institutionId: null
    })

    const fetchInstitutions = async () => {
      try {
        const { data } = await institutionsService.getAll()
        institutions.value = data
      } catch (error) {
        console.error('❌ Error cargando instituciones:', error)
      }
    }

    const fetchCommunes = async () => {
      try {
        const { data } = await communesService.getAll()
        communes.value = data
      } catch (error) {
        console.error('❌ Error cargando comunas:', error) // ✅ Corregido el mensaje de error
      }
    }

    const openDialog = async () => {
      visible.value = true
      if (institutions.value.length === 0) {
        await fetchInstitutions()
      }
      if (communes.value.length === 0) {
        await fetchCommunes()
      }
    }

    const closeDialog = () => { 
      visible.value = false 
      resetForm()
    }

    const resetForm = () => {
      form.name = ""
      form.communeId = null // ✅ Actualizado a communeId
      form.institutionId = null
    }

    const saveInstitutionType = async () => {
      if (!form.name.trim() || !form.communeId || !form.institutionId) {
        console.error('❌ Todos los campos son requeridos')
        return
      }

      try {
        isLoading.value = true
        const payload = { 
          name: form.name.trim(),
          commune: {id:form.communeId}, // ✅ Cambiado a communeId
          institution: {id:form.institutionId}
        }
        
        const { data } = await institutionTypeService.create(payload)

        emit("created", data)
        closeDialog()
      } catch (e) {
        console.error("❌ Error al crear el tipo de institución:", e)
      } finally {
        isLoading.value = false
      }
    }

    return {
      visible,
      form,
      institutions,
      communes, // ✅ Exportada communes
      isLoading,
      openDialog,
      closeDialog,
      saveInstitutionType
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