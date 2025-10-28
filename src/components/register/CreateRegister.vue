<template>
  <div>
    <ThemeSwitcher />
    <div class="card flex justify-center">
      <Button label="Recepcionar" @click="visible = true" />

      <Dialog 
        v-model:visible="visible" 
        maximizable 
        header="Edit Profile" 
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
            <span class="text-xl font-semibold">Recepcion</span>
          </div>
        </template>
        
        <div class="flex flex-wrap">
          <div class="flex flex-column md:col-4">
            <label for="name">N° Oficio</label>
            <InputText id="name" 
              v-model="data.n_oficio" 
              class="p-inputtext-lg" />
          </div>
          <div class="flex flex-column md:col-4">
            <label for="buttondisplay" class="block">Fecha Oficio</label>
            <Calendar v-model="data.date_oficio" 
              :showOnFocus="true" 
              class="p-inputtext-lg"
              dateFormat="dd-mm-yy" />
          </div>
          <div class="flex flex-column md:col-4">
            <label for="buttondisplay" class="block">Fecha de Recepcion</label>
            <Calendar v-model="data.date_recepcion" 
              :showOnFocus="true" 
              class="p-inputtext-lg" 
              dateFormat="dd/mm/yy"/>
          </div>
        </div>
        
        <br>

        <div class="flex flex-wrap">
          <div class="flex flex-column md:col-3">
            <label for="rut">RUT</label>
            <InputText id="rut" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
          </div>
          <div class="flex flex-column md:col-3">
            <label for="nombre">Nombre</label>
            <InputText id="nombre" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
          </div>
          <div class="flex flex-column md:col-3">
            <label for="apellido1">1er Apellido</label>
            <InputText id="apellido1" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
          </div>
          <div class="flex flex-column md:col-3">
            <label for="apellido2">2do Apellido</label>
            <InputText id="apellido2" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
          </div>
          
          <div class="flex flex-column md:col-3">
            <label for="grado">Grado</label>
            <InputText id="grado" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
          </div>
          <div class="flex flex-column md:col-6">
            <label for="comuna">Comuna</label>
            <InputText id="comuna" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
          </div>
          <div class="flex flex-column md:col-3">
            <label for="unidad">Unidad</label>
            <InputText id="unidad" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
          </div>
          
          <div class="flex flex-column md:col-12">
            <label for="institucion">Institución Policial</label>
            <InputText id="institucion" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
          </div>
        </div>
        
        <br>
        <br>
        
        <div class="flex justify-content-end gap-2">
          <Button type="button" label="Cerrar" severity="secondary" @click="visible = false">
             <template #icon>
              <font-awesome-icon icon="fa-solid fa-save" />
            </template>
          </Button>
          <Button type="button" label="Guardar" @click="visible = false"></Button>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecepcionComponent',
  data() {
    return {
      data: {
        n_oficio: null,
        date_oficio: null,
        date_recepcion: null,
      },
      visible: false,
      buttondisplay: null,
      value: ''
    }
  },
  mounted() {
    console.log('Componente de Recepción montado');
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