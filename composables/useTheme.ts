// composables/useTheme.ts
import { ref, computed, onMounted, watch } from 'vue'

export const useTheme = () => {
  const theme = ref<'light' | 'dark'>('dark')

  // Get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (process.client) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark'
  }

  // Load theme from localStorage or system preference
  const loadTheme = () => {
    if (process.client) {
      const stored = localStorage.getItem('theme')
      if (stored === 'light' || stored === 'dark') {
        theme.value = stored
      } else {
        theme.value = getSystemTheme()
      }
    }
  }

  // Save theme to localStorage
  const saveTheme = (newTheme: 'light' | 'dark') => {
    if (process.client) {
      localStorage.setItem('theme', newTheme)
    }
  }

  // Apply theme class to document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (process.client) {
      const html = document.documentElement
      if (newTheme === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  // Set theme manually
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  // Watch for theme changes and apply
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
    saveTheme(newTheme)
  }, { immediate: true })

  // Listen for system preference changes
  onMounted(() => {
    if (process.client) {
      loadTheme()
      applyTheme(theme.value)

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        // Only update if no manual preference stored
        const stored = localStorage.getItem('theme')
        if (!stored) {
          theme.value = e.matches ? 'dark' : 'light'
        }
      }

      mediaQuery.addEventListener('change', handleChange)

      // Cleanup
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  })

  return {
    theme: computed(() => theme.value),
    toggleTheme,
    setTheme,
    isDark: computed(() => theme.value === 'dark'),
    isLight: computed(() => theme.value === 'light')
  }
}
