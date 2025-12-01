<template>
  <Dialog
    :visible="visible"
    modal
    header="Enviar Contramuestras a Destrucción"
    :style="{ width: '600px' }"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="p-fluid">
      <div class="mb-3">
        <p class="text-sm text-500">
          {{ selectedStorages.length }} registro(s) seleccionado(s) para destrucción
        </p>
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
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

export default {
  name: 'DestructionDialog',
  components: {
    Dialog,
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
      closeDialog,
      submitForm,
    }
  },
}
</script>
