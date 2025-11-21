<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Título de la página a la izquierda -->
      <div class="header-left">
        <span class="page-title">{{ currentPageTitle }}</span>
      </div>

      <!-- Información de sesión al centro -->
      <div class="header-center">
        <div class="session-timer" :class="timerClass">
          <i class="pi pi-clock timer-icon" />
          <span class="timer-text"> Sesión: {{ formattedTime }} </span>
        </div>
      </div>

      <!-- Información de usuario a la derecha -->
      <div class="header-right">
        <div class="user-info">
          <i class="pi pi-user user-icon" />
          <span class="user-name">{{ userName }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const toast = useToast()

// Constantes
const SESSION_DURATION = 3600 // 1 hora en segundos
const WARNING_THRESHOLD = 600 // 10 minutos para advertencia
const CRITICAL_THRESHOLD = 300 // 5 minutos para crítico

const remainingTime = ref(SESSION_DURATION)
let lastUpdateTime = Date.now()
let animationFrameId = null

// Clase computada para el timer
const timerClass = computed(() => {
  if (remainingTime.value <= CRITICAL_THRESHOLD) return 'critical'
  if (remainingTime.value <= WARNING_THRESHOLD) return 'warning'
  return ''
})

// Obtener nombre de usuario desde localStorage
const userName = computed(() => {
  return localStorage.getItem('userName') || 'Usuario'
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
  const titles = {
    Home: 'Inicio',
    Users: 'Gestión de Usuarios',
    Receptions: 'Recepción',
    Polices: 'Policía',
    Institutions: 'Institución',
    Storages: 'Ubicación de Bodegas',
    TypesSubstances: 'Tipo de Sustancia',
    Unities: 'Unidades',
    Communes: 'Comunas',
    Locations: 'Locaciones',
    Packagings: 'Tipos de Contenedor',
    MethodsDestructions: 'Métodos de Destrucción',
    Grades: 'Grados',
    Destinations: 'Destinos',
    Storage: 'Almacenamiento',
    PreAnalisis: 'Preanálisis',
  }
  return titles[routeName] || ' '
})

// Sistema de tiempo preciso usando requestAnimationFrame
const updateTimer = () => {
  const now = Date.now()
  const elapsed = Math.floor((now - lastUpdateTime) / 1000)

  if (elapsed > 0) {
    remainingTime.value = Math.max(0, remainingTime.value - elapsed)
    lastUpdateTime = now
    saveTimerState()

    // Verificar estados críticos
    checkCriticalStates()
  }

  animationFrameId = requestAnimationFrame(updateTimer)
}

// Verificar estados críticos y mostrar advertencias
const checkCriticalStates = () => {
  // Solo mostrar advertencias una vez cuando se cruzan los umbrales
  if (remainingTime.value === WARNING_THRESHOLD) {
    showSessionWarning('Tu sesión expirará en 10 minutos', 'warn')
  }
  if (remainingTime.value === CRITICAL_THRESHOLD) {
    showSessionWarning('¡Sesión por expirar! 5 minutos restantes', 'error')
  }
  if (remainingTime.value === 0) {
    logoutUser()
  }
}

// Mostrar advertencia de sesión
const showSessionWarning = (message, severity = 'warn') => {
  toast.add({
    severity: severity,
    summary: 'Sesión',
    detail: message,
    life: 10000, // 10 segundos
    closable: true,
  })
}

// Inicializar temporizador
const initTimer = () => {
  // Cargar estado guardado
  const savedTime = localStorage.getItem('sessionTime')
  const savedLastUpdate = localStorage.getItem('sessionLastUpdate')

  if (savedTime && savedLastUpdate) {
    const elapsed = Math.floor((Date.now() - parseInt(savedLastUpdate)) / 1000)
    remainingTime.value = Math.max(0, parseInt(savedTime) - elapsed)
    console.log(`⏰ Tiempo cargado: ${remainingTime.value}s, transcurrido: ${elapsed}s`)
  } else {
    remainingTime.value = SESSION_DURATION
    console.log('⏰ Nueva sesión iniciada: 1 hora')
  }

  lastUpdateTime = Date.now()
  saveTimerState()

  // Iniciar sistema de tiempo preciso
  animationFrameId = requestAnimationFrame(updateTimer)
}

// Guardar estado del temporizador
const saveTimerState = () => {
  localStorage.setItem('sessionTime', remainingTime.value.toString())
  localStorage.setItem('sessionLastUpdate', lastUpdateTime.toString())
}

// Cerrar sesión del usuario
const logoutUser = () => {
  console.log('🔒 Cerrando sesión por tiempo expirado')

  // Limpiar recursos
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  // Limpiar localStorage
  const sessionKeys = [
    'userName',
    'sessionTime',
    'sessionLastUpdate',
    'token',
    'userRole',
    'userId',
    'userEmail',
    'userRut',
    'userData',
  ]

  sessionKeys.forEach((key) => localStorage.removeItem(key))
  sessionStorage.clear()

  // Mostrar mensaje final
  toast.add({
    severity: 'info',
    summary: 'Sesión Expirada',
    detail: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    life: 5000,
  })

  // Redirigir al login después de un breve delay
  setTimeout(() => {
    window.location.href = '/'
  }, 2000)
}

// Ciclo de vida
onMounted(() => {
  initTimer()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
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
  font-weight: 500;
}

.session-timer.warning {
  background: #fff3cd;
  border-color: #ffc107;
  color: #856404;
  animation: pulse 2s infinite;
}

.session-timer.critical {
  background: #f8d7da;
  border-color: #dc3545;
  color: #721c24;
  animation: pulse 1s infinite;
  font-weight: 600;
}

.timer-icon {
  font-size: 0.9rem;
}

.session-timer.warning .timer-icon {
  color: #856404;
}

.session-timer.critical .timer-icon {
  color: #721c24;
}

.timer-text {
  font-size: 0.875rem;
  font-weight: inherit;
}

.session-timer.warning .timer-text {
  color: #856404;
}

.session-timer.critical .timer-text {
  color: #721c24;
}

/* Animación de pulso para estados críticos */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
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

  .session-timer,
  .user-info {
    padding: 0.4rem 0.8rem;
  }
}
</style>
