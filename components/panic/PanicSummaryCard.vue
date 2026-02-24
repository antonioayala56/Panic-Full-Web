<!-- components/panic/PanicSummaryCard.vue -->
<script setup lang="ts">
defineProps({
  summary: {
    type: Object,
    required: true
  }
})

// Helper para icono de severidad
function getSeverityIcon(severity: string) {
  const icons: Record<string, string> = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢'
  }
  return icons[severity] || '⚪'
}

// Helper para mensaje de severidad
function getSeverityMessage(severity: string) {
  const messages: Record<string, string> = {
    critical: 'Daño potencial - Acción inmediata requerida',
    high: 'Requiere reparación - No postergar',
    medium: 'Inestabilidad ocasional - Monitorear',
    low: 'Problemas menores - Bajo riesgo'
  }
  return messages[severity] || 'Severidad desconocida'
}
</script>

<template>
  <div class="p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-cyan-500/20 shadow-lg">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-orange-400">
        Resumen del análisis
      </h2>
      <!-- NUEVO: Badge de confianza global -->
      <div 
        v-if="summary.confidence !== undefined"
        class="px-3 py-1 rounded-full text-sm font-semibold"
        :class="{
          'bg-green-500/20 text-green-400': summary.confidence >= 80,
          'bg-yellow-500/20 text-yellow-400': summary.confidence >= 50 && summary.confidence < 80,
          'bg-red-500/20 text-red-400': summary.confidence < 50
        }"
      >
        Confianza: {{ summary.confidence }}%
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Modelo detectado -->
      <div class="bg-black/20 p-4 rounded-lg">
        <h3 class="text-sm text-gray-400 uppercase tracking-wide mb-2">
          Modelo detectado
        </h3>
        <p class="text-xl font-bold text-white">
          {{ summary.model || 'Desconocido' }}
        </p>
        <p v-if="summary.model && summary.model !== 'Desconocido'" class="text-xs text-green-400 mt-1">
          ✓ Identificado por product string
        </p>
      </div>

      <!-- Severidad global -->
      <div class="bg-black/20 p-4 rounded-lg">
        <h3 class="text-sm text-gray-400 uppercase tracking-wide mb-2">
          Severidad global
        </h3>
        <div class="flex items-center gap-2">
          <span class="text-2xl">{{ getSeverityIcon(summary.severity) }}</span>
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
        <p class="text-xs text-gray-400 mt-1">
          {{ getSeverityMessage(summary.severity) }}
        </p>
      </div>

      <!-- Problemas detectados -->
      <div class="bg-black/20 p-4 rounded-lg">
        <h3 class="text-sm text-gray-400 uppercase tracking-wide mb-2">
          Problemas detectados
        </h3>
        <p class="text-3xl font-bold text-white">
          {{ summary.total || 0 }}
        </p>
        <p class="text-xs text-gray-400 mt-1">
          códigos de error encontrados
        </p>
      </div>

      <!-- NUEVO: Tipo de análisis -->
      <div class="bg-black/20 p-4 rounded-lg">
        <h3 class="text-sm text-gray-400 uppercase tracking-wide mb-2">
          Método de análisis
        </h3>
        <div class="flex items-center gap-2">
          <span class="text-xl">🔍</span>
          <p class="text-lg font-bold text-cyan-400">
            {{ summary.hexCodesFound?.length > 0 ? 'Híbrido' : 'Heurístico' }}
          </p>
        </div>
        <p class="text-xs text-gray-400 mt-1">
          {{ summary.hexCodesFound?.length > 0 
            ? 'Códigos hex + keywords' 
            : 'Basado en descripción textual' }}
        </p>
      </div>
    </div>

    <!-- NUEVO: Alerta de daño físico mejorada -->
    <div v-if="summary.physicalRisk || summary.severity === 'critical'" class="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
      <div class="flex items-start gap-3">
        <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse mt-1" />
        <div>
          <p class="text-red-400 font-semibold">
            ⚠️ ADVERTENCIA: Posible daño físico detectado
          </p>
          <p class="text-red-300 text-sm mt-1">
            Se detectaron errores de severidad crítica. Se recomienda inspección física 
            inmediata del dispositivo antes de cualquier intervención de software.
          </p>
          <p v-if="summary.total > 3" class="text-red-300/80 text-xs mt-2">
            Múltiples errores detectados ({{ summary.total }}) sugieren daño extendido o fallo catastrófico.
          </p>
        </div>
      </div>
    </div>

    <!-- NUEVO: Info adicional cuando hay poca confianza -->
    <div v-if="summary.confidence !== undefined && summary.confidence < 50" class="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
      <div class="flex items-start gap-3">
        <span class="text-yellow-400 text-xl">⚡</span>
        <div>
          <p class="text-yellow-400 font-semibold">
            Análisis de baja confianza
          </p>
          <p class="text-yellow-300 text-sm mt-1">
            Los patrones detectados no son concluyentes. Se recomienda análisis manual 
            por técnico experto o verificación con segundo método de diagnóstico.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
