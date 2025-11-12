<template>
  <div class="card flex justify-center">
    <Button label="Crear" @click="openDialog">
      <template #icon>
        <font-awesome-icon icon="fa-solid fa-plus" />
      </template>
    </Button>

    <Dialog 
      v-model:visible="visible"
       :style="{ width: '30rem' }"
      modal
      :transition-options="{ name: 'fade', duration: 300 }"
    >
      <template #header>
        <span class="text-xl font-semibold">Crear Usuario</span>
      </template>

      <!-- Spinner mientras se guarda -->
      <div v-if="isLoading" class="flex justify-content-center align-items-center" style="height:200px;">
        <ProgressSpinner />
      </div>

      <!-- Formulario solo cuando no está cargando -->
      <div v-else class="dialog-content">
        <div class="flex flex-column gap-2 mb-2">
          <label>Nombre</label>
          <InputText v-model="form.firstName" class=" " />
        </div>

        <div class="flex flex-column gap-2 mb-2">
          <label>Segundo Nombre</label>
          <InputText v-model="form.secondName" class=" " />
        </div>

        <div class="flex flex-column gap-2 mb-2">
          <label>Apellido Paterno</label>
          <InputText v-model="form.firstLastName" class=" " />
        </div>

        <div class="flex flex-column gap-2 mb-2">
          <label>Apellido Materno</label>
          <InputText v-model="form.secondLastName" class=" " />
        </div>

        <div class="flex flex-column gap-2 mb-2">
          <label>Email</label>
          <InputText v-model="form.email" type="email" class=" " />
        </div>

        <div class="flex flex-column gap-2 mb-2">
          <label>RUT</label>
          <InputText v-model="form.rut" class=" " />
        </div>

        <div class="flex flex-column">
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

      <template #footer>
        <Button label="Cerrar" severity="secondary" @click="closeDialog" :disabled="isLoading"/>
        <Button label="Guardar" @click="saveUser" :loading="isLoading"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue'
import userService from '@/services/usersService'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

export default {
  name: "CreateUser",
  components: {  InputText, Password, Button, Dialog },
  emits: ["created"],

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
      return [
        form.firstName,
        form.firstLastName,
        form.secondLastName
      ].filter(Boolean).join(' ')
    })

    const openDialog = () => { visible.value = true }
    const closeDialog = () => { visible.value = false }

    const resetForm = () => {
      form.firstName = ""
      form.secondName = ""
      form.firstLastName = ""
      form.secondLastName = ""
      form.email = ""
      form.rut = ""
      form.password = ""
    }

    const saveUser = async () => {
      try {
        isLoading.value = true
        const payload = { ...form, username: username.value }
        const { data } = await userService.create(payload)

        emit("created", data) // actualiza la tabla Users.vue

        resetForm()
        closeDialog()
      } catch (e) {
        console.error("❌ Error al crear usuario:", e)
      } finally {
        isLoading.value = false
      }
    }

    return {
      visible,
      form,
      isLoading,
      openDialog,
      closeDialog,
      saveUser
    }
  }
}
</script>

<style scoped>
:deep(.p-password .p-inputtext) {
  width: 100%;
}

</style>
