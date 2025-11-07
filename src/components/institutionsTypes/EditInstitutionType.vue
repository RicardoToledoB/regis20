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
        <span class="text-xl font-semibold">Editar Tipo de Institución</span>
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
        <Button
          label="Cerrar"
          severity="secondary"
          @click="closeDialog"
          :disabled="isLoading"
        />
        <Button
          label="Guardar"
          icon="pi pi-save"
          @click="updateInstitutionType"
          :loading="isLoading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue'
import institutionTypeService from '@/services/institutionTypesService'
import institutionsService from '@/services/institutionsService'
import communesService from '@/services/communesService'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  name: 'EditInstitutionType',
  components: { InputText, Button, Dialog, Dropdown, ProgressSpinner },
  props: {
    institutionType: {
      type: Object,
      required: true
    }
  },
  emits: ['updated'],

  setup(props, { emit }) {
    const visible = ref(false)
    const isLoading = ref(false)
    const institutions = ref([])
    const communes = ref([])

    const form = reactive({
      name: '',
      communeId: null,
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
        console.log('✅ Comunas cargadas:', data)
      } catch (error) {
        console.error('❌ Error cargando comunas:', error)
      }
    }

   

    // Función para obtener el nombre de la comuna por ID (para debug)
    const getCommuneName = (communeId) => {
      if (!communeId) return 'No ID'
      const commune = communes.value.find(c => c.id === communeId)
      return commune ? commune.name : 'Not found'
    }

    // Cargar datos al montar el componente
    onMounted(async () => {
      await fetchInstitutions()
      await fetchCommunes()
    })

    // Cargar datos cuando se abre el diálogo
    const openDialog = async () => {
      console.log('🎯 Abriendo diálogo con institutionType:', props.institutionType)
      
      // Recargar datos para asegurar que tenemos las comunas más recientes
      await fetchCommunes()
      
      // Asignar valores al formulario
      form.name = props.institutionType.name || ''
      form.institutionId = props.institutionType.institution?.id || null
      
      // Buscar el ID de la comuna
    //  const communeId = findCommuneIdByName(props.institutionType.commune)
      form.communeId = props.institutionType.commune.id
      
      console.log('📝 Formulario cargado:', {
        name: form.name,
        communeId: form.communeId,
        institutionId: form.institutionId
      })

      visible.value = true
    }

    const closeDialog = () => {
      visible.value = false
    }

    const updateInstitutionType = async () => {
      if (!form.name.trim() || !form.communeId || !form.institutionId) {
        console.error('❌ Todos los campos son requeridos')
        return
      }

      try {
        isLoading.value = true
        const payload = {
          name: form.name.trim(),
          commune: {id:form.communeId},
          institution: {id:form.institutionId}
        }

        console.log('💾 Enviando payload:', payload)
        const { data } = await institutionTypeService.update(props.institutionType.id, payload)

        emit('updated', data)
        closeDialog()
      } catch (e) {
        console.error('❌ Error al actualizar tipo de institución:', e)
      } finally {
        isLoading.value = false
      }
    }

    return {
      visible,
      isLoading,
      institutions,
      communes,
      form,
      openDialog,
      closeDialog,
      updateInstitutionType,
      getCommuneName
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