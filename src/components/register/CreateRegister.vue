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
                <InputText v-model="form.police.rut" placeholder="Ej: 12.345.678-9" />
                <Button icon="pi pi-search" @click="buscarPolicia" />
              </div>
            </div>

            <div class="field col-12 md:col-3">
              <label>Nombre</label>
              <InputText v-model="form.police.firstName" />
            </div>

            <div class="field col-12 md:col-3">
              <label>Segundo Nombre</label>
              <InputText v-model="form.police.secondName" />
            </div>

            <div class="field col-12 md:col-3">
              <label>Apellido Paterno</label>
              <InputText v-model="form.police.firstLastName" />
            </div>

            <div class="field col-12 md:col-3">
              <label>Apellido Materno</label>
              <InputText v-model="form.police.secondLastName" />
            </div>

            <div class="field col-12 md:col-3">
              <label>Correo</label>
              <InputText v-model="form.police.email" type="email" />
            </div>

            <div class="field col-12 md:col-3">
              <label>Teléfono</label>
              <InputText v-model="form.police.cellphone" />
            </div>

            <div class="field col-12 md:col-3">
              <label>Grado</label>
              <InputText v-model="form.police.grade.name" />
            </div>

            <div class="field col-12">
              <label>Institución</label>
              <InputText v-model="form.police.institution.name" />
            </div>

            <div class="field col-12 md:col-6">
              <label>Tipo de Institución</label>
              <InputText v-model="form.police.institution.institutionType.name" />
            </div>

            <div class="field col-12 md:col-6">
              <label>Comuna</label>
              <InputText v-model="form.police.institution.commune.name" />
            </div>
          </div>

          <!-- Ubicación -->
          <div class="section-title">📍 Ubicación</div>
          <div class="grid formgrid p-fluid">
            <div class="field col-12">
              <label>Nombre de la ubicación</label>
              <InputText v-model="form.location.name" />
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
          <div class="grid formgrid p-fluid align-items-end">
            <div class="field col-12 md:col-3">
              <label>Tipo de Droga</label>
              <Dropdown 
                v-model="newDrug.type" 
                :options="drugTypes"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccione una droga"
              />
            </div>

            <div class="field col-12 md:col-2">
              <label>Cantidad</label>
              <InputNumber v-model="newDrug.amount" :min="0" />
            </div>

            <div class="field col-12 md:col-2">
              <label>Unidad</label>
              <InputText v-model="newDrug.unit" placeholder="Ej: gr, kg, ml" />
            </div>

            <div class="field col-12 md:col-4">
              <label>Observaciones</label>
              <InputText v-model="newDrug.observations" />
            </div>

            <div class="field col-12 md:col-1 text-center">
              <Button 
                icon="pi pi-plus" 
                label="Agregar" 
                @click="addDrug"
                :disabled="!newDrug.type"
              />
            </div>
          </div>

          <DataTable :value="form.drugs" responsiveLayout="scroll" class="mt-3">
            <Column field="type" header="Tipo de Droga"></Column>
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
import { ref, reactive } from "vue"
import Calendar from "primevue/calendar"
import InputText from "primevue/inputtext"
import Button from "primevue/button"
import Dialog from "primevue/dialog"
import Dropdown from "primevue/dropdown"
import InputNumber from "primevue/inputnumber"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import recepcionService from "@/services/reception"
import policeService from "@/services/userServices"

export default {
  name: "RecepcionComponent",
  components: {
     Calendar, InputText, Button, Dialog,
    Dropdown, InputNumber, DataTable, Column
  },

  setup() {
    const visible = ref(false)
    const isLoading = ref(false)
    const isSaving = ref(false)

    const form = reactive({
      number: "",
      of_number: "",
      of_number_date: null,
      date_reception: null,
      location: { id: 0, name: "" },
      police: {
        id: 0,
        rut: "",
        firstName: "",
        secondName: "",
        firstLastName: "",
        secondLastName: "",
        email: "",
        cellphone: "",
        grade: { id: 0, name: "" },
        institution: {
          id: 0,
          name: "",
          institutionType: { id: 0, name: "" },
          commune: { id: 0, name: "" }
        }
      },
      user_origin: { id: 0, email: "" },
      user_destination: { id: 0, email: "" },
      drugs: [] // ✅ array de drogas
    })

    const drugTypes = ref([
      { label: "Marihuana", value: "Marihuana" },
      { label: "Cocaína", value: "Cocaína" },
      { label: "Heroína", value: "Heroína" },
      { label: "Éxtasis", value: "Éxtasis" },
      { label: "Otro", value: "Otro" }
    ])

    const newDrug = reactive({
      type: null,
      amount: null,
      unit: "",
      observations: ""
    })

    const openDialog = () => { visible.value = true }
    const closeDialog = () => { visible.value = false }

    const addDrug = () => {
      if (!newDrug.type) return
      form.drugs.push({ ...newDrug })
      newDrug.type = null
      newDrug.amount = null
      newDrug.unit = ""
      newDrug.observations = ""
    }

    const removeDrug = (index) => {
      form.drugs.splice(index, 1)
    }

    const buscarPolicia = async () => {
      try {
        isLoading.value = true
        const { data } = await policeService.getByRut(form.police.rut)
        if (data) form.police = { ...form.police, ...data }
      } catch (e) {
        console.error("❌ Error al buscar policía:", e)
      } finally {
        isLoading.value = false
      }
    }

    const guardarRecepcion = async () => {
      try {
        isSaving.value = true
        const payload = { ...form }
        const { data } = await recepcionService.create(payload)
        console.log("✅ Enviado:", data)
        closeDialog()
      } catch (e) {
        console.error("❌ Error al guardar recepción:", e)
      } finally {
        isSaving.value = false
      }
    }

    return {
      visible,
      isLoading,
      isSaving,
      form,
      drugTypes,
      newDrug,
      openDialog,
      closeDialog,
      addDrug,
      removeDrug,
      buscarPolicia,
      guardarRecepcion
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
</style>
