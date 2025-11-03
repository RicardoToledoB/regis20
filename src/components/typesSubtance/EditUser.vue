<template>
  <div>
    <Button icon="pi pi-pencil" class="p-button-rounded p-button-info" @click="openDialog" />

    <Dialog 
      v-model:visible="visible"
      :style="{ width: 'auto', padding: '0.5rem' }"
      modal
      :headerStyle="{ padding: '1rem 1.5rem' }"
      :contentStyle="{ padding: '1rem 0.5rem 1rem 1rem' }"
      :transition-options="{ name: 'fade', duration: 300 }"
    >
      <template #header>
        <span class="text-xl font-semibold">Editar Usuario</span>
      </template>

      <div class="dialog-content">
        <div v-if="isLoading" class="flex justify-content-center align-items-center" style="height:200px;">
          <ProgressSpinner />
        </div>

        <div v-else class="flex flex-column gap-4">
          <div >
            <label>Nombre</label>
            <InputText v-model="form.firstName" class="p-inputtext-lg w-full" />
          </div>

          <div >
            <label>Segundo Nombre</label>
            <InputText v-model="form.secondName" class="p-inputtext-lg w-full" />
          </div>

          <div>
            <label>Apellido Paterno</label>
            <InputText v-model="form.firstLastName" class="p-inputtext-lg w-full" />
          </div>

          <div>
            <label>Apellido Materno</label>
            <InputText v-model="form.secondLastName" class="p-inputtext-lg w-full" />
          </div>

          <div >
            <label>Email</label>
            <InputText v-model="form.email" type="email" class="p-inputtext-lg w-full" />
          </div>

          <div >
            <label>RUT</label>
            <InputText v-model="form.rut" class="p-inputtext-lg w-full" />
          </div>

          <div >
            <label>Contraseña</label>
            <Password 
              v-model="form.password"
              promptLabel="Selecciona una contraseña"
              weakLabel="Muy débil"
              mediumLabel="Medianamente segura"
              strongLabel="Muy segura"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cerrar" severity="secondary" @click="closeDialog" :disabled="isLoading"/>
        <Button label="Guardar" @click="updateUser" :loading="isLoading"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import userService from '@/services/usersService'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

export default {
  name: "EditUser",
  components: {  InputText, Password, Button, Dialog },
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  emits: ["updated"],

  setup(props, { emit }) {
    const visible = ref(false)
    const isLoading = ref(false)

    const form = reactive({
      firstName: "",
      secondName: "",
      firstLastName: "",
      secondLastName: "",
      email: "",
      rut: "",
      password: ""
    })

    const username = computed(() => {
      return [form.firstName, form.firstLastName, form.secondLastName].filter(Boolean).join(' ')
    })

    const openDialog = async () => {
      visible.value = true
      isLoading.value = true
      await loadUser()
      isLoading.value = false
    }

    const closeDialog = () => {
      visible.value = false
    }

    const loadUser = async () => {
      try {
        const { data } = await userService.getById(props.userId)
        form.firstName = data.firstName || ''
        form.secondName = data.secondName || ''
        form.firstLastName = data.firstLastName || ''
        form.secondLastName = data.secondLastName || ''
        form.email = data.email || ''
        form.rut = data.rut || ''
        form.password = ''
      } catch (e) {
        console.error("❌ Error al cargar usuario:", e)
      }
    }

    const updateUser = async () => {
      try {
        isLoading.value = true
        const payload = { ...form, username: username.value }
        const { data } = await userService.update(props.userId, payload)
        emit("updated", data)
        closeDialog()
      } catch (e) {
        console.error("❌ Error al actualizar usuario:", e)
      } finally {
        isLoading.value = false
      }
    }

    return {
      visible,
      isLoading,
      form,
      openDialog,
      closeDialog,
      updateUser
    }
  }
}
</script>

<style scoped>
.dialog-content {
  padding: 0.1rem 0;
}

.field {
  flex-direction: column;
  gap: 0.2rem;
}

.field label {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

:deep(.p-password .p-inputtext) {
  width: 100%;
}
</style>
