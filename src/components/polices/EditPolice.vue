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
      :style="{ width: '40rem', padding: '0.5rem' }"
      :headerStyle="{ padding: '1rem 1.5rem' }"
      :contentStyle="{ padding: '1rem 1.5rem' }"
      :transition-options="{ name: 'fade', duration: 300 }"
    >
      <template #header>
        <span class="text-xl font-semibold">Editar Policía</span>
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
          <!-- Información Personal -->
          <div class="grid grid-nogutter gap-4">
            <div class="col-6 field">
              <label for="firstName">Primer Nombre *</label>
              <InputText
                id="firstName"
                v-model="form.firstName"
                class="p-inputtext-lg w-full"
                placeholder="Primer nombre"
              />
            </div>
            <div class="col-6 field">
              <label for="secondName">Segundo Nombre</label>
              <InputText
                id="secondName"
                v-model="form.secondName"
                class="p-inputtext-lg w-full"
                placeholder="Segundo nombre"
              />
            </div>
          </div>

          <div class="grid grid-nogutter gap-4">
            <div class="col-6 field">
              <label for="firstLastName">Primer Apellido *</label>
              <InputText
                id="firstLastName"
                v-model="form.firstLastName"
                class="p-inputtext-lg w-full"
                placeholder="Primer apellido"
              />
            </div>
            <div class="col-6 field">
              <label for="secondLastName">Segundo Apellido</label>
              <InputText
                id="secondLastName"
                v-model="form.secondLastName"
                class="p-inputtext-lg w-full"
                placeholder="Segundo apellido"
              />
            </div>
          </div>

          <div class="grid grid-nogutter gap-4">
            <div class="col-6 field">
              <label for="rut">RUT *</label>
              <InputText
                id="rut"
                v-model="form.rut"
                class="p-inputtext-lg w-full"
                placeholder="12345678-9"
              />
            </div>
            <div class="col-6 field">
              <label for="cellphone">Celular *</label>
              <InputText
                id="cellphone"
                v-model="form.cellphone"
                class="p-inputtext-lg w-full"
                placeholder="912345678"
              />
            </div>
          </div>

          <div class="field">
            <label for="email">Email *</label>
            <InputText
              id="email"
              v-model="form.email"
              class="p-inputtext-lg w-full"
              placeholder="correo@ejemplo.cl"
              type="email"
            />
          </div>

          <!-- Información Institucional -->
          <div class="grid grid-nogutter gap-4">
            <div class="col-6 field">
              <label for="institutionType">Tipo de Institución *</label>
              <Dropdown
                id="institutionType"
                v-model="form.institutionTypeId"
                :options="institutionTypes"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione tipo"
                class="w-full"
                :filter="true"
              />
            </div>
            <div class="col-6 field">
              <label for="grade">Grado *</label>
              <Dropdown
                id="grade"
                v-model="form.gradeId"
                :options="filteredGrades"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione grado"
                class="w-full"
                :filter="true"
                :disabled="!form.institutionTypeId"
              />
            </div>
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
          @click="updatePolice"
          :loading="isLoading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import policeService from '@/services/policesService'
import institutionTypeService from '@/services/institutionTypesService'
import gradeService from '@/services/gradesService'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  name: 'EditPolice',
  components: { InputText, Button, Dialog, Dropdown, ProgressSpinner },
  props: {
    police: {
      type: Object,
      required: true
    }
  },
  emits: ['updated'],

  setup(props, { emit }) {
    const visible = ref(false)
    const isLoading = ref(false)
    const institutionTypes = ref([])
    const allGrades = ref([])

    const form = reactive({
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      rut: '',
      email: '',
      cellphone: '',
      institutionTypeId: null,
      gradeId: null
    })

    // ✅ Computed para filtrar grados por institutionType seleccionado
    const filteredGrades = computed(() => {
      if (!form.institutionTypeId) return []
      return allGrades.value.filter(grade => 
        grade.institutionType?.id === form.institutionTypeId
      )
    })

    const fetchInstitutionTypes = async () => {
      try {
        const { data } = await institutionTypeService.getAll()
        institutionTypes.value = data
      } catch (error) {
        console.error('❌ Error cargando tipos de institución:', error)
      }
    }

    const fetchGrades = async () => {
      try {
        const { data } = await gradeService.getAll()
        allGrades.value = data
      } catch (error) {
        console.error('❌ Error cargando grados:', error)
      }
    }

    // Cargar datos al montar el componente
    onMounted(async () => {
      await Promise.all([fetchInstitutionTypes(), fetchGrades()])
    })

    // Cargar datos cuando se abre el diálogo
    const openDialog = async () => {
      console.log('🎯 Abriendo diálogo con police:', props.police)
      
      // Recargar datos para asegurar que tenemos los datos más recientes
      await Promise.all([fetchInstitutionTypes(), fetchGrades()])
      
      // Asignar valores al formulario
      form.firstName = props.police.firstName || ''
      form.secondName = props.police.secondName || ''
      form.firstLastName = props.police.firstLastName || ''
      form.secondLastName = props.police.secondLastName || ''
      form.rut = props.police.rut || ''
      form.email = props.police.email || ''
      form.cellphone = props.police.cellphone || ''
      form.institutionTypeId = props.police.institutionType?.id || null
      form.gradeId = props.police.grade?.id || null
      
      console.log('📝 Formulario cargado:', form)

      visible.value = true
    }

    const closeDialog = () => {
      visible.value = false
    }

    const updatePolice = async () => {
      if (!form.firstName.trim() || !form.firstLastName.trim() || 
          !form.rut.trim() || !form.email.trim() || !form.cellphone.trim() ||
          !form.institutionTypeId || !form.gradeId) {
        console.error('❌ Todos los campos marcados con * son requeridos')
        return
      }

      try {
        isLoading.value = true
        const payload = {
          firstName: form.firstName.trim(),
          secondName: form.secondName.trim(),
          firstLastName: form.firstLastName.trim(),
          secondLastName: form.secondLastName.trim(),
          rut: form.rut.trim(),
          email: form.email.trim(),
          cellphone: form.cellphone.trim(),
          institutionType: { id: form.institutionTypeId },
          grade: { id: form.gradeId }
        }

        console.log('💾 Enviando payload:', payload)
        const { data } = await policeService.update(props.police.id, payload)

        emit('updated')
        closeDialog()
      } catch (e) {
        console.error('❌ Error al actualizar policía:', e)
      } finally {
        isLoading.value = false
      }
    }

    return {
      visible,
      isLoading,
      institutionTypes,
      grades: filteredGrades,
      form,
      openDialog,
      closeDialog,
      updatePolice
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