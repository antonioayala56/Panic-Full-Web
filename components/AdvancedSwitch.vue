<!-- components/AdvancedSwitch.vue -->
<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
  description?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  description: '',
  disabled: false
})

const emit = defineEmits<Emits>()

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <div class="advanced-switch-container">
    <div class="switch-content">
      <div v-if="label || description" class="switch-labels">
        <label v-if="label" class="switch-label">{{ label }}</label>
        <p v-if="description" class="switch-description">{{ description }}</p>
      </div>
      
      <button
        type="button"
        class="switch-button"
        :class="{
          'switch-enabled': modelValue,
          'switch-disabled': disabled
        }"
        :disabled="disabled"
        @click="toggle"
      >
        <span
          class="switch-thumb"
          :class="{
            'thumb-enabled': modelValue
          }"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.advanced-switch-container {
  @apply flex items-center;
}

.switch-content {
  @apply flex items-center justify-between w-full;
}

.switch-labels {
  @apply flex-1 mr-4;
}

.switch-label {
  @apply block text-sm font-medium text-gray-200 cursor-pointer;
}

.switch-description {
  @apply text-xs text-gray-400 mt-1;
}

.switch-button {
  @apply relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900;
  background-color: rgb(55 65 81);
}

.switch-button.switch-enabled {
  background-color: rgb(6 182 212);
}

.switch-button.switch-disabled {
  @apply opacity-50 cursor-not-allowed;
}

.switch-thumb {
  @apply pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out;
  transform: translateX(0);
}

.switch-thumb.thumb-enabled {
  transform: translateX(1.25rem);
}
</style>