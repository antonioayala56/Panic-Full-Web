<!-- pages/index.vue - MATRIX RAIN ARREGLADO -->
<template>
  <div class="page-wrapper">
    <!-- Matrix Rain Background - AHORA CON Z-INDEX CORRECTO -->
    <div class="matrix-rain">
      <div 
        v-for="i in 15" 
        :key="i" 
        class="matrix-column" 
        :style="{ 
          left: (i * 6.66) + '%', 
          animationDelay: (Math.random() * 5) + 's',
          animationDuration: (8 + Math.random() * 4) + 's'
        }"
      >
        <div 
          v-for="j in 20" 
          :key="j" 
          class="matrix-char" 
          :style="{ animationDelay: (j * 0.15) + 's' }"
        >
          {{ ['0', '1'][Math.floor(Math.random() * 2)] }}
        </div>
      </div>
    </div>

    <!-- Contenido principal - AHORA CON Z-INDEX MAYOR -->
    <div class="content-layer">
      <div class="text-center py-12">
        <h1 class="text-5xl font-bold mb-6 tracking-wide drop-shadow">
          Bienvenido a <span class="text-cyan-400 glow-text">PanicFull PRO</span>
        </h1>

        <p class="text-gray-400 max-w-2xl mx-auto text-lg mb-10">
          Analizador profesional de Panic Logs para técnicos avanzados.
          Compatible desde iPhone XS hasta <span class="text-cyan-400">17 Pro Max</span>.
        </p>

        <div class="mt-8 opacity-80">
          <p class="hero-line">
            <span class="hero-icon">🔧</span>
            Herramientas de diagnóstico avanzado para técnicos profesionales de iPhone
          </p>
        </div>
      </div>

      <!-- Sección de análisis -->
      <div class="analyze-section">
        <!-- ... resto del contenido igual ... -->
      </div>

      <DonateSection />
    </div>
  </div>
</template>

<style scoped>
/* CONTENEDOR PRINCIPAL */
.page-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

/* MATRIX RAIN - AHORA CORRECTAMENTE POSICIONADO */
.matrix-rain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0; /* Detrás de todo */
  overflow: hidden;
  opacity: 0.15; /* Más sutil para no distraer */
}

.matrix-column {
  position: absolute;
  top: -100px;
  width: 20px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: var(--c-primary);
  text-shadow: 0 0 5px var(--c-primary);
  animation: matrix-fall linear infinite;
}

.matrix-char {
  display: block;
  height: 20px;
  opacity: 0;
  animation: matrix-fade ease-in-out infinite;
}

@keyframes matrix-fall {
  0% { 
    transform: translateY(-100vh); 
  }
  100% { 
    transform: translateY(100vh); 
  }
}

@keyframes matrix-fade {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* CAPA DE CONTENIDO - ENCIMA DEL MATRIX */
.content-layer {
  position: relative;
  z-index: 10; /* Por encima del matrix */
  width: 100%;
  min-height: 100vh;
}

/* Resto de tus estilos... */
.analyze-section {
  max-width: 1100px;
  margin: auto;
  padding: 2rem;
  color: white;
  position: relative;
  z-index: 10;
}

/* Asegurar que todo el contenido esté por encima */
.text-center,
.analyze-section,
.results,
.metadata-card,
.loading-state,
.no-results {
  position: relative;
  z-index: 10;
}

.glow-text {
  text-shadow: 0 0 10px var(--c-primary-glow), 0 0 20px var(--c-primary);
  position: relative;
  z-index: 10;
}
</style>
