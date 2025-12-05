import { modelMap } from '~/core/model-map'

export default async function modelDetect(code: string): Promise<string> {
  // Simple detection based on keywords in code
  const lowerCode = code.toLowerCase()

  if (lowerCode.includes('import react') || lowerCode.includes('from "react"') || lowerCode.includes('from \'react\'')) {
    return modelMap.react
  }
  if (lowerCode.includes('vue') || lowerCode.includes('new vue') || lowerCode.includes('createapp')) {
    return modelMap.vue
  }
  if (lowerCode.includes('angular') || lowerCode.includes('ngmodule') || lowerCode.includes('@angular')) {
    return modelMap.angular
  }
  if (lowerCode.includes('svelte') || lowerCode.includes('<script lang="ts">') || lowerCode.includes('import { onMount } from \'svelte\'')) {
    return modelMap.svelte
  }
  if (lowerCode.includes('next') || lowerCode.includes('next.js') || lowerCode.includes('export default function')) {
    return modelMap.next
  }
  if (lowerCode.includes('nuxt') || lowerCode.includes('nuxt.js') || lowerCode.includes('definepage')) {
    return modelMap.nuxt
  }
  if (lowerCode.includes('astro') || lowerCode.includes('astro.js') || lowerCode.includes('---')) {
    return modelMap.astro
  }
  if (lowerCode.includes('sveltekit') || lowerCode.includes('svelte-kit')) {
    return modelMap.sveltekit
  }
  if (lowerCode.includes('remix') || lowerCode.includes('remix.run')) {
    return modelMap.remix
  }
  if (lowerCode.includes('qwik') || lowerCode.includes('qwik.js')) {
    return modelMap.qwik
  }
  if (lowerCode.includes('solid') || lowerCode.includes('solidjs')) {
    return modelMap.solid
  }
  if (lowerCode.includes('lit') || lowerCode.includes('lit-element')) {
    return modelMap.lit
  }
  if (lowerCode.includes('preact') || lowerCode.includes('preact.js')) {
    return modelMap.preact
  }
  if (lowerCode.includes('alpine') || lowerCode.includes('alpine.js')) {
    return modelMap.alpine
  }

  // Default if no match
  return 'Unknown'
}