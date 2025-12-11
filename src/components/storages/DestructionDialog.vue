<template>
  <Dialog
    :visible="visible"
    modal
    header="Enviar Contramuestras a Destrucción"
    :style="{ width: '800px' }"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="p-fluid">
      <div class="mb-4">
        <h4 class="mb-2">Almacenamientos Seleccionados</h4>
        <DataTable
          :value="selectedStorages"
          class="p-datatable-sm"
          responsiveLayout="scroll"
          :rows="5"
          :paginator="selectedStorages.length > 5"
        >
          <Column field="id" header="N° Muestra" :style="{ width: '100px' }" />
          <Column header="N° NUE" :style="{ width: '120px' }">
            <template #body="slotProps">
              {{ slotProps.data.substance?.nue || slotProps.data.substance?.id || '—' }}
            </template>
          </Column>
          <Column header="N° Acta" :style="{ width: '120px' }">
            <template #body="slotProps">
              {{ slotProps.data.substance?.reception?.number || '—' }}
            </template>
          </Column>
          <Column header="Peso (gr)" :style="{ width: '120px' }">
            <template #body="slotProps">
              {{ Number(slotProps.data.counter_sample_quantity || 0).toFixed(2) }}
            </template>
          </Column>
        </DataTable>

        <div class="mt-3 flex justify-content-end">
          <p class="text-lg font-bold">
            Peso Total: <span class="text-primary">{{ totalWeight.toFixed(2) }} gr</span>
          </p>
        </div>
      </div>

      <div class="field">
        <label for="methodSelect">Método de Destrucción *</label>
        <Dropdown
          id="methodSelect"
          v-model="formData.methodDestruction"
          :options="methodsDestruction"
          optionLabel="name"
          placeholder="Seleccione un método"
          class="w-full"
        />
      </div>
    </div>

    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" @click="closeDialog" class="p-button-text" />
      <Button
        label="Enviar a Destrucción"
        icon="pi pi-send"
        @click="submitForm"
        :loading="loading"
      />
    </template>
  </Dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

export default {
  name: 'DestructionDialog',
  components: {
    Dialog,
    DataTable,
    Column,
    Dropdown,
    Textarea,
    Button,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    selectedStorages: {
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
  emits: ['update:visible', 'submit'],

  setup(props, { emit }) {
    const formData = ref({
      methodDestruction: null,
      observation: '',
    })

    // Calcular peso total de todos los storages seleccionados
    const totalWeight = computed(() => {
      return props.selectedStorages.reduce((total, storage) => {
        return total + Number(storage.counter_sample_quantity || 0)
      }, 0)
    })

    // Limpiar formulario cuando se abre/cierra el diálogo
    watch(
      () => props.visible,
      (newVal) => {
        if (newVal) {
          formData.value = {
            methodDestruction: null,
            observation: '',
          }
        }
      },
    )

    const closeDialog = () => {
      emit('update:visible', false)
    }

    const submitForm = () => {
      if (formData.value.methodDestruction) {
        emit('submit', {
          methodDestruction: formData.value.methodDestruction,
          observation: formData.value.observation,
        })
      }
    }

    return {
      formData,
      totalWeight,
      closeDialog,
      submitForm,
    }
  },
}
</script>
