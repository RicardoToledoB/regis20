<template>
  <div>
    <ThemeSwitcher />
    <div class="card flex justify-center">
      <Button label="Agregar Institución" @click="openDialog" />

      <Dialog 
        v-model:visible="visible" 
        maximizable 
        header="Agregar Institución" 
        :style="{ width: '50rem' }"
        :headerStyle="{ 
          padding: '1.5rem 1.5rem 1rem 1rem',
        }"
        :contentStyle="{ 
          padding: '1rem 1.5rem 1.5rem 1.5rem'
        }"         
      >
        <template #header>
          <div class="custom-header">
            <span class="text-xl font-semibold">Crear Institución</span>
          </div>
        </template>
        
        <!-- Formulario -->
        <div class="dialog-content">
          <div class="flex flex-column gap-2">
            <label for="name">Nombre</label>
            <InputText 
              id="name" 
              v-model="institution.name" 
              placeholder="Ej: Carabineros de Chile"
              class="p-inputtext-lg"
            />
          </div>
        </div>

        <!-- Botones de acción -->
        <template #footer>
          <div class="flex justify-content-end gap-2">
            <Button 
              type="button" 
              label="Cerrar" 
              severity="secondary" 
              @click="closeDialog"
            >
              <template #icon>
                <font-awesome-icon icon="fa-solid fa-close" />
              </template>
            </Button>

            <Button 
              type="button" 
              label="Guardar" 
              icon="pi pi-save"
              @click="saveData"
              :loading="isSaving"
            />
          </div>
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from 'vue'
import institutionsService from '@/services/institutionsService.js' // ✅ Import correcto
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'


export default {
  name: 'CreateInstitution',
  components: { Button, Dialog, InputText },

  setup() {
    const toast = useToast()
const { emit } = getCurrentInstance()

    const visible = ref(false)
    const isSaving = ref(false)
    const institution = ref({ name: '',
      commune:{id:1},
      institutionType:{id:2}
     })

    const openDialog = () => {
      visible.value = true
    }

    const closeDialog = () => {
      visible.value = false
    }

   const saveData = async () => {
  if (!institution.value.name || institution.value.name.trim() === '') {
    toast.add({ severity: 'warn', summary: 'Atención', detail: 'Ingrese un nombre para la institución', life: 3000 })
    return
  }

  try {
    isSaving.value = true
    const { data } = await institutionsService.create(institution.value)
    toast.add({ severity: 'success', summary: 'Éxito', detail: 'Institución creada correctamente', life: 3000 })
    
    // ✅ Emitir evento con la nueva institución
    emit('created', data)
    
    closeDialog()
    institution.value = { name: '', commune:{id:1}, institutionType:{id:2} }
  } catch (error) {
    console.error(error)
    toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data?.message || 'Error al conectar con el servidor', life: 5000 })
  } finally {
    isSaving.value = false
  }
}

    return {
      visible,
      institution,
      isSaving,
      openDialog,
      closeDialog,
      saveData
    }
  }
}
</script>

<style scoped>
.dialog-content {
  padding: 1.5rem;
}

.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
