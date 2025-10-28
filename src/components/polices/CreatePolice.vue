<template>
  <div>
    <ThemeSwitcher />
    <div class="card flex justify-center">
      <Button label="Agregar Policia" @click="visible = true" />

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
            <span class="text-xl font-semibold">Policia</span>
          </div>
        </template>
        
            <div class="dialog-content">
               <div class="flex flex-column gap-2">
                    <label for="name">Nombre</label>
                    <InputText id="name" v-model="police.name" aria-describedby="username-help" class="p-inputtext-lg" />
                </div>
                <br>
                <div class="flex flex-column gap-2">
                    <label for="name">Apellido Paterno</label>
                    <InputText id="name" v-model="police.apepat" aria-describedby="username-help" class="p-inputtext-lg" />
                </div><br>
                <div class="flex flex-column gap-2">
                    <label for="name">Apellido Materno</label>
                    <InputText id="name" v-model="police.apemat" aria-describedby="username-help" class="p-inputtext-lg" />
                </div><br>
               
                <div class="flex flex-column gap-2">
                    <label for="name">Rut</label>
                    <InputText id="name" v-model="police.rut" aria-describedby="username-help" class="p-inputtext-lg" />
                </div><br>
              
                <div class="flex flex-column gap-2">
                    <label for="name">Institución Policial</label>
                    <Dropdown v-model="police.insitution" :options="institutions" optionLabel="name" placeholder="Seleccionar institución" class="w-ful p-inputtext-lg" />
                </div>
                <br>
                  <div class="flex flex-column gap-2">
                    <label for="name">Grado</label>
                    <Dropdown v-model="police.insitution" :options="institutions" optionLabel="name" placeholder="Seleccionar grado" class="w-ful p-inputtext-lg" />
                </div>
                <br>
               
                <!-- resto del contenido -->
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
  name: 'CreatePolice',
  data() {
    return {
      police: {
        name: null,
        apepat: null,
        apemat: null,
        rut: null,
        grade: null,
        insitution:null
      },
      institutions:[{id:1,name:"Carabibuenos"},{id:2, name:"CarabiMalos"}],
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