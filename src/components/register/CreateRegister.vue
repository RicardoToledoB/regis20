<template>
  <div>
    <div class="card flex justify-center">
      <Button label="Recepcionar" icon="pi pi-file-import" @click="openDialog" />

      <Dialog 
        v-model:visible="visible" 
        maximizable 
        modal
        :style="{ width: '70rem' }"
        header="Recepción de Documento"
      >
        <template #header>
          <span class="text-xl font-semibold">Recepción de Documento</span>
        </template>

        <!-- Loader -->
        <div v-if="isLoading" class="flex justify-content-center align-items-center" style="height: 250px;">
          <ProgressSpinner />
        </div>

        <!-- Formulario -->
        <div v-else class="dialog-content">
          <!-- Datos del Oficio -->
          <div class="section-title">📄 Datos del Oficio</div>
          <div class="grid formgrid p-fluid">
            <div class="field col-12 md:col-4">
              <label>N° Oficio</label>
              <InputText v-model="form.of_number" />
            </div>

            <div class="field col-12 md:col-4">
              <label>Fecha Oficio</label>
              <Calendar v-model="form.of_number_date" dateFormat="dd/mm/yy" showIcon />
            </div>

            <div class="field col-12 md:col-4">
              <label>Fecha Recepción</label>
              <Calendar v-model="form.date_reception" dateFormat="dd/mm/yy" showIcon />
            </div>
          </div>

          <!-- Datos del Policía -->
          <div class="section-title">👮‍♂️ Datos del Policía</div>
          <div class="grid formgrid p-fluid">
            <div class="field col-12 md:col-3">
              <label>RUT</label>
              <div class="p-inputgroup">
                <InputText 
                  v-model="form.police.rut" 
                  placeholder="Ej: 12.345.678-9"
                  :class="{ 'p-invalid': rutError }"
                />
                <Button icon="pi pi-search" @click="buscarPolicia" :loading="buscandoPolicia" />
              </div>
              <small v-if="rutError" class="p-error">{{ rutError }}</small>
            </div>

            <div class="field col-12 md:col-3">
              <label>Nombre</label>
              <InputText v-model="form.police.firstName" class="p-inputtext-lg" />
            </div>

            <div class="field col-12 md:col-3">
              <label>Segundo Nombre</label>
              <InputText v-model="form.police.secondName" class="p-inputtext-lg"/>
            </div>

            <div class="field col-12 md:col-3">
              <label>Apellido Paterno</label>
              <InputText v-model="form.police.firstLastName" class="p-inputtext-lg"/>
            </div>

            <div class="field col-12 md:col-3">
              <label>Apellido Materno</label>
              <InputText v-model="form.police.secondLastName" class="p-inputtext-lg"/>
            </div>

            <div class="field col-12 md:col-3">
              <label>Correo</label>
              <InputText v-model="form.police.email" type="email" class="p-inputtext-lg"/>
            </div>

            <div class="field col-12 md:col-3">
              <label>Teléfono</label>
              <InputText v-model="form.police.cellphone" class="p-inputtext-lg"/>
            </div>

            <div class="field col-12 md:col-3">
              <label>Grado</label>
              <Dropdown
                v-model="form.police.grade.id"
                :options="grades"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione grado"
                class="w-full"
              />
            </div>

            <div class="field col-12">
              <label>Institución</label>
              <Dropdown
                v-model="form.police.institution.id"
                :options="institutions"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione una institución"
                class="w-full"
              />
            </div>

            <div class="field col-12 md:col-6">
              <label>Tipo de Institución</label>
              <Dropdown
                v-model="form.police.institutionType.id"
                :options="institutionTypes"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione tipo"
                class="w-full"
              />
            </div>

            <div class="field col-12 md:col-6">
              <label>Comuna</label>
              <Dropdown
                v-model="form.police.institutionType.commune.id"
                :options="communes"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione comuna"
                class="w-full"
              />
            </div>
          </div>

          <!-- Ubicación -->
          <div class="section-title">📍 Ubicación</div>
          <div class="grid formgrid p-fluid">
            <div class="field col-12">
              <label>Ubicación</label>
              <Dropdown
                v-model="form.location.id"
                :options="locations"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione ubicación"
                class="w-full"
              />
            </div>
          </div>

          <!-- Usuarios -->
          <div class="section-title">👤 Usuario Origen / Destino</div>
          <div class="grid formgrid p-fluid">
            <div class="field col-12 md:col-6">
              <label>Usuario Origen (Email)</label>
              <InputText v-model="form.user_origin.email" />
            </div>
            <div class="field col-12 md:col-6">
              <label>Usuario Destino (Email)</label>
              <InputText v-model="form.user_destination.email" />
            </div>
          </div>

          <!-- Drogas -->
          <div class="section-title">💊 Drogas Asociadas</div>

          <!-- Primera fila: tipo, cantidad, unidad -->
          <div class="grid formgrid p-fluid align-items-end">
            <div class="field col-12 md:col-6">
              <label>Tipo de Droga</label>
              <Dropdown 
                v-model="newDrug.type" 
                :options="substancesTypes"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione una droga"
                class="w-full"
              />
            </div>

            <div class="field col-12 md:col-3">
              <label>Cantidad</label>
              <InputNumber v-model="newDrug.amount" :min="0" />
            </div>

            <div class="field col-12 md:col-3">
              <label>Unidad</label>
              <InputText v-model="newDrug.unit" placeholder="Ej: gr, kg, ml" />
            </div>
          </div>

          <!-- Segunda fila: observaciones + botón agregar -->
          <div class="grid formgrid p-fluid align-items-end mt-2">
            <div class="field col-12 md:col-10">
              <label>Observaciones</label>
              <Textarea 
                v-model="newDrug.observations" 
                rows="4" 
                autoResize 
                placeholder="Ingrese observaciones..."
              />
            </div>

            <div class="field col-12 md:col-2 text-center">
              <Button 
                icon="pi pi-plus" 
                label="Agregar" 
                @click="addDrug"
                :disabled="!newDrug.type"
                class="mt-4 w-full"
              />
            </div>
          </div>

          <DataTable :value="form.drugs" responsiveLayout="scroll" class="mt-3">
            <Column field="type" header="Tipo de Droga">
              <template #body="slotProps">
                {{ getSubstanceName(slotProps.data.type) }}
              </template>
            </Column>
            <Column field="amount" header="Cantidad"></Column>
            <Column field="unit" header="Unidad"></Column>
            <Column field="observations" header="Observaciones"></Column>
            <Column header="Acciones" bodyStyle="text-align:center">
              <template #body="slotProps">
                <Button 
                  icon="pi pi-trash" 
                  severity="danger"
                  text 
                  @click="removeDrug(slotProps.index)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <template #footer>
          <Button label="Cerrar" severity="secondary" @click="closeDialog" />
          <Button label="Guardar" icon="pi pi-save" @click="guardarRecepcion" :loading="isSaving" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from "vue"
import Calendar from "primevue/calendar"
import InputText from "primevue/inputtext"
import Button from "primevue/button"
import Dialog from "primevue/dialog"
import Dropdown from "primevue/dropdown"
import InputNumber from "primevue/inputnumber"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Textarea from "primevue/textarea"
import ProgressSpinner from "primevue/progressspinner"

import recepcionService from "@/services/receptionsService"
import policeService from "@/services/policesService"
import {formatRut, validateRut} from "@/others/verificationRut"

import institutionsService from '@/services/institutionsService'
import institutionTypesService from '@/services/institutionTypesService'
import communesService from '@/services/communesService'
import locationsService from '@/services/locationsService'
import substancesTypesService from "@/services/substancesTypesService"
import gradesService from '@/services/gradesService'

export default {
  name: "RecepcionComponent",
  components: {
    Calendar, InputText, Button, Dialog,
    Dropdown, InputNumber, DataTable, Column,
    Textarea, ProgressSpinner
  },

  setup() {
    const visible = ref(false)
    const isLoading = ref(false)
    const isSaving = ref(false)
    const buscandoPolicia = ref(false)
    const rutError = ref("")
    
    // Datos para dropdowns
    const institutions = ref([])
    const institutionTypes = ref([])
    const communes = ref([])
    const locations = ref([])
    const substancesTypes = ref([])
    const grades = ref([])

    const form = reactive({
      number: "",
      of_number: "",
      of_number_date: null,
      date_reception: null,
      location: { id: null, name: "" },
      police: {
        id: 0,
        rut: "",
        firstName: "",
        secondName: "",
        firstLastName: "",
        secondLastName: "",
        email: "",
        cellphone: "",
        grade: { id: null, name: "" },
        institution: { id: null, name: "" },
        institutionType: { 
          id: null, 
          name: "",
          commune: { id: null, name: "" }
        }
      },
      user_origin: { id: 1 },
      user_destination: { id: 1 },
      drugs: []
    })

    const newDrug = reactive({
      type: null,
      amount: null,
      unit: "",
      observations: ""
    })

    const fetchDropdownData = async () => {
      try {
        isLoading.value = true
        const [instRes, typeRes, commRes, locRes, subRes, gradesRes] = await Promise.all([
          institutionsService.getAll(),
          institutionTypesService.getAll(),
          communesService.getAll(),
          locationsService.getAll(),
          substancesTypesService.getAll(),
          gradesService.getAll()
        ])
        
        institutions.value = instRes.data || []
        institutionTypes.value = typeRes.data || []
        communes.value = commRes.data || []
        locations.value = locRes.data || []
        substancesTypes.value = subRes.data || []
        grades.value = gradesRes.data || []
        
        console.log("✅ Datos cargados:", {
          institutions: institutions.value.length,
          institutionTypes: institutionTypes.value.length,
          communes: communes.value.length,
          locations: locations.value.length,
          substances: substancesTypes.value.length,
          grades: grades.value.length
        })
      } catch (err) {
        console.error("❌ Error cargando datos para dropdowns:", err)
      } finally {
        isLoading.value = false
      }
    }

    const getSubstanceName = (substanceId) => {
      const substance = substancesTypes.value.find(s => s.id === substanceId)
      return substance ? substance.name : 'Desconocido'
    }

    watch(() => form.police.rut, (newValue) => {
      if (!newValue) {
        rutError.value = ""
        return
      }

      // Formatear automáticamente
      form.police.rut = formatRut(newValue)

      // Validar formato
      if (!validateRut(form.police.rut)) {
        rutError.value = "RUT inválido"
      } else {
        rutError.value = ""
      }
    })

    const openDialog = async () => { 
      visible.value = true 
      if (institutions.value.length === 0) {
        await fetchDropdownData()
      }
    }

    const closeDialog = () => { 
      visible.value = false 
      // Resetear formulario si es necesario
      resetForm()
    }

    const resetForm = () => {
      Object.assign(form, {
        number: "",
        of_number: "",
        of_number_date: null,
        date_reception: null,
        location: { id: null, name: "" },
        police: {
          id: 0,
          rut: "",
          firstName: "",
          secondName: "",
          firstLastName: "",
          secondLastName: "",
          email: "",
          cellphone: "",
          grade: { id: null, name: "" },
          institution: { id: null, name: "" },
          institutionType: { 
            id: null, 
            name: "",
            commune: { id: null, name: "" }
          }
        },
        user_origin: { id: 0, email: "" },
        user_destination: { id: 0, email: "" },
        drugs: []
      })
    }

    const addDrug = () => {
      if (!newDrug.type) return
      form.drugs.push({ ...newDrug })
      // Limpiar formulario de nueva droga
      Object.assign(newDrug, {
        type: null,
        amount: null,
        unit: "",
        observations: ""
      })
    }

    const removeDrug = (index) => {
      form.drugs.splice(index, 1)
    }

    const buscarPolicia = async () => {
      if (!form.police.rut || rutError.value) {
        console.warn("⚠️ RUT inválido o vacío")
        return
      }

      try {
        buscandoPolicia.value = true
        console.log("🔍 Buscando policía con RUT:", form.police.rut)
        
        const  datos  = await policeService.getByRut(form.police.rut)
        console.log("✅ Policía encontrado:", datos)
        const data = datos.data.content[0]
        if (data) {
          // Actualizar todos los campos del policía
          form.police.id = data.id || 0
          form.police.firstName = data.firstName || ""
          form.police.secondName = data.secondName || ""
          form.police.firstLastName = data.firstLastName || ""
          form.police.secondLastName = data.secondLastName || ""
          form.police.email = data.email || ""
          form.police.cellphone = data.cellphone || ""

          // Actualizar grado si existe
          if (data.grade && data.grade.id) {
            form.police.grade.id = data.grade.id
            console.log("🎖️ Grado asignado:", data.grade.id)
          }

          // Actualizar institución si existe
          if (data.institutionType && data.institutionType.institution && data.institutionType.institution.id) {
            form.police.institution.id = data.institutionType.institution.id
            console.log("🏛️ Institución asignada:", data.institutionType.institution.id)
          }

          // Actualizar tipo de institución si existe
          if (data.institutionType && data.institutionType.id) {
            form.police.institutionType.id = data.institutionType.id
            console.log("📋 Tipo institución asignado:", data.institutionType.id)
          }

          // Actualizar comuna si existe
          if (data.institutionType && data.institutionType.commune && data.institutionType.commune.id) {
            form.police.institutionType.commune.id = data.institutionType.commune.id
            console.log("📍 Comuna asignada:", data.institutionType.commune.id)
          }

          console.log("✅ Campos actualizados correctamente")
        } else {
          console.warn("⚠️ No se encontró policía con ese RUT")
          // Podrías mostrar un toast/mensaje al usuario aquí
        }
      } catch (e) {
        console.error("❌ Error al buscar policía:", e)
        // Mostrar mensaje de error al usuario
      } finally {
        buscandoPolicia.value = false
      }
    }

    const guardarRecepcion = async () => {
      try {
        isSaving.value = true

        // Preparar payload para enviar
        const payload = {
          ...form,
          police: {
            ...form.police,
            institution: form.police.institution.id ? { id: form.police.institution.id } : null,
            grade: form.police.grade.id ? { id: form.police.grade.id } : null,
            institutionType: form.police.institutionType.id ? { 
              id: form.police.institutionType.id,
              commune: form.police.institutionType.commune.id ? { id: form.police.institutionType.commune.id } : null
            } : null
          },
          location: form.location.id ? { id: form.location.id } : null,
          user_origin: form.user_origin.email ? { email: form.user_origin.email } : null,
          user_destination: form.user_destination.email ? { email: form.user_destination.email } : null,
          drugs: form.drugs.map(drug => ({
            type: drug.type ? { id: drug.type } : null,
            amount: drug.amount,
            unit: drug.unit,
            observations: drug.observations
          }))
        }

        console.log("📤 Enviando payload:", payload)
        const { data } = await recepcionService.create(payload)
        console.log("✅ Recepción guardada:", data)
        
        closeDialog()
      } catch (e) {
        console.error("❌ Error al guardar recepción:", e)
      } finally {
        isSaving.value = false
      }
    }

    onMounted(() => {
      fetchDropdownData()
    })

    return {
      visible,
      isLoading,
      isSaving,
      buscandoPolicia,
      form,
      substancesTypes,
      institutions,
      institutionTypes,
      communes,
      locations,
      grades,
      rutError,
      newDrug,
      openDialog,
      closeDialog,
      addDrug,
      removeDrug,
      buscarPolicia,
      guardarRecepcion,
      getSubstanceName
    }
  }
}
</script>

<style scoped>
.section-title {
  font-weight: 600;
  margin: 1.5rem 0 0.75rem 0;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.25rem;
}
.field {
  margin-bottom: 1rem;
}
.dialog-content {
  padding: 1.5rem;
}
</style>