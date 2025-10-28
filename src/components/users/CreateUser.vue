<template>
    <ThemeSwitcher />
    <div class="card flex justify-center">
        <Button label="Crear" @click="visible = true">
              <template #icon>
              <font-awesome-icon icon="fa-solid fa-plus" />
            </template>
        </Button>

        <Dialog 
            v-model:visible="visible" header="Edit Profile" :style="{ width: '30rem' }"
             :headerStyle="{ 
                padding: '1.5rem 1.5rem 1rem 1rem',
                
              
                
            }"
            :contentStyle="{ 
                padding: '1rem 1.5rem 1.5rem 1.5rem'
            }"         
        >
          <template #header>
                <div class="custom-header">
                    <span class="text-xl font-semibold">Crear Usuario</span>
                </div>
            </template>
            <div class="dialog-content">
               <div class="flex flex-column gap-2">
                    <label for="name">Nombre</label>
                    <InputText id="name" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
                </div>
                <br>
                <div class="flex flex-column gap-2">
                    <label for="name">Apellido Paterno</label>
                    <InputText id="name" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
                </div><br>
                <div class="flex flex-column gap-2">
                    <label for="name">Apellido Materno</label>
                    <InputText id="name" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
                </div><br>
                <div class="flex flex-column gap-2">
                    <label for="name">Correo Electronico</label>
                    <InputText id="name" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
                </div><br>
                <div class="flex flex-column gap-2">
                    <label for="name">Rut</label>
                    <InputText id="name" v-model="value" aria-describedby="username-help" class="p-inputtext-lg" />
                </div><br>
            
                <div class="flex flex-column gap-2">
                    <label for="name">Contraseña</label>
                    <Password v-model="value" 
                    promptLabel="Selecciona una contraseña" 
                    weakLabel="Muy debil" 
                    mediumLabel="Complejidad promedio" 
                    strongLabel="Fuerte"
                     />
                </div>
                <!-- resto del contenido -->
            </div>
            <br>
             <br>
            <div class="flex justify-content-end gap-2">
                <Button type="button" label="Cerrar" severity="secondary" @click="visible = false"></Button>
                <Button type="button" label="Guardar" @click="visible = false"></Button>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);
</script>

<style scoped>
:deep(.p-password .p-inputtext) {
    width: 100%;
}
</style>