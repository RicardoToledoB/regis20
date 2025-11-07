<template>
  <div>
    <ThemeSwitcher />
    <div class="card flex justify-center">
      <Button label="Agregar Unidad" @click="visible = true" />

      <Dialog 
        v-model:visible="visible" 
        maximizable 
        header="Agregar Unidad" 
        :style="{ width: '50rem' }"
        :headerStyle="{ 
          padding: '1.5rem 1.5rem 1rem 1rem',
        }"
        :contentStyle="{ 
          padding: '1rem 1.5rem 1.5rem 1.5rem'
        }"         
      >
        <template #header>
          <div class="custom-header">
            <span class="text-xl font-semibold">Crear Unidad</span>
          </div>
        </template>
        
            <div class="dialog-content">
               <div class="flex flex-column gap-2">
                    <label for="name">Nombre</label>
                    <InputText id="name" v-model="unity.name" aria-describedby="username-help" class=" " />
                </div>
                <br>
                                <br>
               
                <!-- resto del contenido -->
            </div>
        
        <br>
        <br>
        
        <div class="flex justify-content-end gap-2">
          <Button type="button" label="Cerrar" severity="secondary" @click="visible = false">
             <template #icon>
              <font-awesome-icon icon="fa-solid fa-close" />
            </template>
          </Button>
          <Button type="button" label="Guardar" @click="visible = false">
            <template #icon>
              <font-awesome-icon icon="fa-solid fa-save" />
            </template>
          </Button>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateUnities',
  data() {
    return {
      unity: {
        name: null,
      },
      visible: false,
      buttondisplay: null,
      value: ''
    }
  },
  mounted() {
    console.log('Componente de institución montado');
  },
  methods: {
    openDialog() {
      this.visible = true;
    },
    closeDialog() {
      this.visible = false;
    },
    saveData() {
      console.log('Guardando datos...', this.value, this.buttondisplay);
      this.visible = false;
    }
  },
  watch: {
    visible(newVal) {
      console.log('Visibilidad del diálogo:', newVal);
    },
    value(newVal) {
      console.log('Valor cambiado:', newVal);
    }
  },
  computed: {
    formattedDate() {
      return this.buttondisplay ? this.buttondisplay.toLocaleDateString() : '';
    }
  }
}
</script>

<style scoped>
:deep(.p-password .p-inputtext) {
  width: 100%;
}
</style>