<!-- components/panic/PanicCodeCard.vue -->
<script setup lang="ts">
import type { PanicEntry } from '~/server/engine/panic.engine'

defineProps<{
  entry: PanicEntry
}>()
</script>

<template>
  <div class="panic-code-card">
    <div class="card-header">
      <h3 class="code-title">{{ entry.code }}</h3>
      <span 
        class="severity-badge"
        :class="{
          'severity-critical': entry.severity === 'critical',
          'severity-high': entry.severity === 'high',
          'severity-medium': entry.severity === 'medium',
          'severity-low': entry.severity === 'low'
        }"
      >
        {{ entry.severity?.toUpperCase() }}
      </span>
    </div>

    <p class="component-name">{{ entry.component }}</p>

    <div v-if="entry.models?.length" class="models-section">
      <h4 class="section-title">Modelos compatibles:</h4>
      <div class="models-grid">
        <span 
          v-for="model in entry.models" 
          :key="model"
          class="model-tag"
        >
          {{ model }}
        </span>
      </div>
    </div>

    <div class="solution-section">
      <h4 class="section-title">Solución:</h4>
      <p class="solution-text">{{ entry.solution }}</p>
    </div>

    <div v-if="entry.notes" class="notes-section">
      <h4 class="section-title">Notas técnicas:</h4>
      <p class="notes-text">{{ entry.notes }}</p>
    </div>

    <div class="metadata">
      <span class="certainty">Certeza: {{ entry.certainty || 'N/A' }}%</span>
      <span class="status" :class="`status-${entry.status}`">
        {{ entry.status || 'unknown' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.panic-code-card {
  @apply bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-cyan-400/30 transition-all duration-300;
}

.card-header {
  @apply flex items-center justify-between mb-4;
}

.code-title {
  @apply text-xl font-bold text-white;
}

.severity-badge {
  @apply px-3 py-1 rounded-full text-xs font-semibold uppercase;
}

.severity-critical {
  @apply bg-red-500/20 text-red-400 border border-red-500/30;
}

.severity-high {
  @apply bg-orange-500/20 text-orange-400 border border-orange-500/30;
}

.severity-medium {
  @apply bg-yellow-500/20 text-yellow-400 border border-yellow-500/30;
}

.severity-low {
  @apply bg-green-500/20 text-green-400 border border-green-500/30;
}

.component-name {
  @apply text-gray-300 mb-4 font-medium;
}

.models-section {
  @apply mb-4;
}

.section-title {
  @apply text-sm font-semibold text-orange-400 mb-2 uppercase tracking-wide;
}

.models-grid {
  @apply flex flex-wrap gap-2;
}

.model-tag {
  @apply bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs border border-blue-500/30;
}

.solution-section {
  @apply mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg;
}

.solution-text {
  @apply text-gray-200 text-sm leading-relaxed;
}

.notes-section {
  @apply mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg;
}

.notes-text {
  @apply text-gray-300 text-xs leading-relaxed;
}

.metadata {
  @apply flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-white/10;
}

.status-confirmado {
  @apply text-green-400;
}

.status-corroborar {
  @apply text-yellow-400;
}
</style>