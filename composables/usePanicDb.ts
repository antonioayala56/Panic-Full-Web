// composables/usePanicDb.ts
import { ref, readonly } from 'vue'
import type { PanicEntry } from '~/server/engine/panic.engine'

export const usePanicDb = () => {
  const panicCodes = ref<PanicEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadDatabase = async (url?: string) => {
    loading.value = true
    error.value = null

    try {
      const dbUrl = url || '/api/panic-db'
      const response = await $fetch<PanicEntry[]>(dbUrl)
      panicCodes.value = response
    } catch (err) {
      error.value = 'Error cargando la base de datos'
      console.error('Error loading panic database:', err)
    } finally {
      loading.value = false
    }
  }

  const searchCode = (code: string): PanicEntry | undefined => {
    return panicCodes.value.find(entry => 
      entry.code.toLowerCase() === code.toLowerCase()
    )
  }

  const searchByComponent = (component: string): PanicEntry[] => {
    return panicCodes.value.filter(entry =>
      entry.component.toLowerCase().includes(component.toLowerCase())
    )
  }

  const getByModel = (model: string): PanicEntry[] => {
    return panicCodes.value.filter(entry =>
      entry.models?.some(m => m.toLowerCase().includes(model.toLowerCase()))
    )
  }

  const getBySeverity = (severity: string): PanicEntry[] => {
    return panicCodes.value.filter(entry =>
      entry.severity === severity
    )
  }

  return {
    panicCodes: readonly(panicCodes),
    loading: readonly(loading),
    error: readonly(error),
    loadDatabase,
    searchCode,
    searchByComponent,
    getByModel,
    getBySeverity
  }
}