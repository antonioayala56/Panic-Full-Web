<template>
  <div class="max-w-5xl mx-auto">
    <h1 class="text-4xl font-bold mb-8 text-center">
      Cómo funciona el <span class="text-orange-400">análisis</span>
    </h1>

    <div class="grid gap-8">
      <!-- Proceso de análisis -->
      <div class="card-pro">
        <h2 class="text-2xl font-semibold mb-6 text-neon-blue">
          Proceso de análisis
        </h2>

        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">
                Lectura del archivo
              </h3>
              <p class="text-gray-300">
                El sistema lee el contenido completo del Panic Log y lo prepara para el análisis.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">
                Detección de patrones
              </h3>
              <p class="text-gray-300">
                Busca códigos de error específicos, tanto en formato texto como hexadecimal, comparándolos con nuestra base de datos.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">
                Identificación del modelo
              </h3>
              <p class="text-gray-300">
                Analiza los códigos encontrados para determinar el modelo exacto de iPhone y su compatibilidad.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              4
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">
                Evaluación de severidad
              </h3>
              <p class="text-gray-300">
                Calcula la severidad global basándose en los problemas detectados y su impacto en el dispositivo.
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              5
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">
                Generación de soluciones
              </h3>
              <p class="text-gray-300">
                Proporciona soluciones específicas y pasos de reparación para cada problema identificado.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tipos de códigos -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="card-pro">
          <h2 class="text-xl font-semibold mb-4 text-neon-purple">
            Códigos de texto
          </h2>
          <p class="text-gray-300 mb-4">
            Códigos legibles que aparecen en los logs:
          </p>
          <div class="space-y-2 text-sm">
            <div class="bg-black/30 p-3 rounded-lg">
              <code class="text-cyan-300">Mic1</code>
              <p class="text-gray-400 mt-1">
                Problema con micrófono inferior
              </p>
            </div>
            <div class="bg-black/30 p-3 rounded-lg">
              <code class="text-cyan-300">TG0B</code>
              <p class="text-gray-400 mt-1">
                Telemetría de batería
              </p>
            </div>
            <div class="bg-black/30 p-3 rounded-lg">
              <code class="text-cyan-300">ANS2</code>
              <p class="text-gray-400 mt-1">
                Controlador NAND/NVMe
              </p>
            </div>
          </div>
        </div>

        <div class="card-pro">
          <h2 class="text-xl font-semibold mb-4 text-neon-purple">
            Códigos hexadecimales
          </h2>
          <p class="text-gray-300 mb-4">
            Códigos numéricos específicos por modelo:
          </p>
          <div class="space-y-2 text-sm">
            <div class="bg-black/30 p-3 rounded-lg">
              <code class="text-orange-300">0x800</code>
              <p class="text-gray-400 mt-1">
                Flex de carga (iPhone 13)
              </p>
            </div>
            <div class="bg-black/30 p-3 rounded-lg">
              <code class="text-orange-300">0x20000</code>
              <p class="text-gray-400 mt-1">
                Interposer (iPhone 14 Pro)
              </p>
            </div>
            <div class="bg-black/30 p-3 rounded-lg">
              <code class="text-orange-300">0x310000</code>
              <p class="text-gray-400 mt-1">
                USB-C (iPhone 16)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Niveles de severidad -->
      <div class="card-pro">
        <h2 class="text-2xl font-semibold mb-6 text-neon-blue">
          Niveles de severidad
        </h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-green-400 rounded-full" />
              <h3 class="font-semibold text-green-400">
                LOW
              </h3>
            </div>
            <p class="text-sm text-gray-300">
              Problemas menores que no afectan la funcionalidad principal
            </p>
          </div>

          <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-yellow-400 rounded-full" />
              <h3 class="font-semibold text-yellow-400">
                MEDIUM
              </h3>
            </div>
            <p class="text-sm text-gray-300">
              Problemas que pueden causar inestabilidad ocasional
            </p>
          </div>

          <div class="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-orange-400 rounded-full" />
              <h3 class="font-semibold text-orange-400">
                HIGH
              </h3>
            </div>
            <p class="text-sm text-gray-300">
              Problemas serios que requieren reparación inmediata
            </p>
          </div>

          <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-red-400 rounded-full" />
              <h3 class="font-semibold text-red-400">
                CRITICAL
              </h3>
            </div>
            <p class="text-sm text-gray-300">
              Problemas críticos que pueden causar daño permanente
            </p>
          </div>
        </div>
      </div>

      <!-- Base de datos -->
      <div class="card-pro">
        <h2 class="text-2xl font-semibold mb-4 text-neon-purple">
          Base de datos de códigos
        </h2>
        <p class="text-gray-300 mb-4">
          Nuestra base de datos contiene más de 50 códigos de error documentados,
          cada uno con información específica sobre:
        </p>

        <div class="grid md:grid-cols-2 gap-6">
          <ul class="space-y-2 text-gray-300">
            <li class="flex items-center gap-2">
              <div class="w-2 h-2 bg-cyan-400 rounded-full" />
              Componente afectado
            </li>
            <li class="flex items-center gap-2">
              <div class="w-2 h-2 bg-cyan-400 rounded-full" />
              Modelos compatibles
            </li>
            <li class="flex items-center gap-2">
              <div class="w-2 h-2 bg-cyan-400 rounded-full" />
              Nivel de certeza
            </li>
          </ul>

          <ul class="space-y-2 text-gray-300">
            <li class="flex items-center gap-2">
              <div class="w-2 h-2 bg-cyan-400 rounded-full" />
              Solución recomendada
            </li>
            <li class="flex items-center gap-2">
              <div class="w-2 h-2 bg-cyan-400 rounded-full" />
              Notas técnicas
            </li>
            <li class="flex items-center gap-2">
              <div class="w-2 h-2 bg-cyan-400 rounded-full" />
              Estado de verificación
            </li>
          </ul>
        </div>
      </div>

      <!-- Precisión -->
      <div class="card-pro">
        <h2 class="text-2xl font-semibold mb-4 text-neon-blue">
          Precisión del análisis
        </h2>
        <div class="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div class="text-3xl font-bold text-orange-400 mb-2">
              95%
            </div>
            <p class="text-gray-300">
              Precisión en detección de códigos confirmados
            </p>
          </div>
          <div>
            <div class="text-3xl font-bold text-purple-400 mb-2">
              85%
            </div>
            <p class="text-gray-300">
              Exactitud en identificación de modelo
            </p>
          </div>
          <div>
            <div class="text-3xl font-bold text-blue-400 mb-2">
              90%
            </div>
            <p class="text-gray-300">
              Efectividad de soluciones propuestas
            </p>
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
