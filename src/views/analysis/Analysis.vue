<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="preanalysis-container">
        <div class="page-content">
          <div class="flex justify-content-between align-items-center mb-0">
            <h1>Gestión de Análisis</h1>
            <Button
              v-if="selectedAnalysis.length > 0"
              icon="pi pi-file-pdf"
              label="Generar Informe Consolidado"
              class="p-button-success"
              @click="generateConsolidatedReport"
              v-tooltip.top="
                `Generar informe con ${selectedAnalysis.length} análisis seleccionado(s)`
              "
            />
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
                        :disabled="!canSelectAnalysis(slotProps.data)"
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
                      {{ slotProps.data.result || '—' }}
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
                        <Button
                          icon="pi pi-microscope"
                          class="p-button-rounded p-button-info p-button-outlined"
                          @click="openMicroanalysisDialog(slotProps.data)"
                          v-tooltip.top="'Microanálisis'"
                        />
                        <CompleteAnalysis
                          v-if="slotProps.data.state === 'PENDIENTE'"
                          :analysis="slotProps.data"
                          @processed="fetchAnalyses"
                        />
                        <Button
                          icon="pi pi-file-pdf"
                          class="p-button-rounded p-button-warning p-button-outlined"
                          :disabled="(slotProps.data.state || '').toUpperCase() === 'PENDIENTE'"
                          @click="generateAnalysisReport(slotProps.data)"
                          v-tooltip.top="
                            (slotProps.data.state || '').toUpperCase() === 'PENDIENTE'
                              ? 'Disponible solo cuando el análisis está COMPLETADO'
                              : 'Generar Reporte'
                          "
                        />
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

import preAnalysisService from '@/services/preAnalysisService.js'
import analysisService from '@/services/analysisService.js'
import { generarActaPDF } from '@/others/generarActaBtn.js'
import { generarReporteAnalisisPDF } from '@/others/generarReporteAnalisis.js'
import { generarInformeConsolidadoPDF } from '@/others/generarInformeConsolidado.js'
import recepcionService from '@/services/receptionsService.js'
import substancesService from '@/services/substancesService.js'
import EditReceptionUnlock from '@/components/receptions/EditReceptionUnlock.vue'
import destinationsService from '@/services/destinationsService.js'
import methodsDestructionsService from '@/services/methodsDestructionsService.js'
import storagesService from '@/services/storagesService.js'

import PreAnalysisDialog from '@/components/preanalysis/PreAnalysisDialog.vue'
import BulkPreAnalysisDialog from '@/components/preanalysis/BulkPreAnalysisDialog.vue'
import CompleteAnalysis from '@/components/analysis/CompleteAnalysis.vue'
import MicroanalysisDialog from '@/components/analysis/MicroanalysisDialog.vue'
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
    EditReceptionUnlock,
    PreAnalysisDialog,
    BulkPreAnalysisDialog,
    CompleteAnalysis,
    MicroanalysisDialog,
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
      const current = selectedAnalysisActNumber.value
      const rowAct = getActNumber(row)
      const isCompleted = (row.state || '').toUpperCase() === 'COMPLETADO'

      if (!isCompleted) return false
      if (current == null) return true
      return rowAct === current
    }

    const toggleAnalysisSelection = (row) => {
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

      if (selectedAnalysis.value.length === 0) {
        selectedAnalysisActNumber.value = null
      } else if (selectedAnalysis.value.length === 1) {
        selectedAnalysisActNumber.value = getActNumber(selectedAnalysis.value[0])
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

        // Procesar cada sustancia individualmente
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

            // Si hay contramuestra, crear registro de almacenamiento
            if (contraWeight > 0) {
              try {
                await storagesService.create({
                  entry_date: new Date().toISOString().split('T')[0],
                  sample_quantity: 0,
                  counter_sample_quantity: contraWeight,
                  description: formData.observation || '',
                  substance: substance,
                  storageLocation: { id: 1 },
                })
              } catch (storErr) {
                console.warn('No se pudo crear registro de almacenamiento:', storErr)
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

      try {
        generarInformeConsolidadoPDF(selectedAnalysis.value)
        toast.add({
          severity: 'success',
          summary: 'Informe generado',
          detail: `Informe consolidado con ${selectedAnalysis.value.length} análisis generado correctamente`,
          life: 3000,
        })
      } catch (error) {
        console.error('Error generando informe consolidado:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo generar el informe consolidado',
          life: 3000,
        })
      }
    }

    const openMicroanalysisDialog = (analysis) => {
      selectedAnalysisForMicroanalysis.value = analysis
      showMicroanalysisDialog.value = true
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
