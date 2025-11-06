<template>
  <div>
    <div class="card flex justify-center">
      <Button label="Recepcionar" icon="pi pi-file-import" @click="openDialog" />

      <Dialog 
        v-model:visible="visible" 
        maximizable 
        modal
        :style="{ width: '70rem' }"
        :headerStyle="{ padding: '1.5rem 1.5rem 0.5rem' }"
        :contentStyle="{ padding: '0 1.5rem 1rem' }"
        :footerStyle="{ padding: '1rem 1.5rem' }"
      >
        <template #header>
          <div class="dialog-header">
            <span class="text-xl font-semibold">Recepción de Documento</span>
          </div>
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
             <div class="field col-12 md:col-2">
                <label>N° Acta</label>
                <InputText v-model="form.number" class="p-inputtext-lg" placeholder="N° de acta"/>
              </div>
              
              <div class="field col-12 md:col-2">
                <label>N° Oficio</label>
                <InputText v-model="form.of_number" class="p-inputtext-lg"/>
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
                class="w-full p-inputtext-lg"
                :filter="true"
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
                class="w-full p-inputtext-lg"
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
                class="w-full p-inputtext-lg"
                :filter="true"
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
                class="w-full p-inputtext-lg"
                :filter="true"
              />
            </div>
          </div>

          <!-- Sustancias -->
          <div class="section-title">💊 Sustancias Asociadas</div>

          <!-- Primera fila: tipo, cantidad, unidad, packaging -->
          <div class="grid formgrid p-fluid align-items-end">
            <div class="field col-12 md:col-4">
              <label>Tipo de Sustancia</label>
              <Dropdown 
                v-model="newSubstance.substanceType" 
                :options="substancesTypes"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione sustancia"
                class="w-full p-inputtext-lg"
                :filter="true"
              />
            </div>

            <div class="field col-12 md:col-2">
              <label>Peso (gr)</label>
              <InputNumber 
                v-model="newSubstance.weight" 
                :min="0" 
                mode="decimal"
                :maxFractionDigits="2"
                class="p-inputtext-lg w-full"
                
              />
            </div>

            <div class="field col-12 md:col-3">
              <label>Packaging</label>
              <Dropdown
                v-model="newSubstance.packaging"
                :options="packagings"
                optionLabel="name"
                optionValue="id"
                placeholder="Seleccione packaging"
                class="w-full p-inputtext-lg"
                :filter="true"
              />
            </div>

            <div class="field col-12 md:col-3">
              <label>Comuna</label>
              <Dropdown
                v-model="newSubstance.commune"
                :options="communes"
                optionLabel="name"
                optionValue="id"
                placeholder="Comuna sustancia"
                class="w-full p-inputtext-lg"
                :filter="true"
              />
            </div>
          </div>

          <!-- Segunda fila: NUE, descripción + botón agregar -->
          <div class="grid formgrid p-fluid align-items-end mt-2">
            <div class="field col-12 md:col-4">
              <label>NUE</label>
              <InputText 
                v-model="newSubstance.nue" 
                placeholder="Número único de evidencia"
                class="p-inputtext-lg"
              />
            </div>

            <div class="field col-12 md:col-6">
              <label>Descripción</label>
              <Textarea 
                v-model="newSubstance.description" 
                rows="3" 
                autoResize 
                placeholder="Descripción de la sustancia..."
              />
            </div>

            <div class="field col-12 md:col-2 text-center">
              <Button 
                icon="pi pi-plus" 
                label="Agregar" 
                @click="addSubstance"
                :disabled="!newSubstance.substanceType || !newSubstance.weight"
                class="mt-4 w-full"
              />
            </div>
          </div>

          <!-- Tabla de sustancias -->
          <DataTable :value="form.substances" responsiveLayout="scroll" class="mt-3">
            <Column field="nue" header="NUE"></Column>
            <Column field="substanceType" header="Tipo de Sustancia">
              <template #body="slotProps">
                {{ getSubstanceName(slotProps.data.substanceType) }}
              </template>
            </Column>
            <Column field="weight" header="Peso (gr)">
              <template #body="slotProps">
                {{ slotProps.data.weight?.toFixed(2) }}
              </template>
            </Column>
            <Column field="packaging" header="Packaging">
              <template #body="slotProps">
                {{ getPackagingName(slotProps.data.packaging) }}
              </template>
            </Column>
            <Column field="commune" header="Comuna">
              <template #body="slotProps">
                {{ getCommuneName(slotProps.data.commune) }}
              </template>
            </Column>
            <Column field="description" header="Descripción"></Column>
            <Column header="Acciones" bodyStyle="text-align:center">
              <template #body="slotProps">
                <Button 
                  icon="pi pi-trash" 
                  severity="danger"
                  text 
                  @click="removeSubstance(slotProps.index)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <Button label="Cerrar" severity="secondary" @click="closeDialog" />
            <Button label="Guardar" icon="pi pi-save" @click="guardarRecepcion" :loading="isSaving" />
          </div>
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
import substancesService from "@/services/substancesService"
import policeService from "@/services/policesService"
import {formatRut, validateRut} from "@/others/verificationRut"

import institutionsService from '@/services/institutionsService'
import institutionTypesService from '@/services/institutionTypesService'
import communesService from '@/services/communesService'
import locationsService from '@/services/locationsService'
import substancesTypesService from "@/services/substancesTypesService"
import gradesService from '@/services/gradesService'
import packagingsService from '@/services/packagingsService'
import { generarActaPDF } from "@/others/generarActa"

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
    const packagings = ref([])

    const form = reactive({
      number: "",
      of_number: "",
      of_number_date: null,
      date_reception: null,
      location: { id: 1 }, // ID predeterminado
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
      user_destination: { 
        id: parseInt(localStorage.getItem('user_id')) || 0, 
        email: "" 
      },
      substances: [] // Cambiado de drugs a substances
    })

    const newSubstance = reactive({
      nue: "",
      description: "",
      weight: null,
      substanceType: null,
      packaging: null,
      commune: null
    })

    const fetchDropdownData = async () => {
      try {
        isLoading.value = true
        const [instRes, typeRes, commRes, locRes, subRes, gradesRes, packRes] = await Promise.all([
          institutionsService.getAll(),
          institutionTypesService.getAll(),
          communesService.getAll(),
          locationsService.getAll(),
          substancesTypesService.getAll(),
          gradesService.getAll(),
          packagingsService.getAll()
        ])
        
        institutions.value = instRes.data || []
        institutionTypes.value = typeRes.data || []
        communes.value = commRes.data || []
        locations.value = locRes.data || []
        substancesTypes.value = subRes.data || []
        grades.value = gradesRes.data || []
        packagings.value = packRes.data || []
        
        console.log("✅ Datos cargados:", {
          institutions: institutions.value.length,
          institutionTypes: institutionTypes.value.length,
          communes: communes.value.length,
          locations: locations.value.length,
          substances: substancesTypes.value.length,
          grades: grades.value.length,
          packagings: packagings.value.length
        })
      } catch (err) {
        console.error("❌ Error cargando datos para dropdowns:", err)
      } finally {
        isLoading.value = false
      }
    }

    const getSubstanceName = (substanceId) => {
      const substance = substancesTypes.value.find(s => s.id === substanceId)
      console.log(substance);
      
      return substance ? substance.name : 'Desconocido'
    }

    const getPackagingName = (packagingId) => {
      const packaging = packagings.value.find(p => p.id === packagingId)
      return packaging ? packaging.name : 'Desconocido'
    }

    const getCommuneName = (communeId) => {
      const commune = communes.value.find(c => c.id === communeId)
      return commune ? commune.name : 'Desconocido'
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
      resetForm()
    }

    const resetForm = () => {
      Object.assign(form, {
        number: "",
        of_number: "",
        of_number_date: null,
        date_reception: null,
        location: { id: 1 },
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
        user_destination: { 
          id: parseInt(localStorage.getItem('user_id')) || 0, 
          email: "" 
        },
        substances: []
      })
      
      Object.assign(newSubstance, {
        nue: "",
        description: "",
        weight: null,
        substanceType: null,
        packaging: null,
        commune: null
      })
    }

    const addSubstance = () => {
      if (!newSubstance.substanceType || !newSubstance.weight) return
      
      form.substances.push({ ...newSubstance })
      
      // Limpiar formulario de nueva sustancia
      Object.assign(newSubstance, {
        nue: "",
        description: "",
        weight: null,
        substanceType: null,
        packaging: null,
        commune: null
      })
    }

    const removeSubstance = (index) => {
      form.substances.splice(index, 1)
    }

    const buscarPolicia = async () => {
      if (!form.police.rut || rutError.value) {
        console.warn("⚠️ RUT inválido o vacío")
        return
      }

      try {
        buscandoPolicia.value = true
        console.log("🔍 Buscando policía con RUT:", form.police.rut)
        
        const datos = await policeService.getByRut(form.police.rut)
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
    
    // Actualizar user_origin con datos del policía
   

    // Actualizar grado si existe (con nombre)
    if (data.grade && data.grade.id) {
      form.police.grade = data.grade
     
    }

    // Actualizar institución si existe (con nombre)
    if (data.institutionType && data.institutionType.institution && data.institutionType.institution.id) {
      form.police.institution = data.institutionType.institution
  
    }

    // Actualizar tipo de institución si existe (con nombre y comuna)
    if (data.institutionType && data.institutionType.id) {
      form.police.institutionType = data.institutionType
   
      
      // Actualizar comuna si existe
      if (data.institutionType.commune && data.institutionType.commune.id) {
        form.police.institutionType.commune= data.institutionType.commune
      }
    }

    console.log("✅ Campos actualizados correctamente")
  } else {
          console.warn("⚠️ No se encontró policía con ese RUT")
        }
      } catch (e) {
        console.error("❌ Error al buscar policía:", e)
      } finally {
        buscandoPolicia.value = false
      }
    }

    const guardarRecepcion = async () => {
      try {
        isSaving.value = true

        // 1. Primero crear la recepción
          const receptionPayload = {
          number: form.number,
          of_number: form.of_number,
          of_number_date: form.of_number_date,
          date_reception: form.date_reception,
          location: form.location.id ? { id: form.location.id } : null,
          police: {
            id: form.police.id,
            rut: form.police.rut,
            firstName: form.police.firstName,
            secondName: form.police.secondName,
            firstLastName: form.police.firstLastName,
            secondLastName: form.police.secondLastName,
            email: form.police.email,
            cellphone: form.police.cellphone,
            grade: form.police.grade.id ? form.police.grade : null,
            institution: form.police.institution.id ? form.police.institution : null,
            institutionType: form.police.institutionType.id ? form.police.institutionType : null
          },
          user_origin: { id: 1 },
          user_destination: form.user_destination.id ? { id: form.user_destination.id } : null
        }

        console.log("📤 Enviando recepción:", receptionPayload)
        const receptionResponse = await recepcionService.create(receptionPayload)
        const receptionId = receptionResponse.data.id
        console.log("✅ Recepción creada con ID:", receptionId)

        // 2. Luego crear las sustancias asociadas a esta recepción
       if (form.substances.length > 0) {
      const substancesPromises = form.substances.map(substance => {
        const substancePayload = {
          nue: substance.nue,
          description: substance.description,
          weight: substance.weight,
          reception: receptionResponse.data,
          substanceType: substance.substanceType ? { id: substance.substanceType } : null,
          packaging: substance.packaging ? { id: substance.packaging } : null,
          commune: substance.commune ? { id: substance.commune } : null
        }
        return substancesService.create(substancePayload)
      })

      await Promise.all(substancesPromises)
      console.log("✅ Todas las sustancias creadas correctamente")
        form.substances = form.substances.map(s => ({
        ...s,
        substanceTypeName: getSubstanceName(s.substanceType),
        packagingName: getPackagingName(s.packaging),
        communeName: getCommuneName(s.commune)
      }))
          console.log(form.substances);
          console.log("✅ Todas las sustancias creadas correctamente")
          generarActaPDF(form, receptionResponse)

        }

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
      packagings,
      rutError,
      newSubstance,
      openDialog,
      closeDialog,
      addSubstance,
      removeSubstance,
      buscarPolicia,
      guardarRecepcion,
      getSubstanceName,
      getPackagingName,
      getCommuneName
    }
  }
}
</script>

<style scoped>
.dialog-header {
  padding: 0.5rem 0;
}

.dialog-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

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
  padding: 0.5rem 0;
}

/* Ajustes adicionales para mejor espaciado */
:deep(.p-dialog .p-dialog-header) {
  padding: 1.5rem 1.5rem 0.5rem !important;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 0 1.5rem 1rem !important;
}

:deep(.p-dialog .p-dialog-footer) {
  padding: 1rem 1.5rem !important;
}

/* Mejor espaciado en los campos del formulario */
:deep(.p-field) {
  margin-bottom: 1.25rem;
}

/* Espaciado en la tabla */
:deep(.p-datatable) {
  margin-top: 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th),
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}
</style>