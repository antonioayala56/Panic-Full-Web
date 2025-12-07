<template>
  <!-- Matrix Rain Background -->
  <div class="matrix-rain">
    <div v-for="i in 30" :key="i" class="matrix-column" :style="{ left: (i * 3.33) + '%', animationDelay: (Math.random() * 5) + 's' }">
      <div v-for="j in 50" :key="j" class="matrix-char" :style="{ animationDelay: (j * 0.1) + 's' }">
        {{ ['0', '1'][Math.floor(Math.random() * 2)] }}
      </div>
    </div>
  </div>

  <div class="text-center relative z-10">
    <h1 class="text-5xl font-bold mb-6 tracking-wide drop-shadow">
      Bienvenido a <span class="text-cyan-400 glow-text">PanicFull PRO</span>
    </h1>

    <p class="text-gray-400 max-w-2xl mx-auto text-lg mb-10">
      Analizador profesional de Panic Logs para técnicos avanzados.
      Compatible desde iPhone XS hasta 16 Pro Max.
    </p>

    <!-- Línea descriptiva -->
    <div class="mt-8 opacity-80">
      <p class="hero-line">
        <span class="hero-icon">🔧</span>
        Herramientas de diagnóstico avanzado para técnicos profesionales de iPhone
      </p>
    </div>
  </div>

  <!-- Sección de análisis -->
  <div class="analyze-section">
    <h2 class="analyze-title">
      Análisis de Panic Log
    </h2>

    <!-- DROPZONE -->
    <DropZone v-model="fileText" />

    <div class="btn-area">
      <button
        class="analyze-btn"
        :disabled="loading"
        @click="analyze"
      >
        {{ loading ? "Analizando..." : "Analizar Panic Log" }}
      </button>
    </div>

    <!-- RESULTADOS -->
    <div v-if="result" class="results">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-2xl font-bold text-white">
          Resultados del análisis
        </h3>
        <button
          class="export-btn"
          @click="exportPDF"
        >
          📄 Exportar PDF
        </button>
      </div>

      <div id="pdf-area">
        <PanicSummaryCard :summary="summary" />
        <PanicResult :grouped="result" />
      </div>
    </div>
  </div>

  <!-- Sección de donaciones -->
  <DonateSection />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import DonateSection from '~/components/DonateSection.vue'
import DropZone from '@/components/panic/DropZone.vue'
import PanicResult from '@/components/panic/PanicResult.vue'
import PanicSummaryCard from '@/components/panic/PanicSummaryCard.vue'

const fileText = ref<string>('')
const result = ref<any>(null)
const summary = ref<any>(null)
const loading = ref(false)

async function analyze () {
  if (!fileText.value || fileText.value.trim().length < 5) {
    alert('Subí un archivo Panic Log válido.')
    return
  }

  loading.value = true

  try {
    const res: any = await $fetch('/api/parse', {
      method: 'POST',
      body: { text: fileText.value }
    })

    if (!res.success) {
      alert(res.error || 'Error analizando el Panic Log.')
      loading.value = false
      return
    }

    result.value = res.data.grouped
    summary.value = res.data.summary
  } catch (err) {
    console.error(err)
    alert('Error en el servidor al procesar el Panic Log.')
  } finally {
    loading.value = false
  }
}

async function exportPDF () {
  const el = document.getElementById('pdf-area')
  if (!el) { return }

  const canvas = await html2canvas(el)
  const img = canvas.toDataURL('image/png')

  // eslint-disable-next-line new-cap
  const pdf = new jsPDF('p', 'mm', 'a4')
  const width = pdf.internal.pageSize.getWidth()
  const height = (canvas.height * width) / canvas.width

  pdf.addImage(img, 'PNG', 0, 0, width, height)
  pdf.save('panic_report.pdf')
}
</script>

<style scoped>
.analyze-section {
  max-width: 1100px;
  margin: auto;
  padding: 2rem;
  color: white;
}

.analyze-title {
  font-size: 2.6rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 0 15px rgba(255,165,0,0.4);
}

.btn-area {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

.analyze-btn {
  background: linear-gradient(90deg, var(--c-primary), var(--c-secondary));
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  color: white;
  transition: 0.2s;
  box-shadow: 0 0 12px var(--c-primary-glow);
}

.analyze-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 16px var(--c-primary-glow);
}

.analyze-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.results {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.export-btn {
  background: linear-gradient(90deg, #10b981, #059669);
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  color: white;
  transition: 0.2s;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
}

.export-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
}

.hero-line {
  @apply text-center text-gray-300 text-lg font-medium;
}

.hero-icon {
  @apply mr-2;
}

.glow-text {
  text-shadow: 0 0 10px var(--c-primary-glow), 0 0 20px var(--c-primary);
}

/* Matrix Rain Effect */
.matrix-rain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.matrix-column {
  position: absolute;
  top: -100%;
  width: 10px;
  animation: matrix-fall 10s linear infinite;
}

.matrix-char {
  color: var(--c-primary);
  font-family: 'Courier New', monospace;
  font-size: 14px;
  opacity: 0.6;
  animation: matrix-fade 2s ease-in-out infinite;
}

@keyframes matrix-fall {
  0% { top: -100%; }
  100% { top: 200vh; }
}

@keyframes matrix-fade {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.8; }
}
</style>
