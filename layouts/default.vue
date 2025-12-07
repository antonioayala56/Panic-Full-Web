<script setup>
// Importar manualmente si auto-import falla
import NavBar from '~/components/ui/NavBar.vue'
</script>

<template>
  <div class="min-h-screen bg-[#0c0f17] text-gray-200 flex flex-col">
    <!-- Navigation -->
    <NavBar />

    <!-- Page content -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">
              iPanic Reader Web
            </h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Analizador profesional de Panic Logs para técnicos avanzados.
              Compatible desde iPhone XS hasta 16 Pro Max.
            </p>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
              Enlaces
            </h4>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/" class="text-gray-400 hover:text-orange-400 transition text-sm">
                  Inicio
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/analyze" class="text-gray-400 hover:text-orange-400 transition text-sm">
                  Analizar
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/how-it-works" class="text-gray-400 hover:text-orange-400 transition text-sm">
                  Cómo funciona
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/about" class="text-gray-400 hover:text-orange-400 transition text-sm">
                  Acerca
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">
              Información
            </h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li>Versión: 2.0.0</li>
              <li>Modelos: iPhone XS - 16 Pro Max</li>
              <li>Análisis: 100% local</li>
              <li>Privacidad: Sin registro de datos</li>
            </ul>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-white/10 text-center">
          <p class="text-gray-500 text-sm">
            © 2024 iPanic Reader Web. Herramienta de análisis profesional para técnicos.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
