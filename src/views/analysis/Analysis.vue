<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="preanalysis-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-0">
            <h1>Gestión de Análisis</h1>
            <div class="flex gap-2">
              <!-- Botón para generar informe consolidado (destino = 1) -->
              <Button
                v-if="selectedAnalysis.length > 0 && hasOnlyInteriorDestination"
                icon="pi pi-file-pdf"
                label="Generar Informe Consolidado"
                class="p-button-success"
                @click="generateConsolidatedReport"
                v-tooltip.top="
                  `Generar informe con ${selectedAnalysis.length} análisis seleccionado(s)`
                "
              />

              <!-- Botón para generar reservados (destino ≠ 1) -->
              <Button
                v-if="selectedAnalysis.length > 0 && hasOnlyExteriorDestination"
                icon="pi pi-file"
                label="Generar Reservados"
                class="p-button-info"
                @click="generateReserveds"
                v-tooltip.top="
                  `Generar reservados con ${selectedAnalysis.length} análisis seleccionado(s)`
                "
              />
            </div>
          </div>
          <TabView>
            <TabPanel header="Análisis">
              <div class="table-container">
                <DataTable
                  v-model:filters="filters"
                  v-model:selection="selectedAnalysis"
                  :value="analysisList"
                  paginator
                  size="small"
                  :rows="10"
                  :rowsPerPageOptions="[5, 10, 20, 50]"
                  scrollable
                  class="p-datatable-striped p-datatable-gridlines users-table"
                  :loading="loadingAnalysis"
                  dataKey="id"
                  :globalFilterFields="[
                    'id',
                    'preAnalysis.reception.number',
                    'preAnalysis.substance.substanceType.name',
                    'result',
                    'observation',
                    'user.firstName',
                    'user.lastName',
                  ]"
                >
                  <template #header>
                    <div class="flex justify-content-end">
                      <IconField iconPosition="left">
                        <InputIcon>
                          <i class="pi pi-search" />
                        </InputIcon>
                        <InputText
                          v-model="filters['global'].value"
                          placeholder="Buscar en todos los campos..."
                        />
                      </IconField>
                    </div>
                  </template>

                  <template #empty> No se encontraron análisis. </template>
                  <template #loading> Cargando análisis. Por favor espere. </template>
                  <Column headerStyle="width: 3rem; text-align:center;">
                    <template #body="slotProps">
                      <Checkbox
                        :binary="true"
                        :disabled="
                          !canSelectAnalysis(slotProps.data) || !canSelectRow(slotProps.data)
                        "
                        :modelValue="isAnalysisSelected(slotProps.data)"
                        @change="toggleAnalysisSelection(slotProps.data)"
                      />
                    </template>
                  </Column>
                  <Column field="id" header="ID" />
                  <Column field="preAnalysis.reception" header="N° Acta">
                    <template #body="slotProps">
                      #{{ slotProps.data.preAnalysis?.reception?.number || '—' }}
                    </template>
                  </Column>
                  <Column field="preAnalysis.substance" header="Sustancia">
                    <template #body="slotProps">
                      {{ getSubstanceName(slotProps.data.preAnalysis?.substance) }}
                    </template>
                  </Column>
                  <Column field="result" header="Resultado">
                    <template #body="slotProps">
                      <Tag
                        :value="getAnalysisResult(slotProps.data)"
                        :severity="getResultSeverity(getAnalysisResult(slotProps.data))"
                      />
                    </template>
                  </Column>
                  <Column field="user" header="Analista">
                    <template #body="slotProps">
                      {{
                        (slotProps.data.user?.firstName || '') +
                        ' ' +
                        (slotProps.data.user?.lastName || '')
                      }}
                    </template>
                  </Column>
                  <Column field="state" header="Estado">
                    <template #body="slotProps">
                      {{ slotProps.data.state }}
                    </template>
                  </Column>
                  <Column field="createdAt" header="Fecha">
                    <template #body="slotProps">
                      {{ formatDate(slotProps.data.createdAt) }}
                    </template>
                  </Column>
                  <Column header="Acciones">
                    <template #body="slotProps">
                      <div class="flex align-items-center gap-2">
                        <!-- Si el estado es RESERVADO, mostrar botones "Imprimir Reservado ISP" y "Imprimir Reservado Fiscalía" -->
                        <Button
                          v-if="slotProps.data.state === 'RESERVADO'"
                          icon="pi pi-print"
                          class="p-button-rounded p-button-info p-button-outlined"
                          @click="printReserved(slotProps.data)"
                          v-tooltip.top="'Imprimir Reservado ISP'"
                        />
                        <Button
                          v-if="slotProps.data.state === 'RESERVADO'"
                          icon="pi pi-file-pdf"
                          class="p-button-rounded p-button-success p-button-outlined"
                          @click="printReservedFiscalia(slotProps.data)"
                          v-tooltip.top="'Imprimir Reservado Fiscalía'"
                        />

                        <!-- Si el destino ES 1 (Interior), mostrar los botones de análisis -->
                        <template v-else-if="slotProps.data.preAnalysis?.destination?.id === 1">
                          <!-- Macroanalisis: solo aparece en estado PENDIENTE -->
                          <CompleteAnalysis
                            v-if="slotProps.data.state === 'PENDIENTE'"
                            :analysis="slotProps.data"
                            @processed="fetchAnalyses"
                          />

                          <!-- Microanalisis: aparece en estado MACRO_COMPLETADO -->
                          <Button
                            v-if="slotProps.data.state === 'MACRO_COMPLETADO'"
                            icon="pi pi-search"
                            class="p-button-rounded p-button-info p-button-outlined"
                            @click="openMicroanalysisDialog(slotProps.data)"
                            v-tooltip.top="'Microanálisis'"
                          />

                          <!-- Imprimir Microanálisis: aparece si hay datos de micro -->
                          <Button
                            v-if="slotProps.data.micro"
                            icon="pi pi-file-pdf"
                            class="p-button-rounded p-button-secondary p-button-outlined"
                            @click="printMicroanalysis(slotProps.data)"
                            v-tooltip.top="'Imprimir Microanálisis'"
                          />

                          <!-- Examen Quimico: aparece en estado MICRO_COMPLETADO -->
                          <Button
                            v-if="slotProps.data.state === 'MICRO_COMPLETADO'"
                            icon="pi pi-file-edit"
                            class="p-button-rounded p-button-warning p-button-outlined"
                            @click="openChemicalTestDialog(slotProps.data)"
                            v-tooltip.top="'Examen Químico'"
                          />

                          <!-- Generar Reporte: aparece en estado COMPLETADO y COMPLETADO_RESERVADO -->
                          <Button
                            v-if="
                              slotProps.data.state === 'COMPLETADO' ||
                              slotProps.data.state === 'COMPLETADO_RESERVADO'
                            "
                            icon="pi pi-file-pdf"
                            class="p-button-rounded p-button-success p-button-outlined"
                            @click="generateAnalysisReport(slotProps.data)"
                            v-tooltip.top="'Generar Reporte'"
                          />

                          <!-- Imprimir Informe Consolidado: aparece en estado COMPLETADO_RESERVADO -->
                          <Button
                            v-if="slotProps.data.state === 'COMPLETADO_RESERVADO'"
                            icon="pi pi-print"
                            class="p-button-rounded p-button-info p-button-outlined"
                            @click="printConsolidatedReport(slotProps.data)"
                            v-tooltip.top="'Imprimir Informe Consolidado'"
                          />
                        </template>
                      </div>
                    </template>
                  </Column>
                </DataTable>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </template>
  </PlantillaContenido>

  <!-- DIÁLOGO PARA ENVIAR A PRE-ANÁLISIS INDIVIDUAL -->
  <PreAnalysisDialog
    v-model:visible="showPreAnalysisDialog"
    :selected-substance="selectedSubstance"
    :destinations="destinations"
    :methods-destruction="methodsDestruction"
    :loading-destinations="loadingDestinations"
    :loading-methods-destruction="loadingMethodsDestruction"
    :loading="isSendingToPreAnalysis"
    @submit="sendToPreAnalysis"
    @cancel="handlePreAnalysisCancel"
  />

  <BulkPreAnalysisDialog
    v-model:visible="showBulkPreAnalysisDialog"
    :selected-substances="selectedSubstances"
    :destinations="destinations"
    :methods-destruction="methodsDestruction"
    :loading="isSendingBulkToPreAnalysis"
    @submit="sendBulkToPreAnalysis"
    @cancel="handleBulkPreAnalysisCancel"
  />

  <MicroanalysisDialog
    v-model:visible="showMicroanalysisDialog"
    :analysis="selectedAnalysisForMicroanalysis"
    @saved="fetchAnalyses"
  />

  <ChemicalTestDialog
    v-model:visible="showChemicalTestDialog"
    :analysis="selectedAnalysisForChemicalTest"
    @saved="fetchAnalyses"
  />

  <!-- DIÁLOGO PARA NÚMERO RESERVADO -->
  <Dialog
    v-model:visible="showReservedNumberDialog"
    modal
    header="Ingrese Número Reservado"
    :style="{ width: '400px' }"
    :modal="true"
  >
    <div class="flex flex-column gap-4">
      <div class="field">
        <label for="reserved">Número Reservado</label>
        <InputNumber
          id="reserved"
          v-model="reservedNumber"
          :useGrouping="false"
          placeholder="Ingrese el número reservado"
          autofocus
        />
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancelar"
        severity="secondary"
        @click="showReservedNumberDialog = false"
        :disabled="isGeneratingReport"
      />
      <Button
        label="Generar Informe"
        severity="success"
        @click="confirmGenerateReport"
        :loading="isGeneratingReport"
        :disabled="isGeneratingReport"
      />
    </template>
  </Dialog>

  <!-- DIÁLOGO PARA NÚMEROS DE RESERVADOS (Fiscalía Local e ISP) -->
  <Dialog
    v-model:visible="showReservedsDialog"
    modal
    header="Ingrese Números de Reservados"
    :style="{ width: '450px' }"
    :modal="true"
  >
    <div class="flex flex-column gap-4">
      <div class="field">
        <label for="fiscaliaLocal">Número Reservado - Fiscalía Local *</label>
        <InputNumber
          id="fiscaliaLocal"
          v-model="reservedsData.fiscaliaLocal"
          :useGrouping="false"
          placeholder="Ingrese número de Fiscalía Local"
          autofocus
        />
      </div>

      <div class="field">
        <label for="isp">Número Reservado - Instituto de Salud Pública *</label>
        <InputNumber
          id="isp"
          v-model="reservedsData.isp"
          :useGrouping="false"
          placeholder="Ingrese número de ISP"
        />
      </div>
    </div>

    <template #footer>
      <Button
        label="Cancelar"
        severity="secondary"
        @click="showReservedsDialog = false"
        :disabled="isGeneratingReserveds"
      />
      <Button
        label="Generar Reservados"
        severity="info"
        @click="confirmGenerateReserveds"
        :loading="isGeneratingReserveds"
        :disabled="isGeneratingReserveds"
      />
    </template>
  </Dialog>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from 'primevue/api'
import PlantillaContenido from '../template/PlantillaContenido.vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Chip from 'primevue/chip'
import Checkbox from 'primevue/checkbox'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'

import preAnalysisService from '@/services/preAnalysisService.js'
import analysisService from '@/services/analysisService.js'
import reservedsService from '@/services/reservedsService.js'
import { generarActaPDF } from '@/others/generarActaBtn.js'
import { generarReporteAnalisisPDF } from '@/others/generarReporteAnalisis.js'
import { generarInformeConsolidadoPDF } from '@/others/generarInformeConsolidado.js'
import { generarReservadoPDF, generarReservadoFiscaliaPDF } from '@/others/generarReservadoPDF.js'
import { generarReporteMicroanalisisPDF } from '@/others/generarReporteMicroanalisis.js'
import recepcionService from '@/services/receptionsService.js'
import substancesService from '@/services/substancesService.js'
import EditReceptionUnlock from '@/components/receptions/EditReceptionUnlock.vue'
import destinationsService from '@/services/destinationsService.js'
import methodsDestructionsService from '@/services/methodsDestructionsService.js'
import storagesService from '@/services/storagesService.js'
import destructionsHeaderService from '@/services/destructionsHeaderService.js'
import destructionDetailsService from '@/services/destructionDetailsService.js'

import PreAnalysisDialog from '@/components/preanalysis/PreAnalysisDialog.vue'
import BulkPreAnalysisDialog from '@/components/preanalysis/BulkPreAnalysisDialog.vue'
import CompleteAnalysis from '@/components/analysis/CompleteAnalysis.vue'
import MicroanalysisDialog from '@/components/analysis/MicroanalysisDialog.vue'
import ChemicalTestDialog from '@/components/analysis/ChemicalTestDialog.vue'
export default {
  name: 'PreAnalysisView',
  components: {
    PlantillaContenido,
    Card,
    DataTable,
    Column,
    Button,
    InputText,
    IconField,
    InputIcon,
    Dialog,
    Dropdown,
    InputNumber,
    Textarea,
    Chip,
    Checkbox,
    TabView,
    TabPanel,
    Tag,
    EditReceptionUnlock,
    PreAnalysisDialog,
    BulkPreAnalysisDialog,
    CompleteAnalysis,
    MicroanalysisDialog,
    ChemicalTestDialog,
  },

  setup() {
    const loading = ref(false)
    const toast = useToast()
    const receptions = ref([])
    const preAnalysisList = ref([])
    const expandedRows = ref({})
    const loadingSubstances = ref(null)
    const acceptingReceptionId = ref(null)
    const sendingSubstanceId = ref(null)
    const isSendingToPreAnalysis = ref(false)
    const selectedPreAnalysis = ref([])
    const loadingPreAnalysis = ref(false)
    const analysisList = ref([])
    const loadingAnalysis = ref(false)
    const selectedAnalysis = ref([])
    const selectedAnalysisActNumber = ref(null)

    // Dialog de microanálisis
    const showMicroanalysisDialog = ref(false)
    const selectedAnalysisForMicroanalysis = ref(null)

    // Dialog de examen químico
    const showChemicalTestDialog = ref(false)
    const selectedAnalysisForChemicalTest = ref(null)

    // Dialog para número reservado
    const showReservedNumberDialog = ref(false)
    const reservedNumber = ref(null)
    const isGeneratingReport = ref(false)

    // Dialog para números de reservados (Fiscalía Local e ISP)
    const showReservedsDialog = ref(false)
    const reservedsData = ref({
      fiscaliaLocal: null,
      isp: null,
    })
    const isGeneratingReserveds = ref(false)

    // Diálogo de pre-análisis individual
    const showPreAnalysisDialog = ref(false)
    const selectedSubstance = ref(null)
    const selectedReception = ref(null)

    // Variables para el procesamiento masivo
    const selectedSubstances = ref([])
    const selectedReceptionForBulk = ref(null)
    const showBulkPreAnalysisDialog = ref(false)
    const isSendingBulkToPreAnalysis = ref(false)
    const destinations = ref([])
    const methodsDestruction = ref([])
    const loadingDestinations = ref(false)
    const loadingMethodsDestruction = ref(false)
    const bulkPreAnalysisData = ref([])

    const filtersReception = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    // Helpers para selección restringida por Nº de acta
    const getActNumber = (row) => {
      return row?.preAnalysis?.reception?.number ?? row?.reception?.number ?? null
    }

    const isAnalysisSelected = (row) => {
      return selectedAnalysis.value.some((r) => r.id === row.id)
    }

    const canSelectAnalysis = (row) => {
      // No permitir seleccionar si el estado es COMPLETADO_RESERVADO
      if (row.state === 'COMPLETADO_RESERVADO') {
        return false
      }

      // Permitir seleccionar si el destino NO es 1 (Exterior/ISP)
      if (row.preAnalysis?.destination?.id !== 1) {
        return true
      }

      // Para destino 1 (Interior), aplicar la lógica original
      const current = selectedAnalysisActNumber.value
      const rowAct = getActNumber(row)
      const isCompleted = (row.state || '').toUpperCase() === 'COMPLETADO'

      if (!isCompleted) return false
      if (current == null) return true
      return rowAct === current
    }

    const canSelectRow = (row) => {
      // No permitir seleccionar si el estado es RESERVADO
      if (row.state === 'RESERVADO') {
        return false
      }

      // Si no hay nada seleccionado, permitir
      if (selectedAnalysis.value.length === 0) {
        return true
      }

      // Obtener el acta del primer elemento seleccionado
      const firstSelectedRow = selectedAnalysis.value[0]
      const firstSelectedAct = getActNumber(firstSelectedRow)
      const currentRowAct = getActNumber(row)

      // No permitir si el acta es diferente
      if (firstSelectedAct !== currentRowAct) {
        return false
      }

      return true
    }

    const hasOnlyInteriorDestination = computed(() => {
      if (selectedAnalysis.value.length === 0) return false
      return selectedAnalysis.value.every((analysis) => analysis.preAnalysis?.destination?.id === 1)
    })

    const hasOnlyExteriorDestination = computed(() => {
      if (selectedAnalysis.value.length === 0) return false
      return selectedAnalysis.value.every((analysis) => analysis.preAnalysis?.destination?.id !== 1)
    })

    const toggleAnalysisSelection = (row) => {
      // Validar si se puede seleccionar esta fila según el acta
      if (selectedAnalysis.value.length > 0 && !canSelectRow(row)) {
        const firstSelectedRow = selectedAnalysis.value[0]
        const firstAct = getActNumber(firstSelectedRow)
        const currentAct = getActNumber(row)

        toast.add({
          severity: 'warn',
          summary: 'Selección no permitida',
          detail: `No puede mezclar actas distintas. Ya tiene seleccionada acta Nº ${firstAct}`,
          life: 3000,
        })
        return
      }

      if (!canSelectAnalysis(row)) {
        const isCompleted = (row.state || '').toUpperCase() === 'COMPLETADO'
        if (!isCompleted) {
          toast.add({
            severity: 'warn',
            summary: 'Selección no permitida',
            detail: 'Solo puede seleccionar análisis con estado COMPLETADO',
            life: 2000,
          })
          return
        }

        const act = selectedAnalysisActNumber.value
        toast.add({
          severity: 'warn',
          summary: 'Selección limitada',
          detail: `Solo puede seleccionar análisis del Nº de acta ${act}`,
          life: 2000,
        })
        return
      }

      const idx = selectedAnalysis.value.findIndex((r) => r.id === row.id)
      if (idx >= 0) {
        selectedAnalysis.value.splice(idx, 1)
      } else {
        selectedAnalysis.value.push(row)
      }

      // Solo actualizar el acta number si no es un análisis de ISP
      if (row.preAnalysis?.destination?.id === 1) {
        if (selectedAnalysis.value.length === 0) {
          selectedAnalysisActNumber.value = null
        } else if (selectedAnalysis.value.length === 1) {
          selectedAnalysisActNumber.value = getActNumber(selectedAnalysis.value[0])
        }
      }
    }

    const filters = ref({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    })

    // Computed para validar el formulario individual
    const isPreAnalysisFormValid = computed(() => {
      return (
        preAnalysisData.value.destination &&
        preAnalysisData.value.weight_sampled &&
        preAnalysisData.value.weight_sampled > 0 &&
        preAnalysisData.value.weight_sampled <= (selectedSubstance.value?.weight || 0)
      )
    })

    // Computed para mostrar/ocultar pesos individuales
    const showIndividualWeights = computed(() => {
      return !bulkPreAnalysisData.value.useAutoWeight
    })
    const isRowSelectable = (data) => {
      console.log(data.state)
      console.log(data.reception.state)
      if (data.state != 'DERIVADO' && data.reception.state === 'ACEPTADO') {
        return ''
      } else {
        return 'p-disabled'
      }
    }
    // Computed para validar el formulario masivo
    const isBulkPreAnalysisFormValid = computed(() => {
      if (!bulkPreAnalysisData.value.destination) return false

      if (bulkPreAnalysisData.value.useAutoWeight) {
        if (
          !bulkPreAnalysisData.value.autoWeightValue ||
          bulkPreAnalysisData.value.autoWeightValue <= 0
        )
          return false
        return selectedSubstances.value.every((substance) => {
          const contr = bulkPreAnalysisData.value.individualWeights[substance.id]?.contra || 0
          return (
            Number(bulkPreAnalysisData.value.autoWeightValue) + Number(contr) <=
            Number(substance.weight || 0)
          )
        })
      } else {
        // Validar que todas las sustancias tengan peso de muestra asignado y que muestra+contra <= peso total
        return selectedSubstances.value.every((substance) => {
          const obj = bulkPreAnalysisData.value.individualWeights[substance.id] || {}
          const sample = Number(obj.sample) || 0
          const contra = Number(obj.contra) || 0
          return sample > 0 && sample + contra <= Number(substance.weight || 0)
        })
      }
    })

    const fetchReceptions = async () => {
      try {
        loading.value = true
        const { data } = await recepcionService.getAllPaginatedByState('', 0, 10, 'asc')
        receptions.value = data.content || data || []

        // Verificar pre-análisis existentes para cada sustancia
        await checkExistingPreAnalysis()
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las recepciones',
        })
      } finally {
        loading.value = false
      }
    }
    const fetchDropdownData = async () => {
      try {
        loadingDestinations.value = true
        loadingMethodsDestruction.value = true

        const [destinationsResponse, methodsResponse] = await Promise.all([
          destinationsService.getAll(),
          methodsDestructionsService.getAll(),
        ])

        destinations.value = destinationsResponse.data?.content || destinationsResponse.data || []
        methodsDestruction.value = methodsResponse.data?.content || methodsResponse.data || []
      } catch (error) {
        console.error('❌ Error cargando datos de dropdowns:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los destinos o métodos de destrucción',
          life: 3000,
        })
      } finally {
        loadingDestinations.value = false
        loadingMethodsDestruction.value = false
      }
    }

    // Verificar pre-análisis existentes
    const checkExistingPreAnalysis = async () => {
      try {
        const { data: preAnalysisData } = await preAnalysisService.getAll()
        const preAnalysisMap = new Map()

        preAnalysisData.content?.forEach((pa) => {
          if (pa.substance?.id) {
            preAnalysisMap.set(pa.substance.id, true)
          }
        })

        // Marcar sustancias que ya tienen pre-análisis
        receptions.value.forEach((reception) => {
          if (reception.substances) {
            reception.substances.forEach((substance) => {
              substance.hasPreAnalysis = preAnalysisMap.has(substance.id)
            })
          }
        })
      } catch (error) {
        console.error('Error verificando pre-análisis:', error)
      }
    }

    const handleReceptionUpdated = async (eventData) => {
      try {
        console.log('🔄 Actualizando tabla después de edición:', eventData)
        toast.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: eventData.message || 'Recepción actualizada correctamente',
          life: 3000,
        })
        await fetchReceptions()
      } catch (error) {
        console.error('❌ Error al actualizar tabla:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la tabla',
          life: 3000,
        })
      }
    }

    // ACEPTAR RECEPCIÓN
    const acceptReception = async (reception) => {
      try {
        acceptingReceptionId.value = reception.id

        const payload = {
          ...reception,
          state: 'ACEPTADO',
          is_editable: 'NO',
        }

        await recepcionService.update(reception.id, payload)

        toast.add({
          severity: 'success',
          summary: 'Recepción Aceptada',
          detail: `La recepción #${reception.number} ha sido aceptada correctamente`,
          life: 3000,
        })

        await fetchReceptions()
      } catch (error) {
        console.error('❌ Error aceptando recepción:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo aceptar la recepción',
          life: 3000,
        })
      } finally {
        acceptingReceptionId.value = null
      }
    }

    // MÉTODOS PARA PRE-ANÁLISIS INDIVIDUAL
    const openSendToPreAnalysis = (substance, reception) => {
      selectedSubstance.value = substance
      selectedReception.value = reception
      showPreAnalysisDialog.value = true
    }

    const sendToPreAnalysis = async (formData) => {
      try {
        isSendingToPreAnalysis.value = true

        const payload = {
          substance: selectedSubstance.value,
          reception: { id: selectedReception.value.id },
          destination: formData.destination,
          weight_sampled: formData.weight_sampled,
          methodDestruction: formData.methodDestruction,
          observation: formData.observation,
          user: { id: parseInt(localStorage.getItem('user_id')) || 1 },
        }

        // Crear pre-análisis y actualizar sustancia en paralelo
        await Promise.all([
          preAnalysisService.create(payload),
          substancesService.update(selectedSubstance.value.id, {
            ...selectedSubstance.value,
            state: 'DERIVADO',
          }),
        ])

        toast.add({
          severity: 'success',
          summary: 'Enviado a Pre-Análisis',
          detail: `La sustancia ${selectedSubstance.value.nue} ha sido enviada a pre-análisis`,
          life: 3000,
        })

        showPreAnalysisDialog.value = false
        await fetchReceptions()
        await fetchPreAnalysis()
      } catch (error) {
        console.error('❌ Error enviando a pre-análisis:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo enviar a pre-análisis',
          life: 3000,
        })
      } finally {
        isSendingToPreAnalysis.value = false
      }
    }
    // MÉTODOS PARA PROCESAMIENTO MASIVO
    const getSelectedCountForReception = (reception) => {
      if (!reception.substances) return 0
      return selectedSubstances.value.filter((substance) =>
        reception.substances.some((s) => s.id === substance.id),
      ).length
    }

    const openBulkPreAnalysisDialogForReception = (reception) => {
      selectedReceptionForBulk.value = reception
      openBulkPreAnalysisDialog()
    }

    const openBulkPreAnalysisDialog = () => {
      if (selectedSubstances.value.length === 0) {
        toast.add({
          severity: 'warn',
          summary: 'Sin selección',
          detail: 'Por favor seleccione al menos una sustancia',
          life: 3000,
        })
        return
      }

      // Inicializar datos del formulario
      bulkPreAnalysisData.value = {
        destination: null,
        methodDestruction: null,
        observation: '',
        useAutoWeight: false,
        autoWeightValue: null,
        individualWeights: {},
      }

      // Inicializar pesos individuales (sample y contra)
      selectedSubstances.value.forEach((substance) => {
        bulkPreAnalysisData.value.individualWeights[substance.id] = { sample: null, contra: null }
      })

      showBulkPreAnalysisDialog.value = true
    }

    const closeBulkDialog = () => {
      showBulkPreAnalysisDialog.value = false
      selectedReceptionForBulk.value = null
    }

    const sendBulkToPreAnalysis = async (formData) => {
      try {
        isSendingBulkToPreAnalysis.value = true

        let successCount = 0
        let errorCount = 0
        const newlyCreatedAnalyses = []

        // 1️⃣ CREAR UN SOLO DESTRUCTION HEADER PARA TODAS LAS SUSTANCIAS
        let destructionHeader = null
        try {
          const totalWeight = selectedSubstances.value.reduce((sum, substance) => {
            const indiv = formData.individualWeights[substance.id] || { sample: null, contra: null }
            const contraWeight = Number(indiv.contra) || 0
            return sum + contraWeight
          }, 0)

          const headerPayload = {
            act_number: selectedReceptionForBulk.value?.number || `BULK-${Date.now()}`,
            date_destruction: new Date().toISOString().split('T')[0],
            observation: formData.observation || 'Procesamiento masivo',
            state: 'COMPLETADO',
            weight: totalWeight,
            methodDestruction: formData.methodDestruction,
            user: { id: parseInt(localStorage.getItem('user_id')) || 1 },
          }

          const { data: createdHeader } = await destructionsHeaderService.create(headerPayload)
          destructionHeader = createdHeader
          console.log('✅ Destruction Header creado:', destructionHeader)
        } catch (headerErr) {
          console.error('❌ Error creando destruction header:', headerErr)
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el registro de destrucción',
            life: 3000,
          })
          return
        }

        // 2️⃣ PROCESAR CADA SUSTANCIA INDIVIDUALMENTE
        for (const substance of selectedSubstances.value) {
          try {
            const indiv = formData.individualWeights[substance.id] || { sample: null, contra: null }
            const sampleWeight = formData.useAutoWeight ? formData.autoWeightValue : indiv.sample
            const contraWeight = Number(indiv.contra) || 0
            const restante =
              Number(substance.weight || 0) - Number(sampleWeight || 0) - contraWeight

            if (!sampleWeight || sampleWeight <= 0) throw new Error('Peso de muestra inválido')
            if (sampleWeight + contraWeight > Number(substance.weight || 0))
              throw new Error('La suma de muestra y contramuestra excede el peso total')

            // Crear pre-análisis
            const payload = {
              substance: substance,
              reception: selectedReceptionForBulk.value,
              destination: formData.destination,
              weight_sampled: sampleWeight,
              methodDestruction: formData.methodDestruction,
              observation: formData.observation,
              user: { id: parseInt(localStorage.getItem('user_id')) || 1 },
            }

            const { data: createdPre } = await preAnalysisService.create(payload)

            // Crear análisis asociado al pre-análisis y agregarlo a una lista local
            try {
              const analysisPayload = {
                number_protocol: null,
                description: formData.observation || '',
                date_analysis: new Date().toISOString(),
                result: null,
                macro: null,
                micro: null,
                state: 'PENDIENTE',
                user: { id: parseInt(localStorage.getItem('user_id')) || 1 },
                template: { id: 1 },
                preAnalysis: createdPre,
              }
              const { data: createdAnalysis } = await analysisService.create(analysisPayload)
              if (createdAnalysis) newlyCreatedAnalyses.push(createdAnalysis)
            } catch (analysisErr) {
              console.warn('No se pudo crear el análisis automáticamente (bulk):', analysisErr)
            }

            // 3️⃣ Si hay contramuestra, crear registro de almacenamiento Y destruction detail
            if (contraWeight > 0) {
              try {
                const { data: createdStorage } = await storagesService.create({
                  entry_date: new Date().toISOString().split('T')[0],
                  sample_quantity: 0,
                  counter_sample_quantity: contraWeight,
                  description: formData.observation || '',
                  substance: substance,
                  storageLocation: { id: 1 },
                })

                // 4️⃣ CREAR DESTRUCTION DETAIL usando el mismo header
                const detailPayload = {
                  state: 'COMPLETADO',
                  weight: contraWeight,
                  destructionHeader: destructionHeader,
                  substance: substance,
                  storage: createdStorage,
                }
                await destructionDetailsService.create(detailPayload)
                console.log(`✅ Destruction Detail creado para sustancia ${substance.nue}`)
              } catch (storErr) {
                console.warn('No se pudo crear registro de almacenamiento/detalle:', storErr)
              }
            }

            // Actualizar estado de la sustancia
            const payloadSubstance = {
              ...substance,
              state: 'DERIVADO',
            }
            await substancesService.update(substance.id, payloadSubstance)

            successCount++
          } catch (error) {
            console.error(`❌ Error procesando sustancia ${substance.nue}:`, error)
            errorCount++
          }
        }

        if (errorCount === 0) {
          toast.add({
            severity: 'success',
            summary: 'Procesamiento Masivo Exitoso',
            detail: `${successCount} sustancias procesadas correctamente`,
            life: 4000,
          })
        } else {
          toast.add({
            severity: successCount > 0 ? 'warn' : 'error',
            summary: 'Procesamiento Parcial',
            detail: `${successCount} procesadas, ${errorCount} con errores`,
            life: 5000,
          })
        }
        // Inserción inmediata (optimista) al principio de la lista actual
        if (newlyCreatedAnalyses.length > 0) {
          analysisList.value = [...newlyCreatedAnalyses.reverse(), ...analysisList.value]
        }
        console.log('sakldjalkjdsalkjdalks')

        // Pequeño delay para asegurar persistencia en backend antes del refetch completo
        await new Promise((r) => setTimeout(r, 200))

        closeBulkDialog()
        selectedSubstances.value = []
      } catch (error) {
        console.error('❌ Error en procesamiento masivo:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error general en el procesamiento masivo',
          life: 4000,
        })
      } finally {
        isSendingBulkToPreAnalysis.value = false
      }
    }

    const handlePreAnalysisCancel = () => {
      console.log('Diálogo individual cancelado')
    }

    const handleBulkPreAnalysisCancel = () => {
      console.log('Diálogo masivo cancelado')
    }
    // VER PRE-ANÁLISIS DE UNA SUSTANCIA
    const viewPreAnalysisForSubstance = async (substance) => {
      try {
        // Buscar el pre-análisis correspondiente a esta sustancia
        const { data } = await preAnalysisService.getBySubstanceId(substance.id)
        const preAnalysis = data.content?.[0] || data?.[0]

        if (preAnalysis) {
          viewPreAnalysis(preAnalysis)
        } else {
          toast.add({
            severity: 'warn',
            summary: 'No encontrado',
            detail: 'No se encontró el pre-análisis para esta sustancia',
            life: 3000,
          })
        }
      } catch (error) {
        console.error('Error buscando pre-análisis:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el pre-análisis',
          life: 3000,
        })
      }
    }

    const fetchPreAnalysis = async () => {
      try {
        loadingPreAnalysis.value = true
        const { data } = await preAnalysisService.getAll()
        preAnalysisList.value = data.content || data || []
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los pre-análisis',
        })
      } finally {
        loadingPreAnalysis.value = false
      }
    }

    const fetchAnalyses = async () => {
      try {
        loadingAnalysis.value = true
        const { data } = await analysisService.getAll()
        const raw = data.content || data || []
        analysisList.value = [...raw].sort((a, b) => {
          const da = new Date(a.createdAt || a.date_analysis || 0)
          const db = new Date(b.createdAt || b.date_analysis || 0)
          return db - da
        })
      } catch (e) {
        console.error('Error cargando análisis:', e)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los análisis',
        })
      } finally {
        loadingAnalysis.value = false
      }
    }

    const onRowExpand = async (event) => {
      const reception = event.data
      loadingSubstances.value = reception.id

      try {
        const { data } = await substancesService.getByReceptionId(reception.id)
        reception.substances = data.content || data || []
        console.log(data)

        // Verificar si cada sustancia tiene pre-análisis
        await checkExistingPreAnalysis()
      } catch (err) {
        console.error('Error cargando sustancias:', err)
      } finally {
        loadingSubstances.value = null
      }
    }

    const onRowCollapse = (event) => {
      // Remover sustancias de la recepción colapsada de la selección
      if (event.data && event.data.substances) {
        const substanceIds = event.data.substances.map((s) => s.id)
        selectedSubstances.value = selectedSubstances.value.filter(
          (substance) => !substanceIds.includes(substance.id),
        )
      }
    }

    const getPoliceName = (police) => {
      if (!police) return '—'
      return `${police.firstName || ''} ${police.firstLastName || ''}`.trim() || '—'
    }

    const getSubstanceName = (substance) => {
      if (!substance) return '—'
      return substance.substanceType?.name || `Sustancia #${substance.id}`
    }

    const getAnalysisResult = (analysis) => {
      console.log(analysis)

      // Obtener los tres campos
      const macro = analysis.macro
      const micro = analysis.micro
      const result = analysis.result

      // Contar cuántos campos están llenos
      const filledCount = (macro ? 1 : 0) + (micro ? 1 : 0) + (result ? 1 : 0)
      console.log('Campos llenos:', filledCount)
      // Si no todos los tres están llenos, es EN PROCESO (incluyendo cuando ninguno está lleno)
      if (filledCount < 3) {
        return 'EN PROCESO'
      }

      // Si los tres son POSITIVO
      if (macro === 'POSITIVO' && micro === 'POSITIVO' && result === 'POSITIVO') {
        return 'POSITIVO'
      }

      // Si los tres son NEGATIVO
      if (macro === 'NEGATIVO' && micro === 'NEGATIVO' && result === 'NEGATIVO') {
        return 'NEGATIVO'
      }

      // Si son distintos
      return 'INDETERMINADO'
    }

    const getResultSeverity = (resultText) => {
      switch (resultText) {
        case 'POSITIVO':
          return 'danger'
        case 'NEGATIVO':
          return 'success'
        case 'INDETERMINADO':
          return 'warning'
        case 'EN PROCESO':
          return 'info'
        default:
          return 'info'
      }
    }

    const getDestinationName = (destinationId) => {
      if (!destinationId) return '—'
      const destination = destinations.value?.find((d) => d.id === destinationId)
      return destination?.name || '—'
    }

    const formatDate = (dateString) => {
      if (!dateString) return '—'
      const date = new Date(dateString)
      try {
        return date.toLocaleDateString('es-CL')
      } catch (e) {
        return date.toISOString().split('T')[0]
      }
    }

    // Processing of analyses is handled by the per-row `CompleteAnalysis` component

    const viewReceptionDetail = (reception) => {
      console.log('👁️ Ver recepción:', reception)
      toast.add({
        severity: 'info',
        summary: 'Ver detalle',
        detail: `Mostrando recepción #${reception.number}`,
        life: 2500,
      })
    }

    const viewPreAnalysis = (preAnalysis) => {
      console.log('👁️ Ver pre-análisis:', preAnalysis)
      toast.add({
        severity: 'info',
        summary: 'Ver detalle',
        detail: `Mostrando pre-análisis #${preAnalysis.id}`,
        life: 2500,
      })
    }
    const rowClassPreAnalysis = (row) => {
      console.log(row.data)

      const data = row && row.data ? row.data : row
      if (!data) return ''
      return data.state === 'BORRADOR' ? 'borrador-row' : ''
    }
    const generatePDF = async (item) => {
      const reception = item.reception || item?.substance?.reception || null
      const substance = item.substance || item

      if (!reception) {
        toast.add({
          severity: 'error',
          summary: 'No se puede generar PDF',
          detail: 'El pre-análisis no contiene una recepción válida',
        })
        return
      }

      generarActaPDF(reception, [substance])
    }

    const generateAnalysisReport = (analysis) => {
      try {
        if (!analysis || !analysis.preAnalysis) {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pueden generar el reporte sin datos de análisis',
            life: 3000,
          })
          return
        }

        if ((analysis.state || '').toUpperCase() === 'PENDIENTE') {
          toast.add({
            severity: 'warn',
            summary: 'No disponible',
            detail: 'No se puede generar reporte para un análisis pendiente',
            life: 3000,
          })
          return
        }

        generarReporteAnalisisPDF(analysis)

        toast.add({
          severity: 'success',
          summary: 'Reporte generado',
          detail: 'El reporte de análisis se ha generado correctamente',
          life: 3000,
        })
      } catch (error) {
        console.error('Error generando reporte de análisis:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo generar el reporte de análisis',
          life: 3000,
        })
      }
    }

    const handleAnalysisCompleted = async () => {
      await fetchAnalyses()
    }

    const generateConsolidatedReport = () => {
      if (!selectedAnalysis.value.length) {
        toast.add({
          severity: 'warn',
          summary: 'Sin selección',
          detail: 'Debe seleccionar al menos un análisis',
          life: 2500,
        })
        return
      }

      // Limpiar campo y abrir modal
      reservedNumber.value = null
      showReservedNumberDialog.value = true
    }

    const confirmGenerateReport = async () => {
      if (!reservedNumber.value || reservedNumber.value.toString().trim() === '') {
        toast.add({
          severity: 'warn',
          summary: 'Número reservado requerido',
          detail: 'Debe ingresar un número reservado',
          life: 2500,
        })
        return
      }

      try {
        isGeneratingReport.value = true

        let successCount = 0
        let errorCount = 0

        // Crear un registro de reserved por cada análisis seleccionado y actualizar estado
        for (const analysis of selectedAnalysis.value) {
          try {
            const reservedPayload = {
              number: reservedNumber.value,
              analysis: analysis,
              fiscal: true,
              isp: false,
            }
            await reservedsService.create(reservedPayload)

            // Actualizar estado del análisis a COMPLETADO_RESERVADO
            await analysisService.update(analysis.id, {
              ...analysis,
              state: 'COMPLETADO_RESERVADO',
            })

            successCount++
          } catch (error) {
            console.error(`Error creando reservado para análisis ${analysis.id}:`, error)
            errorCount++
          }
        }

        if (errorCount > 0) {
          toast.add({
            severity: 'warn',
            summary: 'Guardado Parcial',
            detail: `${successCount} reservados creados, ${errorCount} con errores`,
            life: 3000,
          })
        }

        // Generar el PDF con el informe consolidado
        generarInformeConsolidadoPDF(selectedAnalysis.value, reservedNumber.value)

        toast.add({
          severity: 'success',
          summary: 'Informe generado',
          detail: `Informe consolidado con ${selectedAnalysis.value.length} análisis generado correctamente`,
          life: 3000,
        })

        showReservedNumberDialog.value = false
        reservedNumber.value = null

        // Recargar análisis para actualizar estados
        await fetchAnalyses()
      } catch (error) {
        console.error('Error generando informe consolidado:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo generar el informe consolidado',
          life: 3000,
        })
      } finally {
        isGeneratingReport.value = false
      }
    }

    const generateReserveds = () => {
      if (!selectedAnalysis.value.length) {
        toast.add({
          severity: 'warn',
          summary: 'Sin selección',
          detail: 'Debe seleccionar al menos un análisis',
          life: 2500,
        })
        return
      }

      // Limpiar campos y abrir modal
      reservedsData.value = {
        fiscaliaLocal: null,
        isp: null,
      }
      showReservedsDialog.value = true
    }

    const confirmGenerateReserveds = async () => {
      if (
        !reservedsData.value.fiscaliaLocal ||
        reservedsData.value.fiscaliaLocal.toString().trim() === ''
      ) {
        toast.add({
          severity: 'warn',
          summary: 'Número de Fiscalía Local requerido',
          detail: 'Debe ingresar el número de reservado de Fiscalía Local',
          life: 2500,
        })
        return
      }

      if (!reservedsData.value.isp || reservedsData.value.isp.toString().trim() === '') {
        toast.add({
          severity: 'warn',
          summary: 'Número de ISP requerido',
          detail: 'Debe ingresar el número de reservado del Instituto de Salud Pública',
          life: 2500,
        })
        return
      }

      try {
        isGeneratingReserveds.value = true

        let successCount = 0
        let errorCount = 0

        // Crear dos registros por cada análisis
        for (const analysis of selectedAnalysis.value) {
          try {
            // Crear reservado de Fiscalía Local
            const fiscalPayload = {
              number: reservedsData.value.fiscaliaLocal,
              analysis: analysis,
              fiscal: true,
              isp: false,
            }
            await reservedsService.create(fiscalPayload)

            // Crear reservado de ISP
            const ispPayload = {
              number: reservedsData.value.isp,
              analysis: analysis,
              fiscal: false,
              isp: true,
            }
            await reservedsService.create(ispPayload)

            // Actualizar estado del análisis a RESERVADO
            await analysisService.update(analysis.id, {
              ...analysis,
              state: 'RESERVADO',
            })

            successCount++
          } catch (error) {
            console.error(`Error creando reservados para análisis ${analysis.id}:`, error)
            errorCount++
          }
        }

        if (errorCount === 0) {
          toast.add({
            severity: 'success',
            summary: 'Reservados generados',
            detail: `Reservados generados correctamente para ${successCount} análisis`,
            life: 3000,
          })
        } else {
          toast.add({
            severity: successCount > 0 ? 'warn' : 'error',
            summary: 'Generación Parcial',
            detail: `${successCount} exitosos, ${errorCount} con errores`,
            life: 3000,
          })
        }

        showReservedsDialog.value = false
        reservedsData.value = {
          fiscaliaLocal: null,
          isp: null,
        }

        // Recargar datos para actualizar la vista
        await fetchAnalyses()
      } catch (error) {
        console.error('Error generando reservados:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo generar los reservados',
          life: 3000,
        })
      } finally {
        isGeneratingReserveds.value = false
      }
    }

    const openMicroanalysisDialog = (analysis) => {
      selectedAnalysisForMicroanalysis.value = analysis
      showMicroanalysisDialog.value = true
    }

    const openChemicalTestDialog = (analysis) => {
      selectedAnalysisForChemicalTest.value = analysis
      showChemicalTestDialog.value = true
    }

    const sendToISP = async (analysis) => {
      try {
        toast.add({
          severity: 'info',
          summary: 'Enviando a ISP',
          detail: `Análisis #${analysis.id} será enviado a ISP`,
          life: 3000,
        })

        // Aquí puedes implementar la lógica para enviar a ISP
        // Por ahora, solo mostramos un mensaje
        console.log('Enviando a ISP:', analysis)
      } catch (error) {
        console.error('❌ Error enviando a ISP:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo enviar a ISP',
          life: 3000,
        })
      }
    }

    const printReserved = async (analysis) => {
      try {
        // Obtener los números reservados de este análisis
        const response = await reservedsService.getByAnalysisId(analysis.id)
        const reserveds = response.data

        if (!reserveds || reserveds.length === 0) {
          toast.add({
            severity: 'warn',
            summary: 'Sin reservados',
            detail: 'No se encontraron números reservados para este análisis',
            life: 2500,
          })
          return
        }

        // Generar PDF con los números reservados
        await generarReservadoPDF(analysis, reserveds)

        toast.add({
          severity: 'success',
          summary: 'PDF Generado',
          detail: `Documento de reservados generado para análisis #${analysis.id}`,
          life: 3000,
        })
      } catch (error) {
        console.error('❌ Error imprimiendo reservado:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo imprimir el documento de reservados',
          life: 3000,
        })
      }
    }

    const printReservedFiscalia = async (analysis) => {
      try {
        // Obtener los números reservados de este análisis
        const response = await reservedsService.getByAnalysisId(analysis.id)
        const reserveds = response.data

        if (!reserveds || reserveds.length === 0) {
          toast.add({
            severity: 'warn',
            summary: 'Sin reservados',
            detail: 'No se encontraron números reservados para este análisis',
            life: 2500,
          })
          return
        }

        // Generar PDF con los números reservados para Fiscalía
        await generarReservadoFiscaliaPDF(analysis, reserveds)

        toast.add({
          severity: 'success',
          summary: 'PDF Generado',
          detail: `Documento de reservados Fiscalía generado para análisis #${analysis.id}`,
          life: 3000,
        })
      } catch (error) {
        console.error('❌ Error imprimiendo reservado Fiscalía:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo imprimir el documento de reservados Fiscalía',
          life: 3000,
        })
      }
    }

    const printMicroanalysis = (analysis) => {
      try {
        if (!analysis.micro) {
          toast.add({
            severity: 'warn',
            summary: 'Sin datos',
            detail: 'No hay información de microanálisis para este análisis',
            life: 2500,
          })
          return
        }

        // Generar PDF del microanálisis
        generarReporteMicroanalisisPDF(analysis)

        toast.add({
          severity: 'success',
          summary: 'PDF Generado',
          detail: `Reporte de microanálisis generado para análisis #${analysis.id}`,
          life: 3000,
        })
      } catch (error) {
        console.error('❌ Error imprimiendo microanálisis:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo imprimir el reporte de microanálisis',
          life: 3000,
        })
      }
    }

    const printConsolidatedReport = async (analysis) => {
      try {
        // Obtener el número reservado asociado a este análisis
        const response = await reservedsService.getByAnalysisId(analysis.id)
        const reserveds = response.data

        if (!reserveds || reserveds.length === 0) {
          toast.add({
            severity: 'warn',
            summary: 'Sin reservados',
            detail: 'No se encontró número reservado para este análisis',
            life: 2500,
          })
          return
        }

        // Buscar el reservado fiscal (fiscal: true)
        const fiscalReserved = reserveds.find((r) => r.fiscal)
        if (!fiscalReserved) {
          toast.add({
            severity: 'warn',
            summary: 'Sin reservado fiscal',
            detail: 'No se encontró número reservado fiscal',
            life: 2500,
          })
          return
        }

        // Cargar todos los análisis asociados a este número reservado
        const analysesResponse = await reservedsService.getByNumberPaginated(fiscalReserved.number)
        const allAnalyses = analysesResponse.data.content || analysesResponse.data || []

        if (allAnalyses.length === 0) {
          toast.add({
            severity: 'warn',
            summary: 'Sin análisis',
            detail: 'No se encontraron análisis asociados a este reservado',
            life: 2500,
          })
          return
        }

        // Extraer los análisis del formato de respuesta
        const analyses = allAnalyses.map((item) => item.analysis)

        // Generar PDF con todos los análisis
        generarInformeConsolidadoPDF(analyses, fiscalReserved.number)

        toast.add({
          severity: 'success',
          summary: 'Informe Generado',
          detail: `Informe consolidado con ${analyses.length} análisis generado`,
          life: 3000,
        })
      } catch (error) {
        console.error('❌ Error imprimiendo informe consolidado:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo imprimir el informe consolidado',
          life: 3000,
        })
      }
    }

    onMounted(() => {
      console.log('✅ Vista de pre-análisis cargada')
      fetchPreAnalysis()
      fetchReceptions()
      fetchAnalyses()
      fetchDropdownData() // ← Agregar esta línea

      // Escuchar evento personalizado cuando PreAnalysis procesa sustancias
      window.addEventListener('analysisUpdated', () => {
        console.log('📊 Actualizando tabla de análisis desde PreAnalysis...')
        fetchAnalyses()
      })
    })

    return {
      loading,
      receptions,
      preAnalysisList,
      expandedRows,
      loadingSubstances,
      acceptingReceptionId,
      sendingSubstanceId,
      isSendingToPreAnalysis,
      showPreAnalysisDialog,
      showBulkPreAnalysisDialog,
      selectedSubstance,
      selectedReception,
      selectedSubstances,
      selectedReceptionForBulk,
      isSendingBulkToPreAnalysis,

      filtersReception,
      filters,
      isPreAnalysisFormValid,
      showIndividualWeights,
      isBulkPreAnalysisFormValid,
      acceptReception,
      openSendToPreAnalysis,
      sendToPreAnalysis,
      getSelectedCountForReception,
      openBulkPreAnalysisDialogForReception,
      openBulkPreAnalysisDialog,
      closeBulkDialog,
      sendBulkToPreAnalysis,
      viewPreAnalysisForSubstance,
      onRowExpand,
      onRowCollapse,
      getPoliceName,
      getSubstanceName,
      getAnalysisResult,
      getResultSeverity,
      getDestinationName,
      viewReceptionDetail,
      viewPreAnalysis,
      generatePDF,
      handleReceptionUpdated,
      formatDate,
      destinations,
      methodsDestruction,
      loadingDestinations,
      loadingMethodsDestruction,

      handlePreAnalysisCancel,
      handleBulkPreAnalysisCancel,
      selectedPreAnalysis,
      analysisList,
      loadingAnalysis,
      selectedAnalysis,
      canSelectAnalysis,
      canSelectRow,
      isAnalysisSelected,
      toggleAnalysisSelection,

      isRowSelectable,
      rowClassPreAnalysis,
      generateAnalysisReport,
      handleAnalysisCompleted,
      fetchAnalyses,
      generateConsolidatedReport,
      showMicroanalysisDialog,
      selectedAnalysisForMicroanalysis,
      openMicroanalysisDialog,
      showChemicalTestDialog,
      selectedAnalysisForChemicalTest,
      openChemicalTestDialog,
      sendToISP,
      printReserved,
      printReservedFiscalia,
      printMicroanalysis,
      showReservedNumberDialog,
      reservedNumber,
      isGeneratingReport,
      confirmGenerateReport,
      showReservedsDialog,
      reservedsData,
      isGeneratingReserveds,
      confirmGenerateReserveds,
      hasOnlyInteriorDestination,
      hasOnlyExteriorDestination,
      generateReserveds,
      printConsolidatedReport,
    }
  },
}
</script>

<style scoped>
.borrador-row {
  background-color: #fff6b8 !important;
}

:deep(.borrador-row) > td,
:deep(.borrador-row) td {
  background-color: #fff6b8 !important;
}
</style>
