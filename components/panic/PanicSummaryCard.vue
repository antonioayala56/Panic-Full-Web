<!-- components/panic/PanicSummaryCard.vue -->
<script setup lang="ts">
defineProps({
  summary: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-cyan-500/20 shadow-lg">
    <h2 class="text-2xl font-bold text-orange-400 mb-6">
      Resumen del análisis
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-black/20 p-4 rounded-lg">
        <h3 class="text-sm text-gray-400 uppercase tracking-wide mb-2">
          Modelo detectado
        </h3>
        <p class="text-xl font-bold text-white">
          {{ summary.model || 'Desconocido' }}
        </p>
      </div>

      <div class="bg-black/20 p-4 rounded-lg">
        <h3 class="text-sm text-gray-400 uppercase tracking-wide mb-2">
          Severidad global
        </h3>
        <p
          class="text-xl font-bold"
          :class="{
            'text-red-400': summary.severity === 'critical',
            'text-orange-400': summary.severity === 'high',
            'text-yellow-300': summary.severity === 'medium',
            'text-green-400': summary.severity === 'low'
          }"
        >
          {{ summary.severity?.toUpperCase() || 'UNKNOWN' }}
        </p>
      </div>

      <div class="bg-black/20 p-4 rounded-lg">
        <h3 class="text-sm text-gray-400 uppercase tracking-wide mb-2">
          Problemas detectados
        </h3>
        <p class="text-xl font-bold text-white">
          {{ summary.total || 0 }}
        </p>
      </div>
    </div>

    <div v-if="summary.physicalRisk" class="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        <p class="text-red-400 font-semibold">
          ADVERTENCIA: Posible daño físico detectado
        </p>
      </div>
      <p class="text-red-300 text-sm mt-1">
        Se recomienda inspección física del dispositivo antes de continuar.
      </p>
    </div>
  </div>
</template>
