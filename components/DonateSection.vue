<!-- components/DonateSection.vue -->
<template>
  <section class="donate-section">
    <div class="container">
      <h2 class="section-title">¡Comprame un café! ☕</h2>
      <p class="section-description">
        Si esta herramienta te fue útil, considera apoyar al desarrollador con un café.
        Tu contribución ayuda a mantener y mejorar el proyecto.
      </p>

      <div class="donate-buttons">
        <button
          v-for="option in donateOptions"
          :key="option.amount"
          class="donate-button"
          @click="handleDonate(option.amount)"
          :disabled="loading"
        >
          <span class="coffee-icon">☕</span>
          <span class="amount">${{ option.amount.toLocaleString('es-AR') }}</span>
          <span class="label">{{ option.label }}</span>
        </button>
      </div>

      <p class="thank-you">¡Gracias por tu apoyo! 🙏</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const donateOptions = [
  { amount: 3000, label: 'Café pequeño' },
  { amount: 5000, label: 'Café mediano' },
  { amount: 10000, label: 'Café grande' }
]

const handleDonate = async (amount: number) => {
  loading.value = true
  try {
    const response = await $fetch('/api/donate', {
      method: 'POST',
      body: { amount }
    })

    // Redirect to MercadoPago
    window.location.href = (response as { init_point: string }).init_point
  } catch (error) {
    console.error('Error creating donation:', error)
    alert('Error al procesar la donación. Inténtalo de nuevo.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.donate-section {
  @apply py-16 bg-gradient-to-br from-orange-50 to-red-50 dark:from-red-900 dark:to-orange-800;
}

.container {
  @apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center;
}

.section-title {
  @apply text-3xl font-bold text-gray-900 dark:text-white mb-4;
}

.section-description {
  @apply text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto;
}

.donate-buttons {
  @apply flex flex-col sm:flex-row gap-4 justify-center items-center mb-8;
}

.donate-button {
  @apply flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-700 rounded-xl hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed;
}

.donate-button:hover {
  @apply transform scale-105;
}

.coffee-icon {
  @apply text-2xl;
}

.amount {
  @apply text-xl font-bold text-gray-900 dark:text-white;
}

.label {
  @apply text-sm text-gray-600 dark:text-gray-400;
}

.thank-you {
  @apply text-gray-500 dark:text-gray-400;
}
</style>