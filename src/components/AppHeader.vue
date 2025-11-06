<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Título de la página a la izquierda -->
      <div class="header-left">
        <span class="page-title">{{ currentPageTitle }}</span>
      </div>
      
      <!-- Información de sesión al centro -->
      <div class="header-center">
        <div class="session-timer" :class="{ 'warning': remainingTime <= 300 }">
          <font-awesome-icon icon="fa-solid fa-clock" class="timer-icon" />
          <span class="timer-text">
            Sesión: {{ formattedTime }}
          </span>
        </div>
      </div>
      
      <!-- Información de usuario a la derecha -->
      <div class="header-right">
        <div class="user-info">
          <font-awesome-icon icon="fa-solid fa-user" class="user-icon" />
          <span class="user-name">{{ userName }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const remainingTime = ref(3600) // 1 hora en segundos (3600)
let timerInterval = null

// Obtener nombre de usuario desde localStorage
const userName = computed(() => {
  return localStorage.getItem('userName') 
})

// Tiempo formateado en MM:SS
const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60)
  const seconds = remainingTime.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Título de la página
const currentPageTitle = computed(() => {
  const routeName = route.name
  switch (routeName) {
    case 'Home': return 'Inicio'
    case 'Users': return 'Gestión de Usuarios'
    case 'Receptions': return 'Recepción'
    case 'Polices': return 'Policía'
    case 'Institutions': return 'Institución'
    case 'Storages': return 'Ubicación de Bodegas'
    case 'TypesSubstances': return 'Tipo de Sustancia'
    case 'Unities': return 'Unidades'
    case 'Communes': return 'Comunas'
    case 'Locations': return 'Locaciones'
    case 'Packagings': return 'Tipos de Contenedor'
    case 'MethodsDestructions': return 'Métodos de Destrucción'
    case 'Grades': return 'Grados'
    case 'Destinations': return 'Destinos'
    default: return ' '
  }
})

// Inicializar y controlar el temporizador
const initTimer = () => {
  // Intentar recuperar el tiempo restante desde localStorage
  const savedTime = localStorage.getItem('sessionTime')
  const lastUpdate = localStorage.getItem('sessionLastUpdate')
  
  if (savedTime && lastUpdate) {
    const elapsed = Math.floor((Date.now() - parseInt(lastUpdate)) / 1000)
    remainingTime.value = Math.max(0, parseInt(savedTime) - elapsed)
  } else {
    // Nueva sesión - 1 hora
    remainingTime.value = 3600
    saveTimerState()
  }

  // Iniciar el contador
  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
      saveTimerState()
      
      // Mostrar alerta cuando queden 5 minutos
      if (remainingTime.value === 300) {
        showSessionWarning()
      }
      
      // Cerrar sesión automáticamente cuando llegue a 0
      if (remainingTime.value === 0) {
        logoutUser()
      }
    }
  }, 1000)
}

// Guardar estado del temporizador
const saveTimerState = () => {
  localStorage.setItem('sessionTime', remainingTime.value.toString())
  localStorage.setItem('sessionLastUpdate', Date.now().toString())
}

// Mostrar advertencia de sesión
const showSessionWarning = () => {
  // Puedes usar un toast, alert o modal aquí
  console.warn('⚠️ Tu sesión expirará en 5 minutos')
  // Ejemplo con PrimeVue Toast (si lo tienes instalado):
  // toast.add({ severity: 'warn', summary: 'Sesión', detail: 'Tu sesión expirará en 5 minutos', life: 5000 });
}

// Cerrar sesión del usuario
const logoutUser = () => {
  clearInterval(timerInterval)
  localStorage.removeItem('sessionTime')
  localStorage.removeItem('sessionLastUpdate')
  localStorage.removeItem('userName')
  // Redirigir al login
  window.location.href = '/login'
}

// Reiniciar el temporizador (ej: cuando el usuario hace una acción)

// Ciclo de vida
onMounted(() => {
  initTimer()
  

})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.app-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  height: 60px;
  position: fixed;
  top: 0;
  left: 270px;
  right: 0;
  z-index: 999;
  transition: left 0.3s ease;
}

.sidebar-collapsed ~ .app-header {
  left: 70px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 1.5rem;
}

.header-left {
  flex: 1;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

/* Estilos del temporizador de sesión */
.session-timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 20px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.session-timer.warning {
  background: #fff3cd;
  border-color: #ffc107;
  color: #856404;
}

.timer-icon {
  font-size: 0.9rem;
  color: #6c757d;
}

.session-timer.warning .timer-icon {
  color: #856404;
}

.timer-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
}

.session-timer.warning .timer-text {
  color: #856404;
  font-weight: 600;
}

/* Estilos de información de usuario */
.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #e7f3ff;
  border-radius: 20px;
  border: 1px solid #b3d9ff;
}

.user-icon {
  font-size: 0.9rem;
  color: #0066cc;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0066cc;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 0.5rem;
    gap: 0.5rem;
  }
  
  .header-left,
  .header-center,
  .header-right {
    flex: none;
    justify-content: center;
    width: 100%;
  }
  
  .page-title {
    font-size: 1.1rem;
    text-align: center;
  }
}
</style>