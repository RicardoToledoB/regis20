<template>
  <PlantillaContenido>
    <template #contenido>
      <div class="home-container">
        <div class="page-content">
          <h1>Inicio</h1>

          <!--      <div class="grid">
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
          </div>-->

          <div class="grid mt-4">
            <div class="col-12">
              <Card class="main-card">
                <template #header>
                  <img alt="user header" src="/public/ssm/BANNER.png" class="banner-img" />
                </template>
                <template #title style="padding-left: 15%">{{ user.name }}</template>
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
import PlantillaContenido from './template/PlantillaContenido.vue'

export default {
  name: 'Home',
  components: { PlantillaContenido },
  data() {
    return {
      user: {
        name: '',
        rut: '',
        email: '',
        cantidad: 0,
      },
      visible: false,
      buttondisplay: null,
      receptions: 0,
      analisis: 0,
      borradores: 0,
      isLoading: false,
    }
  },
  mounted() {
    console.log('Componente Home montado')
    this.cargarDatosDesdeLocalStorage()
    this.user.cantidad = 100 // Puedes mantener este valor o obtenerlo de otra API
  },
  methods: {
    cargarDatosDesdeLocalStorage() {
      try {
        console.log('📥 Cargando datos desde localStorage...')

        // Obtener datos del localStorage
        const userName = localStorage.getItem('userName')
        const userRut = localStorage.getItem('userRut')
        const userEmail = localStorage.getItem('userEmail')
        const userData = localStorage.getItem('userData')

        console.log('📋 Datos encontrados en localStorage:', {
          userName,
          userRut,
          userEmail,
          userData: userData ? 'Presente' : 'No presente',
        })

        // Cargar datos básicos
        this.user.name = userName || 'Usuario'
        this.user.rut = userRut || 'No disponible'
        this.user.email = userEmail || 'No disponible'

        // Si hay datos completos, intentar cargar información adicional
        if (userData) {
          try {
            const userDataObj = JSON.parse(userData)
            console.log('✅ Datos completos del usuario:', userDataObj)

            // Si no tenemos nombre completo, intentar construirlo desde los datos
            if (!userName && (userDataObj.firstName || userDataObj.firstLastName)) {
              this.user.name =
                `${userDataObj.firstName || ''} ${userDataObj.firstLastName || ''}`.trim()
            }

            // Si no tenemos RUT, intentar obtenerlo de los datos
            if (!userRut && userDataObj.rut) {
              this.user.rut = userDataObj.rut
            }

            // Si no tenemos email, intentar obtenerlo de los datos
            if (!userEmail && userDataObj.email) {
              this.user.email = userDataObj.email
            }
          } catch (parseError) {
            console.error('❌ Error al parsear userData:', parseError)
          }
        }

        console.log('✅ Datos cargados en el componente:', this.user)
      } catch (error) {
        console.error('❌ Error al cargar datos desde localStorage:', error)
        // Valores por defecto en caso de error
        this.user.name = 'Usuario'
        this.user.rut = 'No disponible'
        this.user.email = 'No disponible'
      }
    },

    openDialog() {
      this.visible = true
    },
    closeDialog() {
      this.visible = false
    },
    saveData() {
      console.log('Guardando datos...', this.value, this.buttondisplay)
      this.visible = false
    },
  },
  watch: {
    visible(newVal) {
      console.log('Visibilidad del diálogo:', newVal)
    },
    value(newVal) {
      console.log('Valor cambiado:', newVal)
    },
  },
  computed: {
    formattedDate() {
      return this.buttondisplay ? this.buttondisplay.toLocaleDateString() : ''
    },
  },
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
