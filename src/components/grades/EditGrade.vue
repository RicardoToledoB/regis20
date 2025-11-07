<template>
  <div>
    <Button
      icon="pi pi-pencil"
      class="p-button-rounded p-button-info"
      @click="openDialog"
    />

    <Dialog
      v-model:visible="visible"
      modal
      :style="{ width: '35rem', padding: '0.5rem' }"
      :headerStyle="{ padding: '1rem 1.5rem' }"
      :contentStyle="{ padding: '1rem 1.5rem' }"
      :transition-options="{ name: 'fade', duration: 300 }"
    >
      <template #header>
        <span class="text-xl font-semibold">Editar Grado</span>
      </template>

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
              placeholder="Ingrese el nombre del grado"
            />
          </div>

          <div class="field">
            <label for="description">Descripción</label>
            <InputText
              id="description"
              v-model="form.description"
              class="  w-full"
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
        <Button
          label="Cerrar"
          severity="secondary"
          @click="closeDialog"
          :disabled="isLoading"
        />
        <Button
          label="Guardar"
          icon="pi pi-save"
          @click="updateGrade"
          :loading="isLoading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue'
import gradeService from '@/services/gradesService'
import institutionTypeService from '@/services/institutionTypesService'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  name: 'EditGrade',
  components: { InputText, Button, Dialog, Dropdown, ProgressSpinner },
  props: {
    grade: {
      type: Object,
      required: true
    }
  },
  emits: ['updated'],

  setup(props, { emit }) {
    const visible = ref(false)
    const isLoading = ref(false)
    const institutionTypes = ref([])

    const form = reactive({
      name: '',
      description: '',
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

    // Cargar datos al montar el componente
    onMounted(async () => {
      await fetchInstitutionTypes()
    })

    // Cargar datos cuando se abre el diálogo
    const openDialog = async () => {
      console.log('🎯 Abriendo diálogo con grade:', props.grade)
      
      // Recargar datos para asegurar que tenemos los tipos de institución más recientes
      await fetchInstitutionTypes()
      
      // Asignar valores al formulario
      form.name = props.grade.name || ''
      form.description = props.grade.description || ''
      
      // Buscar el objeto completo de institutionType en la lista cargada
      if (props.grade.institutionType?.id) {
        form.institutionType = institutionTypes.value.find(
          type => type.id === props.grade.institutionType.id
        ) || null
      } else {
        form.institutionType = null
      }
      
      console.log('📝 Formulario cargado:', {
        name: form.name,
        description: form.description,
        institutionType: form.institutionType
      })

      visible.value = true
    }

    const closeDialog = () => {
      visible.value = false
    }

    const updateGrade = async () => {
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

        console.log('💾 Enviando payload:', payload)
        const { data } = await gradeService.update(props.grade.id, payload)

        emit('updated')
        closeDialog()
      } catch (e) {
        console.error('❌ Error al actualizar grado:', e)
      } finally {
        isLoading.value = false
      }
    }

    return {
      visible,
      isLoading,
      institutionTypes,
      form,
      openDialog,
      closeDialog,
      updateGrade
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