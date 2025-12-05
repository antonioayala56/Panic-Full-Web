<template>
  <div
    class="drop-zone"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <input
      ref="fileInput"
      type="file"
      accept=".txt,.log,.ips"
      class="hidden-input"
      @change="onFileSelect"
    />

    <div v-if="!showTextarea" class="upload-mode">
      <p class="label-text">{{ props.modelValue ? 'Archivo cargado ✓' : 'Arrastrá tu Panic Log aquí' }}</p>
      <p class="sub-text">{{ props.modelValue ? `Texto de ${props.modelValue.length} caracteres` : 'Archivos soportados: .txt, .log, .ips' }}</p>

      <button class="select-btn" @click="openFileDialog">
        {{ props.modelValue ? 'Cambiar archivo' : 'Seleccionar archivo' }}
      </button>

      <button class="paste-btn" @click="showTextarea = true">
        O pegar código directamente
      </button>
    </div>

    <div v-else class="paste-mode">
      <p class="label-text">Pegá tu código Panic aquí</p>
      <textarea
        v-model="pastedText"
        class="paste-textarea"
        placeholder="Pegá el contenido del archivo .txt, .log o .ips aquí..."
        @input="onTextInput"
      ></textarea>

      <div class="paste-buttons">
        <button class="paste-submit-btn" @click="submitPastedText">
          Analizar código pegado
        </button>
        <button class="paste-cancel-btn" @click="cancelPaste">
          Volver a subir archivo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits(["update:modelValue"])
const fileInput = ref<HTMLInputElement | null>(null)
const showTextarea = ref(false)
const pastedText = ref("")

// Prevenir drag & drop global
const preventDefaults = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
}

onMounted(() => {
  // Solo prevenir defaults en el div, no globalmente
})

onUnmounted(() => {
  // No remover listeners globales
})

function openFileDialog() {
  fileInput.value?.click()
}

function onFileSelect(event: any) {
  const file = event.target.files[0]
  if (file) readFile(file)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (e.dataTransfer?.files?.length) {
    readFile(e.dataTransfer.files[0])
  }
}

function readFile(file: File) {
  const reader = new FileReader()

  reader.onload = () => {
    const text = reader.result?.toString() || ""
    emit("update:modelValue", text)
  }

  reader.readAsText(file)
}

function onTextInput() {
  // Emitir el texto pegado inmediatamente
  emit("update:modelValue", pastedText.value)
}

function submitPastedText() {
  emit("update:modelValue", pastedText.value)
  showTextarea.value = false
}

function cancelPaste() {
  pastedText.value = ""
  showTextarea.value = false
}
</script>

<style scoped>
.drop-zone {
  border: 2px dashed rgba(245, 158, 11, 0.4);
  border-radius: 14px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  transition: 0.2s;
}

.dark .drop-zone {
  background: rgba(255, 255, 255, 0.03);
}

.drop-zone:hover {
  border-color: rgba(245, 158, 11, 0.8);
}

.hidden-input {
  display: none;
}

.label-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: #92400e;
}

.dark .label-text {
  color: #fcd34d;
}

.sub-text {
  margin-top: 6px;
  color: #ea580c;
  font-size: 0.9rem;
}

.dark .sub-text {
  color: #fb923c;
}

.select-btn {
  margin-top: 16px;
  background: rgba(0, 150, 255, 0.4);
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}

.select-btn:hover {
  background: rgba(245, 158, 11, 0.7);
}

.paste-btn {
  margin-top: 12px;
  background: rgba(245, 158, 11, 0.2);
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #f59e0b;
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.9rem;
}

.paste-btn:hover {
  background: rgba(245, 158, 11, 0.3);
  border-color: rgba(245, 158, 11, 0.5);
}

.paste-mode {
  width: 100%;
}

.paste-textarea {
  width: 100%;
  min-height: 200px;
  padding: 12px;
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: #1e293b;
  font-family: monospace;
  font-size: 0.9rem;
  resize: vertical;
  margin-top: 16px;
}

.dark .paste-textarea {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.paste-textarea::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.dark .paste-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.paste-textarea:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.paste-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  justify-content: center;
}

.paste-submit-btn {
  background: linear-gradient(90deg, #f59e0b, #dc2626);
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 500;
}

.paste-submit-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.5);
}

.paste-cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: 0.2s;
}

.paste-cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
