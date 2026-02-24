<!-- components/panic/PanicResult.vue -->
<script setup lang="ts">
defineProps({
  grouped: {
    type: Object,
    required: true
  },
  // NUEVO: Array de errores detectados individuales
  detected: {
    type: Array,
    default: () => []
  },
  // NUEVO: Códigos hex que aparecen explícitamente en el texto
  hexCodes: {
    type: Array,
    default: () => []
  }
})

// Helper para saber si un código viene del texto explícito o de keywords
function isExplicitCode(code: string, hexCodes: string[]) {
  return hexCodes.some(hex => 
    hex.toLowerCase() === code.toLowerCase() || 
    hex.toLowerCase().includes(code.toLowerCase()) ||
    code.toLowerCase().includes(hex.toLowerCase())
  )
}

// Helper para obtener badge de fuente
function getSourceBadge(code: string, hexCodes: string[]) {
  if (isExplicitCode(code, hexCodes)) {
    return { text: 'CÓDIGO HEX', class: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' }
  }
  return { text: 'ANÁLISIS IA', class: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
}
</script>

<template>
  <div class="space-y-10">
    <div
      v-for="(items, category) in grouped"
      :key="category"
      class="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-purple-500/20 shadow-lg"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-purple-400">
          {{ category }}
        </h2>
        <span class="text-sm text-gray-400">
          {{ items.length }} error{{ items.length > 1 ? 'es' : '' }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="c in items"
          :key="c.code"
          class="p-5 rounded-xl bg-black/20 border border-white/10 hover:border-cyan-400/30 transition relative overflow-hidden"
          :class="{ 'ring-2 ring-cyan-500/30': isExplicitCode(c.code, hexCodes) }"
        >
          <!-- Badge de fuente (NUEVO) -->
          <div class="absolute top-3 right-3">
            <span 
              class="px-2 py-1 rounded text-xs font-semibold border"
              :class="getSourceBadge(c.code, hexCodes).class"
            >
              {{ getSourceBadge(c.code, hexCodes).text }}
            </span>
          </div>

          <div class="flex items-center justify-between mb-2 pr-24">
            <p class="text-xl font-bold text-white font-mono">
              {{ c.code }}
            </p>
            <span
              class="px-2 py-1 rounded text-xs font-semibold"
              :class="{
                'bg-red-500/20 text-red-400': c.severity === 'critical',
                'bg-orange-500/20 text-orange-400': c.severity === 'high',
                'bg-yellow-500/20 text-yellow-400': c.severity === 'medium',
                'bg-green-500/20 text-green-400': c.severity === 'low'
              }"
            >
              {{ c.severity?.toUpperCase() || 'UNKNOWN' }}
            </span>
          </div>

          <!-- NUEVO: Barra de certeza -->
          <div class="mb-3">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-400">Certeza del diagnóstico</span>
              <span :class="{
                'text-green-400': (c.certainty || 0) >= 80,
                'text-yellow-400': (c.certainty || 0) >= 50 && (c.certainty || 0) < 80,
                'text-red-400': (c.certainty || 0) < 50
              }">
                {{ c.certainty || 0 }}%
              </span>
            </div>
            <div class="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                class="h-1.5 rounded-full transition-all duration-500"
                :class="{
                  'bg-green-500': (c.certainty || 0) >= 80,
                  'bg-yellow-500': (c.certainty || 0) >= 50 && (c.certainty || 0) < 80,
                  'bg-red-500': (c.certainty || 0) < 50
                }"
                :style="{ width: (c.certainty || 0) + '%' }"
              ></div>
            </div>
          </div>

          <p class="text-gray-300 mt-1">
            {{ c.component }}
          </p>

          <!-- NUEVO: Modelos afectados con badge si coincide con el detectado -->
          <p class="text-cyan-300 text-sm mt-2 flex items-center gap-2">
            <span>Modelos:</span>
            <span class="flex flex-wrap gap-1">
              <span 
                v-for="model in (c.models || ['–']).slice(0, 3)" 
                :key="model"
                class="px-1.5 py-0.5 rounded bg-white/5 text-xs"
              >
                {{ model }}
              </span>
              <span v-if="(c.models || []).length > 3" class="text-xs text-gray-500">
                +{{ c.models.length - 3 }} más
              </span>
            </span>
          </p>

          <div class="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p class="text-blue-300 text-xs font-semibold mb-1 flex items-center gap-2">
              <span>🔧</span>
              <span>SOLUCIÓN:</span>
            </p>
            <p class="text-gray-200 text-sm leading-relaxed">
              {{ c.solution }}
            </p>
          </div>

          <!-- NUEVO: Estado de confirmación -->
          <div v-if="c.status" class="mt-2 flex items-center gap-2">
            <span 
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-green-500': c.status === 'confirmado',
                'bg-yellow-500': c.status === 'corroborar',
                'bg-gray-500': c.status === 'investigando'
              }"
            ></span>
            <span class="text-xs" :class="{
              'text-green-400': c.status === 'confirmado',
              'text-yellow-400': c.status === 'corroborar',
              'text-gray-400': c.status === 'investigando'
            }">
              Estado: {{ c.status }}
            </span>
          </div>

          <div v-if="c.notes" class="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <p class="text-yellow-300 text-xs font-semibold mb-1 flex items-center gap-2">
              <span>📝</span>
              <span>NOTAS TÉCNICAS:</span>
            </p>
            <p class="text-gray-300 text-xs leading-relaxed">
              {{ c.notes }}
            </p>
          </div>

          <!-- NUEVO: Keywords que activaron este resultado (si aplica) -->
          <div v-if="c.keywords && c.keywords.length > 0 && !isExplicitCode(c.code, hexCodes)" class="mt-2 pt-2 border-t border-white/5">
            <p class="text-xs text-gray-500 mb-1">Detectado por:</p>
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="keyword in c.keywords.slice(0, 3)" 
                :key="keyword"
                class="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 text-xs"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- NUEVO: Mensaje cuando no hay errores críticos -->
    <div v-if="Object.keys(grouped).length === 0" class="text-center py-10">
      <div class="text-4xl mb-4">✅</div>
      <h3 class="text-xl text-green-400 font-bold mb-2">No se detectaron errores críticos</h3>
      <p class="text-gray-400">El análisis no encontró patrones de error reconocidos en este archivo.</p>
    </div>
  </div>
</template>
