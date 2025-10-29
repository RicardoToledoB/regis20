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
              <h3>Iniciar Sesión</h3>
            </div>

            <form @submit.prevent="conectar">
              <div class="field">
                <label for="email">Correo Electrónico</label>
                <InputText
                  id="email"
                  v-model="user.email"
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  class="w-full p-inputtext-lg"
                  :class="{ 'p-invalid': errors.email }"
                />
                <small class="p-error" v-if="errors.email">{{ errors.email }}</small>
              </div>

              <div class="field">
                <label for="password">Contraseña</label>
                <Password
                  id="password"
                  v-model="user.password"
                  placeholder="Ingresa tu contraseña"
                  :feedback="false"
                  toggleMask
                  class="w-full p-inputtext-lg"
                  :class="{ 'p-invalid': errors.password }"
                  inputClass="w-full"
                />
                <small class="p-error" v-if="errors.password">{{ errors.password }}</small>
              </div>

              <Button
                type="submit"
                label="Iniciar Sesión"
                class="w-full login-button"
                :loading="isLoading"
              />
            </form>

            <small class="p-error" v-if="error" style="margin-top: 10px; display: block;">
              {{ error }}
            </small>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()

const user = reactive({
  email: "",
  password: "",
  grant_type: "password"
})

const errors = reactive({
  email: "",
  password: ""
})

const isLoading = ref(false)
const error = ref("")

const validateForm = () => {
  errors.email = user.email ? "" : "El correo electrónico es requerido"
  errors.password = user.password ? "" : "La contraseña es requerida"
  return !errors.email && !errors.password
}

const conectar = () => {
  if (!validateForm()) return

  error.value = ""
  isLoading.value = true

  axios.post("auth/login", {
    email: user.email,
    password: user.password,
   // grant_type: user.grant_type,
  })
    .then((response) => {
    const data = response.data
      console.log('algo');
      
    // ✅ Guardamos info del usuario 
    localStorage.setItem("token", data.token)
    
    // ✅ Redirección según el rol del usuario
    router.push("/inicio")
    
  })
     .catch((err) => {
    if (err.response?.status === 403) {
      error.value = "No autorizado. Contacte al administrador."
    } else {
      error.value = "Usuario y/o contraseña incorrecta"
    }
  })
    .finally(() => {
    isLoading.value = false
  })
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