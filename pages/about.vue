<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-8 text-center">
      Acerca de <span class="text-orange-400">iPanic Reader Web</span>
    </h1>

    <div class="grid gap-8">
      <!-- Descripción principal -->
      <div class="card-pro">
        <h2 class="text-2xl font-semibold mb-4 text-neon-blue">¿Qué es iPanic Reader Web?</h2>
        <p class="text-gray-300 leading-relaxed mb-4">
          iPanic Reader Web es un analizador profesional de Panic Logs para dispositivos iPhone, 
          diseñado específicamente para técnicos de reparación y profesionales del sector.
        </p>
        <p class="text-gray-300 leading-relaxed">
          Funciona completamente en el navegador, sin necesidad de instalar software adicional, 
          y es compatible con modelos desde iPhone XS hasta iPhone 16 Pro Max.
        </p>
      </div>

      <!-- Características -->
      <div class="card-pro">
        <h2 class="text-2xl font-semibold mb-4 text-neon-purple">Características principales</h2>
        <ul class="space-y-3 text-gray-300">
          <li class="flex items-center gap-3">
            <div class="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Análisis en tiempo real de Panic Logs
          </li>
          <li class="flex items-center gap-3">
            <div class="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Base de datos actualizada con códigos de error
          </li>
          <li class="flex items-center gap-3">
            <div class="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Detección automática de modelo de iPhone
          </li>
          <li class="flex items-center gap-3">
            <div class="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Soluciones específicas para cada problema
          </li>
          <li class="flex items-center gap-3">
            <div class="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Exportación de reportes en PDF
          </li>
          <li class="flex items-center gap-3">
            <div class="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Interfaz drag & drop intuitiva
          </li>
        </ul>
      </div>

      <!-- Modelos compatibles -->
      <div class="card-pro">
        <h2 class="text-2xl font-semibold mb-4 text-neon-blue">Modelos compatibles</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
          <div>
            <h3 class="font-semibold text-white mb-2">Serie X</h3>
            <ul class="space-y-1">
              <li>iPhone X</li>
              <li>iPhone XS</li>
              <li>iPhone XS Max</li>
              <li>iPhone XR</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-2">Serie 11-12</h3>
            <ul class="space-y-1">
              <li>iPhone 11</li>
              <li>iPhone 11 Pro/Max</li>
              <li>iPhone 12</li>
              <li>iPhone 12 Pro/Max</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-2">Serie 13-14</h3>
            <ul class="space-y-1">
              <li>iPhone 13</li>
              <li>iPhone 13 Pro/Max</li>
              <li>iPhone 14</li>
              <li>iPhone 14 Pro/Max</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-2">Serie 15-16</h3>
            <ul class="space-y-1">
              <li>iPhone 15</li>
              <li>iPhone 15 Pro/Max</li>
              <li>iPhone 16</li>
              <li>iPhone 16 Pro/Max</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Cómo usar -->
      <div class="card-pro">
        <h2 class="text-2xl font-semibold mb-4 text-neon-purple">Cómo usar</h2>
        <ol class="space-y-3 text-gray-300">
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <span>Obtén el Panic Log del iPhone usando iTunes, 3uTools o Console.app</span>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <span>Ve a la página "Analizar" y arrastra el archivo o haz clic para seleccionarlo</span>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <span>Haz clic en "Analizar" para procesar el archivo</span>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <span>Revisa los resultados y las soluciones recomendadas</span>
          </li>
        </ol>
      </div>

      <!-- Información técnica -->
      <div class="card-pro">
        <h2 class="text-2xl font-semibold mb-4 text-neon-blue">Información técnica</h2>
        <div class="grid md:grid-cols-2 gap-6 text-gray-300">
          <div>
            <h3 class="font-semibold text-white mb-2">Tecnologías</h3>
            <ul class="space-y-1 text-sm">
              <li>• Nuxt 3 + Vue.js</li>
              <li>• Tailwind CSS</li>
              <li>• TypeScript</li>
              <li>• Procesamiento client-side</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-2">Privacidad</h3>
            <ul class="space-y-1 text-sm">
              <li>• Análisis 100% local</li>
              <li>• No se envían datos a servidores</li>
              <li>• Sin registro de archivos</li>
              <li>• Código abierto</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-pro {
  @apply bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-400/30 transition-all duration-300;
}
</style>