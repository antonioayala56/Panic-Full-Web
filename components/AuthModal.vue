<!-- components/AuthModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              {{ isSignUp ? 'Crear cuenta' : 'Iniciar sesión' }}
            </h3>
            <button @click="closeModal" class="close-button">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- Botones de OAuth -->
            <div class="oauth-buttons">
              <button
                @click="signInWithGoogle"
                :disabled="authLoading"
                class="oauth-button google-button"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>

              <button
                @click="signInWithFacebook"
                :disabled="authLoading"
                class="oauth-button facebook-button"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continuar con Facebook
              </button>
            </div>

            <div class="divider">
              <span class="divider-text">o</span>
            </div>

            <!-- Formulario de email -->
            <form @submit.prevent="handleEmailSubmit" class="email-form">
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  class="form-input"
                  placeholder="tu@email.com"
                />
              </div>

              <div class="form-group">
                <label for="password" class="form-label">Contraseña</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  class="form-input"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                :disabled="authLoading"
                class="submit-button"
              >
                {{ authLoading ? 'Cargando...' : (isSignUp ? 'Crear cuenta' : 'Iniciar sesión') }}
              </button>
            </form>

            <!-- Toggle entre login/signup -->
            <div class="toggle-auth">
              <button @click="toggleMode" class="toggle-button">
                {{ isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate' }}
              </button>
            </div>

            <!-- Error message -->
            <div v-if="authError" class="error-message">
              {{ authError }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const { signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail, loading: authLoading, error: authError, clearError } = useAuth()

const isSignUp = ref(false)
const email = ref('')
const password = ref('')

const closeModal = () => {
  emit('update:show', false)
  resetForm()
}

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  clearError()
}

const handleEmailSubmit = async () => {
  if (isSignUp.value) {
    await signUpWithEmail(email.value, password.value)
  } else {
    await signInWithEmail(email.value, password.value)
  }

  if (!authError.value) {
    closeModal()
  }
}

const resetForm = () => {
  email.value = ''
  password.value = ''
  clearError()
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm;
}

.modal-content {
  @apply bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700;
}

.modal-title {
  @apply text-xl font-semibold text-gray-900 dark:text-white;
}

.close-button {
  @apply p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors;
}

.modal-body {
  @apply p-6 space-y-6;
}

.oauth-buttons {
  @apply space-y-3;
}

.oauth-button {
  @apply w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed;
}

.google-button {
  @apply bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400;
}

.facebook-button {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.divider {
  @apply relative text-center;
}

.divider-text {
  @apply bg-white dark:bg-gray-800 px-4 text-sm text-gray-500 dark:text-gray-400;
}

.divider::before {
  content: '';
  @apply absolute top-1/2 left-0 right-0 h-px bg-gray-300 dark:bg-gray-600;
}

.email-form {
  @apply space-y-4;
}

.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white;
}

.submit-button {
  @apply w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50;
}

.toggle-auth {
  @apply text-center;
}

.toggle-button {
  @apply text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium;
}

.error-message {
  @apply text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg;
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  @apply transition-all duration-300;
}

.modal-enter-from,
.modal-leave-to {
  @apply opacity-0 scale-95;
}

.modal-enter-to,
.modal-leave-from {
  @apply opacity-100 scale-100;
}
</style>