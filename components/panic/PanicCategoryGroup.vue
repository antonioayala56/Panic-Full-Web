<!-- components/panic/PanicCategoryGroup.vue -->
<script setup lang="ts">
import type { PanicEntry } from '~/server/engine/panic.engine'

import PanicCodeCard from './PanicCodeCard.vue'

defineProps<{
  category: string
  entries: PanicEntry[]
}>()
</script>

<template>
  <div class="category-group">
    <div class="category-header">
      <h2 class="category-title">
        {{ category }}
      </h2>
      <span class="entry-count">{{ entries.length }} problema{{ entries.length !== 1 ? 's' : '' }}</span>
    </div>

    <div class="entries-grid">
      <PanicCodeCard
        v-for="entry in entries"
        :key="entry.code"
        :entry="entry"
      />
    </div>
  </div>
</template>

<style scoped>
.category-group {
  @apply mb-8;
}

.category-header {
  @apply flex items-center justify-between mb-6 pb-3 border-b border-white/20;
}

.category-title {
  @apply text-2xl font-bold text-purple-400;
}

.entry-count {
  @apply bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium;
}

.entries-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}
</style>
