import { ref } from 'vue'
import { usePanicDb } from './usePanicDb'
import modelDetect from '~/utils/model-detect'

export const useAnalyzer = () => {
  const model = ref('')
  const detectModel = async (code: string) => {
    model.value = await modelDetect(code)
  }
  return {
    model,
    detectModel
  }
}