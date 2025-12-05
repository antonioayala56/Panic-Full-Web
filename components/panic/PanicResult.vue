<!-- components/panic/PanicResult.vue -->
<script setup lang="ts">
defineProps({
  grouped: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="space-y-10">

    <div
      v-for="(items, category) in grouped"
      :key="category"
      class="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-purple-500/20 shadow-lg"
    >

      <h2 class="text-2xl font-bold text-purple-400 mb-4">
        {{ category }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="c in items" :key="c.code" 
          class="p-5 rounded-xl bg-black/20 border border-white/10 hover:border-cyan-400/30 transition">

          <div class="flex items-center justify-between mb-2">
            <p class="text-xl font-bold text-white">{{ c.code }}</p>
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

          <p class="text-gray-300 mt-1">{{ c.component }}</p>

          <p class="text-cyan-300 text-sm mt-2">
            Modelos: {{ c.models?.join(", ") || "–" }}
          </p>

          <div class="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p class="text-blue-300 text-xs font-semibold mb-1">SOLUCIÓN:</p>
            <p class="text-gray-200 text-sm leading-relaxed">
              {{ c.solution }}
            </p>
          </div>

          <div v-if="c.notes" class="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <p class="text-yellow-300 text-xs font-semibold mb-1">NOTAS:</p>
            <p class="text-gray-300 text-xs">{{ c.notes }}</p>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>
