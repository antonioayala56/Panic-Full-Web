<!-- components/ui/NavBar.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from '#imports'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { user, signOut } = useAuth()
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

      <!-- Auth Button -->
      <div class="auth-section">
        <button v-if="!user" @click="showAuthModal = true" class="auth-button">
          Iniciar sesión
        </button>
        <div v-else class="user-menu">
          <span class="user-name">{{ user.displayName || user.email }}</span>
          <button @click="signOut" class="logout-button">
            Cerrar sesión
          </button>
        </div>
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
  @apply sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10;
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
  @apply text-xl font-bold text-white tracking-wide;
}

.brand-accent {
  @apply text-orange-400;
}

.navbar-nav {
  @apply hidden md:flex items-center space-x-8;
}

.nav-link {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-decoration-none;
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
  @apply p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors;
}

.menu-icon {
  @apply w-6 h-6;
}

.auth-section {
  @apply hidden md:flex items-center;
}

.auth-button {
  @apply px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all;
}

.user-menu {
  @apply flex items-center gap-3;
}

.user-name {
  @apply text-white font-medium;
}

.logout-button {
  @apply px-3 py-1 text-orange-400 hover:text-orange-300 text-sm font-medium border border-orange-400/30 rounded hover:bg-orange-400/10 transition-colors;
}

.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
}
</style>