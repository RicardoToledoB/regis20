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

        <div v-else class="flex flex-column gap-1">
          <!-- Información Personal -->
          <div class="grid grid-nogutter gap-1">
            <div class="col-12 field">
              <label for="firstName">Primer Nombre *</label>
              <InputText
                id="firstName"
                v-model="form.firstName"
                class="  w-full"
                placeholder="Primer nombre"
              />
            </div>
            <div class="col-12 field">
              <label for="secondName">Segundo Nombre</label>
              <InputText
                id="secondName"
                v-model="form.secondName"
                class="  w-full"
                placeholder="Segundo nombre"
              />
            </div>
          </div>

          <div class="grid grid-nogutter gap-1">
            <div class="col-12 field">
              <label for="firstLastName">Primer Apellido *</label>
              <InputText
                id="firstLastName"
                v-model="form.firstLastName"
                class="  w-full"
                placeholder="Primer apellido"
              />
            </div>
            <div class="col-12 field">
              <label for="secondLastName">Segundo Apellido</label>
              <InputText
                id="secondLastName"
                v-model="form.secondLastName"
                class="  w-full"
                placeholder="Segundo apellido"
              />
            </div>
          </div>

          <div class="grid grid-nogutter gap-1">
            <div class="col-12 field">
              <label for="rut">RUT *</label>
              <InputText
                id="rut"
                v-model="form.rut"
                class="  w-full"
                placeholder="12345678-9"
              />
            </div>
            <div class="col-12 field">
              <label for="cellphone">Celular *</label>
              <InputText
                id="cellphone"
                v-model="form.cellphone"
                class="  w-full"
                placeholder="912345678"
              />
            </div>
          </div>

          <div class="field">
            <label for="email">Email *</label>
            <InputText
              id="email"
              v-model="form.email"
              class="  w-full"
              placeholder="correo@ejemplo.cl"
              type="email"
            />
          </div>

          <!-- Información Institucional -->
          <div class="grid grid-nogutter gap-1">
            <div class="col-12 field">
              <label for="institutionType">Tipo de Institución *</label>
              <Dropdown
                id="institutionType"
                v-model="form.institutionType"
                :options="institutionTypes"
                optionLabel="name"
                placeholder="Seleccione tipo"
                class="w-full"
                :filter="true"
                @change="onInstitutionTypeChange"
              />
            </div>
            <div class="col-12 field">
              <label for="grade">Grado *</label>
              <Dropdown
                id="grade"
                v-model="form.grade"
                :options="grades"
                optionLabel="name"
                placeholder="Seleccione grado"
                class="w-full"
                :filter="true"
                :disabled="!form.institutionType"
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
import { reactive, ref, computed, onMounted } from 'vue'
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
    const allGrades = ref([]) // Almacena todos los grados

    const form = reactive({
      firstName: "",
      secondName: "",
      firstLastName: "",
      secondLastName: "",
      rut: "",
      email: "",
      cellphone: "",
      institutionType: null,
      grade: null
    })

    // ✅ Computed para filtrar grados por institutionType seleccionado
    const filteredGrades = computed(() => {
      if (!form.institutionType) return []
      return allGrades.value.filter(grade => 
        grade.institutionType?.id === form.institutionType.id
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

    const onInstitutionTypeChange = () => {
      // Limpiar el grado seleccionado cuando cambia el tipo de institución
      // Solo si el grado actual no pertenece a la nueva institución
      if (form.grade && form.grade.institutionType?.id !== form.institutionType?.id) {
        form.grade = null
      }
    }

    // Cargar datos al montar el componente
    onMounted(async () => {
      await fetchInstitutionTypes()
      await fetchGrades()
    })

    // Cargar datos cuando se abre el diálogo
    const openDialog = async () => {
      console.log('🎯 Abriendo diálogo con police:', props.police)
      
      // Recargar datos para asegurar que tenemos los datos más recientes
      await fetchInstitutionTypes()
      await fetchGrades()
      
      // Asignar valores al formulario
      form.firstName = props.police.firstName || ''
      form.secondName = props.police.secondName || ''
      form.firstLastName = props.police.firstLastName || ''
      form.secondLastName = props.police.secondLastName || ''
      form.rut = props.police.rut || ''
      form.email = props.police.email || ''
      form.cellphone = props.police.cellphone || ''
      
      // Buscar el objeto completo de institutionType en la lista cargada
      if (props.police.institutionType?.id) {
        form.institutionType = institutionTypes.value.find(
          type => type.id === props.police.institutionType.id
        ) || null
      } else {
        form.institutionType = null
      }
      
      // Buscar el objeto completo de grade en la lista cargada
      if (props.police.grade?.id) {
        form.grade = allGrades.value.find(
          grade => grade.id === props.police.grade.id
        ) || null
      } else {
        form.grade = null
      }
      
      console.log('📝 Formulario cargado:', {
        firstName: form.firstName,
        institutionType: form.institutionType,
        grade: form.grade
      })

      visible.value = true
    }

    const closeDialog = () => {
      visible.value = false
    }

    const updatePolice = async () => {
      if (!form.firstName.trim() || !form.firstLastName.trim() || 
          !form.rut.trim() || !form.email.trim() || !form.cellphone.trim() ||
          !form.institutionType || !form.grade) {
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
          institutionType: form.institutionType,
          grade: form.grade
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
      updatePolice,
      onInstitutionTypeChange
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