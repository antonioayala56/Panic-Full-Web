<!-- components/ui/NavBar.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from '#imports'
import { useAuth } from '~/composables/useAuth'
import { useTheme } from '~/composables/useTheme'

const route = useRoute()
const { user, signOut } = useAuth()
const { toggleTheme, isDark } = useTheme()
const showAuthModal = ref(false)

const navigation = [
  { name: 'Inicio', href: '#', icon: '🏠', action: 'scrollToTop' },
  { name: 'Analizar', href: '#', icon: '🔍', action: 'scrollToAnalyze' },
  { name: 'Cómo funciona', href: '/how-it-works', icon: '⚙️' },
  { name: 'Acerca', href: '/about', icon: 'ℹ️' }
]

const isActive = (href: string) => {
  return route.path === href
}

const handleNavClick = (item: any) => {
  if (item.action === 'scrollToTop') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (item.action === 'scrollToAnalyze') {
    const element = document.querySelector('.analyze-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="navbar-brand">
        <NuxtLink to="/" class="brand-link">
          <div class="brand-icon">
            <div class="icon-gradient"></div>
          </div>
          <span class="brand-text">
            iPanic<span class="brand-accent">Reader</span>
          </span>
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <div class="navbar-nav">
        <a
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          class="nav-link"
          :class="{ 'nav-link-active': isActive(item.href) }"
          @click.prevent="handleNavClick(item)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
        </a>
      </div>

      <!-- Theme Toggle -->
      <div class="theme-toggle">
        <button @click="toggleTheme" class="theme-button">
          <svg v-if="isDark" class="theme-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
          <svg v-else class="theme-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </button>
      </div>

      <!-- Auth Button -->
      <div class="auth-section">
        <button v-if="!user" @click="showAuthModal = true" class="auth-button">
          Iniciar sesión
        </button>
        <button v-else @click="showAuthModal = true" class="user-button">
          {{ user.displayName || user.email }}
        </button>
      </div>

      <!-- Mobile menu button -->
      <div class="mobile-menu-button">
        <button type="button" class="menu-button">
          <span class="sr-only">Abrir menú</span>
          <svg class="menu-icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Auth Modal -->
    <AuthModal v-model:show="showAuthModal" />
  </nav>
</template>

<style scoped>
.navbar {
  @apply sticky top-0 z-50 backdrop-blur-md bg-white/10 dark:bg-black/20 border-b border-gray-200 dark:border-white/10;
}

.navbar-container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16;
}

.navbar-brand {
  @apply flex-shrink-0;
}

.brand-link {
  @apply flex items-center gap-3 text-decoration-none;
}

.brand-icon {
  @apply relative w-10 h-10 rounded-xl overflow-hidden;
}

.icon-gradient {
  @apply w-full h-full bg-gradient-to-br from-orange-400 via-red-500 to-yellow-600;
}

.brand-text {
  @apply text-xl font-bold text-gray-900 dark:text-white tracking-wide;
}

.brand-accent {
  @apply text-orange-400;
}

.navbar-nav {
  @apply hidden md:flex items-center space-x-8;
}

.nav-link {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200 text-decoration-none;
}

.nav-link-active {
  @apply text-orange-400 bg-orange-400/10 border border-orange-400/20;
}

.nav-icon {
  @apply text-sm;
}

.nav-text {
  @apply font-medium;
}

.mobile-menu-button {
  @apply md:hidden;
}

.menu-button {
  @apply p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors;
}

.menu-icon {
  @apply w-6 h-6;
}

.theme-toggle {
  @apply hidden md:flex items-center;
}

.theme-button {
  @apply p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200;
}

.theme-icon {
  @apply w-5 h-5;
}

.auth-section {
  @apply hidden md:flex items-center;
}

.auth-button {
  @apply px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all;
}

.user-button {
  @apply px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-all border border-gray-200 dark:border-white/20;
}

.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
}
</style>