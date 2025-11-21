<template>
  <Dialog
    :visible="visible"
    modal
    header="Procesar Sustancias Seleccionadas"
    :style="{ width: '900px' }"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="p-fluid">
      <div class="mb-4">
        <h4>Resumen de Sustancias Seleccionadas</h4>
        <p class="text-sm text-500">
          {{ selectedSubstances.length }} sustancias seleccionadas para procesar
        </p>
        <div class="selected-substances-list mt-2">
          <Chip
            v-for="substance in selectedSubstances"
            :key="substance.id"
            :label="`${substance.nue} - ${substance.substanceType?.name || 'Sin tipo'}`"
            class="mr-2 mb-2"
          />
        </div>
      </div>

      <div class="field">
        <label for="bulkDestination">Destino *</label>
        <Dropdown
          id="bulkDestination"
          v-model="formData.destination"
          :options="destinations"
          optionLabel="name"
          placeholder="Seleccione destino"
          class="w-full"
        />
      </div>

      <div class="field">
        <label for="bulkMethod">Método de Destrucción (si aplica)</label>
        <Dropdown
          id="bulkMethod"
          v-model="formData.methodDestruction"
          :options="methodsDestruction"
          optionLabel="name"
          placeholder="Seleccione método"
          class="w-full"
        />
      </div>

      <div class="field">
        <label for="bulkObservation">Observación General</label>
        <Textarea
          id="bulkObservation"
          v-model="formData.observation"
          rows="3"
          placeholder="Observaciones aplicables a todas las sustancias seleccionadas..."
          class="w-full"
        />
      </div>

      <!-- CONFIGURACIÓN DE PESOS INDIVIDUALES -->
      <div class="field" v-if="showIndividualWeights">
        <label>Configuración de Pesos por Sustancia</label>
        <div class="individual-weights mt-2">
          <div
            v-for="substance in selectedSubstances"
            :key="substance.id"
            class="flex align-items-center gap-2 mb-2 p-2 border-round"
            style="background: #f8f9fa"
          >
            <div class="flex-1">
              <div class="text-sm">
                <strong>{{ substance.nue }}</strong> - {{ substance.substanceType?.name }}
              </div>
              <div class="text-xs text-500">Peso total: {{ substance.weight }} gr</div>
            </div>

            <div style="width: 120px">
              <label class="text-xs">Muestra (gr)</label>
              <InputNumber
                v-model="formData.individualWeights[substance.id].sample"
                mode="decimal"
                :min="0"
                :max="substance.weight"
                :fractionDigits="2"
                decimalSeparator="."
                :useGrouping="false"
                placeholder="Muestra"
                :minFractionDigits="1"
                style="width: 120px"
              />
            </div>

            <div style="width: 140px">
              <label class="text-xs">Contramuestra (gr)</label>
              <InputNumber
                v-model="formData.individualWeights[substance.id].contra"
                mode="decimal"
                :min="0"
                :max="substance.weight"
                :fractionDigits="2"
                decimalSeparator="."
                :useGrouping="false"
                placeholder="Contramuestra"
                :minFractionDigits="1"
                style="width: 120px"
              />
            </div>

            <div style="width: 140px">
              <label class="text-xs">Restante → Destrucción</label>
              <div class="text-sm text-700">{{ computeRestante(substance) }} gr</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" @click="closeDialog" class="p-button-text" />
      <Button
        label="Procesar Todas"
        icon="pi pi-send"
        @click="submitForm"
        :loading="loading"
        :disabled="!isFormValid"
      />
    </template>
  </Dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Chip from 'primevue/chip'
import Checkbox from 'primevue/checkbox'
import InputNumber from 'primevue/inputnumber'

export default {
  name: 'BulkPreAnalysisDialog',
  components: {
    Dialog,
    Dropdown,
    Textarea,
    Button,
    Chip,
    Checkbox,
    InputNumber,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    selectedSubstances: {
      type: Array,
      default: () => [],
    },
    destinations: {
      type: Array,
      default: () => [],
    },
    methodsDestruction: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible', 'submit', 'cancel'],
  setup(props, { emit }) {
    const formData = ref({
      destination: null,
      methodDestruction: null,
      observation: '',
      individualWeights: {},
    })

    const showIndividualWeights = computed(() => true)

    const isFormValid = computed(() => {
      if (!formData.value.destination) return false

      // Validar que todas las sustancias tengan peso de muestra asignado y que muestra+contra <= peso total
      return props.selectedSubstances.every((substance) => {
        const obj = formData.value.individualWeights[substance.id] || {}
        const sample = Number(obj.sample) || 0
        const contra = Number(obj.contra) || 0
        return sample > 0 && sample + contra <= Number(substance.weight || 0)
      })
    })

    const submitForm = () => {
      if (isFormValid.value) {
        // Sanitize and coerce numeric values to numbers (decimals preserved)
        const payload = {
          destination: formData.value.destination,
          methodDestruction: formData.value.methodDestruction,
          observation: formData.value.observation,
          individualWeights: {},
        }

        Object.keys(formData.value.individualWeights || {}).forEach((id) => {
          const obj = formData.value.individualWeights[id] || {}
          payload.individualWeights[id] = {
            sample:
              obj.sample === null || obj.sample === undefined || obj.sample === ''
                ? null
                : parseFloat(obj.sample),
            contra:
              obj.contra === null || obj.contra === undefined || obj.contra === ''
                ? null
                : parseFloat(obj.contra),
          }
        })

        emit('submit', payload)
      }
    }

    const closeDialog = () => {
      emit('update:visible', false)
      emit('cancel')
    }
    // Inicializar pesos individuales cuando se abra el diálogo
    watch(
      () => props.visible,
      (newVal) => {
        if (newVal) {
          formData.value = {
            destination: null,
            methodDestruction: null,
            observation: '',
            individualWeights: {},
          }

          // Inicializar pesos individuales (sample y contra)
          props.selectedSubstances.forEach((substance) => {
            formData.value.individualWeights[substance.id] = { sample: null, contra: null }
          })
        }
      },
    )

    const computeRestante = (substance) => {
      const obj = formData.value.individualWeights[substance.id] || {}
      const sample = Number(obj.sample || 0)
      const contra = Number(obj.contra || 0)
      const restante = Number(substance.weight || 0) - sample - contra
      return restante > 0 ? restante.toFixed(2) : '0.00'
    }

    return {
      formData,
      showIndividualWeights,
      isFormValid,
      closeDialog,
      submitForm,
      computeRestante,
    }
  },
}
</script>
