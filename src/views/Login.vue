<template>
  <div class="login-container">
    <div class="login-background">
      <div class="login-center-section">
        <div class="login-content">
          <div class="logo-section">
            <img src="../../public/ssm/logo-ssm.png" alt="Logo" class="logo" />
            <div class="app-name">REGIS20</div>
            <div class="app-tagline">Sistema LEY 20.000</div>
          </div>

          <div class="login-form">
            <div class="form-header">
              <h1>Iniciar Sesión</h1>
             
            </div>

            <form @submit.prevent="handleLogin">
              <div class="field">
                <label for="email">Correo Electrónico</label>
                <InputText 
                  id="email"
                  v-model="form.email"
                  type="email" 
                  placeholder="Ingresa tu correo electrónico"
                  class="w-full"
                  :class="{ 'p-invalid': errors.email }"
                />
                <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
              </div>

              <div class="field">
                <div class="flex justify-content-between align-items-center">
                  <label for="password">Contraseña</label>
               
                </div>
                <Password 
                  id="password"
                  v-model="form.password"
                  placeholder="Ingresa tu contraseña"
                  :feedback="false"
                  toggleMask
                  class="w-full p-inputtext-lg"
                  :class="{ 'p-invalid': errors.password ,} "
                  inputClass="w-full"
                />
                <small class="p-error" v-if="errors.password">{{ errors.password }}</small>
              </div>

            

              <Button 
                type="button" 
                @click="$router.push('/inicio')"
                label="Iniciar Sesión" 
                class="w-full login-button"
                :loading="loading"
              />
            </form>

           
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

export default {
  name: 'LoginPage',
  components: {
    InputText,
    Password,
    Checkbox,
    Button
  },
  setup() {
    const router = useRouter()
    const loading = ref(false)
    
    const form = reactive({
      email: '',
      password: '',
      rememberMe: false
    })

    const errors = reactive({
      email: '',
      password: ''
    })

    const validateForm = () => {
      let isValid = true
      
      // Reset errors
      errors.email = ''
      errors.password = ''

      // Email validation
      if (!form.email) {
        errors.email = 'El correo electrónico es requerido'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errors.email = 'El correo electrónico no es válido'
        isValid = false
      }

      // Password validation
      if (!form.password) {
        errors.password = 'La contraseña es requerida'
        isValid = false
      } else if (form.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres'
        isValid = false
      }

      return isValid
    }

    const handleLogin = async () => {
      if (!validateForm()) {
        return
      }

      loading.value = true

      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Guardar en localStorage si rememberMe está activado
        if (form.rememberMe) {
          localStorage.setItem('user', JSON.stringify({ email: form.email }))
        } else {
          sessionStorage.setItem('user', JSON.stringify({ email: form.email }))
        }

        // Redirigir al dashboard
        router.push('/')
      } catch (error) {
        console.error('Error en login:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      loading,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--surface-ground) 0%, var(--surface-section) 100%);
}

.login-background {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-center-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-content {
  width: 100%;
  max-width: 400px;
}

.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  height: 80px;
  margin-bottom: 1rem;
}

.app-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.app-tagline {
  color: var(--text-color-secondary);
  font-size: 1rem;
}

.login-form {
  background: var(--surface-card);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--surface-border);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.form-header p {
  color: var(--text-color-secondary);
  margin: 0;
  font-size: 1rem;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.9rem;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.8rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.field-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.field-checkbox label {
  margin: 0;
  color: var(--text-color);
  font-size: 0.9rem;
}

.login-button {
  height: 3rem;
  font-size: 1rem;
  font-weight: 600;
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--surface-border);
}

.login-footer p {
  color: var(--text-color-secondary);
  margin: 0;
  font-size: 0.9rem;
}

.signup-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}

/* Animaciones */
.login-form {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Estilos para el componente Password */
:deep(.p-password) {
  width: 100%;
}

:deep(.p-password-input) {
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .login-center-section {
    padding: 1rem;
  }
  
  .login-form {
    padding: 2rem;
  }
  
  .logo {
    height: 60px;
  }
  
  .app-name {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
  }
  
  .logo {
    height: 50px;
  }
  
  .app-name {
    font-size: 1.75rem;
  }
}
</style>