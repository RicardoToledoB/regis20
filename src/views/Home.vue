<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="home-container">
        <div class="page-content">
          <h1>Inicio</h1>

          <div class="grid">
            <div class="col-12 md:col-6 lg:col-3">
              <Card class="stats-card">
                <template #content>
                  <div class="stat-item">
                    <i class="pi pi-users stat-icon"></i>
                    <div class="stat-info">
                      <span class="stat-number">{{ user.cantidad }}</span>
                      <span class="stat-label">Usuarios</span>
                    </div>
                  </div>
                </template>
              </Card>
            </div>

            <div class="col-12 md:col-6 lg:col-3">
              <Card class="stats-card">
                <template #content>
                  <div class="stat-item">
                    <i class="pi pi-envelope stat-icon"></i>
                    <div class="stat-info">
                      <span class="stat-number">{{ receptions }}</span>
                      <span class="stat-label">Recepciones</span>
                    </div>
                  </div>
                </template>
              </Card>
            </div>

            <div class="col-12 md:col-6 lg:col-3">
              <Card class="stats-card">
                <template #content>
                  <div class="stat-item">
                    <i class="pi pi-check stat-icon"></i>
                    <div class="stat-info">
                      <span class="stat-number">{{ analisis }}</span>
                      <span class="stat-label">Analisis</span>
                    </div>
                  </div>
                </template>
              </Card>
            </div>

            <div class="col-12 md:col-6 lg:col-3">
              <Card class="stats-card">
                <template #content>
                  <div class="stat-item">
                    <i class="pi pi-file-edit stat-icon"></i>
                    <div class="stat-info">
                      <span class="stat-number">{{ borradores }}</span>
                      <span class="stat-label">Comentarios</span>
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </div>

          <div class="grid mt-4">
            <div class="col-12">
              <Card class="main-card">
                <template #header>
                  <img alt="user header" src="/public/ssm/BANNER.png" class="banner-img" />
                </template>
                <template #title style="padding-left: 15%;">{{ user.name }}</template>
                <template #content>
                  <p>RUT: {{ user.rut }}</p>
                  <p>EMAIL: {{ user.email }}</p>
                </template>
                <template #footer>
                  <div class="flex gap-3 mt-1 justify-content-end">
                    <Button label="Cambiar Clave" />
                  </div>
                </template>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PlantillaContenido>
</template>

<script>
import PlantillaContenido from './template/PlantillaContenido.vue';
import usersService from '@/services/usersService'; // Ajusta la ruta según tu estructura

export default {
  name: 'Home',
  components: { PlantillaContenido },
  data() {
    return {
      user: {
        name: "",
        rut: "",
        email: "",
        cantidad: 0
      },
      visible: false,
      buttondisplay: null,
      receptions: 0,
      analisis: 0,
      borradores: 0,
      isLoading: true
    }
  },
  async mounted() {
    console.log('Componente de institución montado');
    await this.cargarDatosUsuario();
    this.user.cantidad = 100; // Puedes mantener este valor o obtenerlo de otra API
  },
  methods: {
    async cargarDatosUsuario() {
      try {
        this.isLoading = true;
        
        // Obtener email del localStorage
        const userEmail = localStorage.getItem('mail');
        
        if (!userEmail) {
          console.error('❌ No se encontró email en localStorage');
          return;
        }

        console.log('🔍 Buscando usuario con email:', userEmail);

        // Llamar al servicio para obtener datos del usuario
        const response = await usersService.getByEmail(userEmail);
        
        if (response.data) {
          const userData = response.data[0];
          console.log('✅ Datos del usuario obtenidos:', userData);
          
          // Actualizar los datos del usuario con la respuesta del servicio
          this.user.name = `${userData.firstName || ''} ${userData.firstLastName || ''}`.trim();
          this.user.rut = userData.rut || '';
          this.user.email = userData.email || '';
          localStorage.setItem("user_id", userData.id)

          console.log('✅ Usuario actualizado:', this.user);
        } else {
          console.warn('⚠️ No se encontraron datos del usuario');
        }
      } catch (error) {
        console.error('❌ Error al cargar datos del usuario:', error);
        // Puedes mostrar un mensaje de error al usuario aquí
      } finally {
        this.isLoading = false;
      }
    },

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
.page-content {
  padding: 0.1rem;
}

.stats-card .stat-item {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.stat-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.stat-number {
  font-size: 1.3rem;
  font-weight: bold;
}

.banner-img {
  width: 100%;
  height: auto;
}

/* Ajustes de padding internos del Card */
.p-card-body,
.p-card-content,
.p-card-footer {
  padding: 1.25rem !important;
}

.grid > div {
  margin-bottom: 1rem;
}

/* Aplica padding interno real al Card */
::v-deep(.p-card-content),
::v-deep(.p-card-body),
::v-deep(.p-card-footer) {
  padding: 0.5rem !important;
}

/* Espaciado entre Cards */
.grid > div {
  margin-bottom: 0.1rem;
}

/* Tarjetas de estadísticas: mejor espaciado */
.stats-card ::v-deep(.p-card-content) {
  padding: 0.1rem !important;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

/* Loading state */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>