<!-- pages/index.vue - ACTUALIZADO -->
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
      Compatible desde iPhone XS hasta <span class="text-cyan-400">17 Pro Max</span>.
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
        :disabled="loading || !fileText.trim()"
        @click="analyze"
      >
        {{ loading ? "Analizando..." : "Analizar Panic Log" }}
      </button>
    </div>

    <!-- ESTADOS DE CARGA/ERROR -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Analizando patrones de error...</p>
    </div>

    <!-- RESULTADOS MEJORADOS -->
    <div v-if="result && !loading" class="results">
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

      <!-- NUEVO: Metadata del análisis -->
      <div v-if="metadata" class="metadata-card">
        <div class="metadata-header">
          <span class="metadata-title">🔍 Detalles del análisis</span>
          <span class="confidence-badge" :class="confidenceLevel">
            Confianza: {{ summary?.confidence || 0 }}%
          </span>
        </div>
        
        <div class="metadata-grid">
          <div v-if="metadata.hexCodes?.length" class="metadata-item">
            <span class="metadata-label">Códigos hex encontrados:</span>
            <div class="code-tags">
              <span v-for="code in metadata.hexCodes" :key="code" class="code-tag hex">
                {{ code }}
              </span>
            </div>
          </div>
          
          <div v-if="metadata.patterns?.length" class="metadata-item">
            <span class="metadata-label">Patrones detectados:</span>
            <div class="code-tags">
              <span v-for="pattern in metadata.patterns.slice(0, 3)" :key="pattern" class="code-tag pattern">
                {{ pattern }}
              </span>
            </div>
          </div>
          
          <div v-if="!metadata.hexCodes?.length && !metadata.patterns?.length" class="metadata-item warning">
            <span class="warning-icon">⚠️</span>
            <span>No se detectaron códigos hex explícitos. Resultados basados en análisis de texto.</span>
          </div>
        </div>
      </div>

      <div id="pdf-area">
        <PanicSummaryCard :summary="summary" />
        <PanicResult 
          :grouped="result" 
          :detected="detected"
          :hex-codes="metadata?.hexCodes || []"
        />
      </div>
    </div>

    <!-- NUEVO: Estado vacío cuando no hay resultados -->
    <div v-if="result && Object.keys(result).length === 0 && !loading" class="no-results">
      <div class="no-results-icon">🔍</div>
      <h4>No se detectaron errores conocidos</h4>
      <p>Este Panic Log no contiene patrones reconocidos en nuestra base de datos.</p>
      <p class="text-sm text-gray-400 mt-2">Sugerencia: Verifica que el archivo sea un Panic Log válido de iPhone.</p>
    </div>
  </div>

  <!-- Sección de donaciones -->
  <DonateSection />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

import DonateSection from '~/components/DonateSection.vue'
import DropZone from '@/components/panic/DropZone.vue'
import PanicResult from '@/components/panic/PanicResult.vue'
import PanicSummaryCard from '@/components/panic/PanicSummaryCard.vue'

const fileText = ref<string>('')
const result = ref<any>(null)
const summary = ref<any>(null)
const detected = ref<any[]>([]) // NUEVO: array de errores detectados individuales
const metadata = ref<any>(null) // NUEVO: metadata del análisis
const loading = ref(false)

// NUEVO: Computed para nivel de confianza visual
const confidenceLevel = computed(() => {
  const conf = summary.value?.confidence || 0
  if (conf >= 80) return 'high'
  if (conf >= 50) return 'medium'
  return 'low'
})

async function analyze () {
  if (!fileText.value || fileText.value.trim().length < 5) {
    alert('Subí un archivo Panic Log válido.')
    return
  }

  loading.value = true
  result.value = null // Limpiar resultados previos

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

    // NUEVO: Guardar todos los datos del nuevo motor
    result.value = res.data.grouped
    summary.value = res.data.summary
    detected.value = res.data.detected || [] // Array completo de errores
    metadata.value = res.data.metadata || null // Metadata con hexCodes y patterns
    
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

  try {
    const canvas = await html2canvas(el, { scale: 2 })
    const img = canvas.toDataURL('image/png')

    // eslint-disable-next-line new-cap
    const pdf = new jsPDF('p', 'mm', 'a4')
    const width = pdf.internal.pageSize.getWidth()
    const height = (canvas.height * width) / canvas.width

    pdf.addImage(img, 'PNG', 0, 0, width, height)
    pdf.save(`panic_report_${new Date().toISOString().split('T')[0]}.pdf`)
  } catch (err) {
    console.error('Error exportando PDF:', err)
    alert('Error al generar PDF')
  }
}
</script>

<style scoped>
/* ... estilos existentes ... */

/* NUEVOS ESTILOS */

.loading-state {
  text-align: center;
  padding: 3rem;
  color: var(--c-primary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: var(--c-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.metadata-card {
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.metadata-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.metadata-title {
  font-weight: 600;
  color: var(--c-primary);
}

.confidence-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.confidence-badge.high {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.confidence-badge.medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.confidence-badge.low {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.metadata-grid {
  display: grid;
  gap: 1rem;
}

.metadata-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metadata-item.warning {
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
}

.metadata-label {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
}

.code-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.code-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: 'Courier New', monospace;
}

.code-tag.hex {
  background: rgba(6, 182, 212, 0.2);
  color: #22d3ee;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.code-tag.pattern {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.no-results {
  text-align: center;
  padding: 3rem;
  background: rgba(239, 68, 68, 0.05);
  border: 1px dashed rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  margin-top: 2rem;
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-results h4 {
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.no-results p {
  color: rgba(255,255,255,0.6);
}

/* Responsive */
@media (max-width: 768px) {
  .metadata-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .code-tags {
    gap: 0.25rem;
  }
}
</style>
