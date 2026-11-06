import { PaddleOCR } from '@paddleocr/paddleocr-js'

let engine = null
let enginePromise = null

export async function initializeOCR() {
  if (engine) {
    return engine
  }

  if (!enginePromise) {
    enginePromise = PaddleOCR.create({
      lang: 'en',
      ocrVersion: 'PP-OCRv5',
      ortOptions: {
        backend: 'wasm',
        wasmPaths: 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/',
      },
    })
      .then((instance) => {
        engine = instance
        return instance
      })
      .catch((error) => {
        enginePromise = null
        throw error
      })
  }

  return enginePromise
}

export async function runOCR(images) {
  if (!images || !images.length) {
    throw new Error('Add one or more images before running OCR.')
  }

  const ocrEngine = await initializeOCR()
  const predictions = await ocrEngine.predict(images.map((image) => image.file))

  return predictions.map((result, index) => normalizeResult(result, images[index].name))
}

function normalizeResult(rawResult, filename) {
  const items = Array.isArray(rawResult?.items) ? rawResult.items : []
  const recognizedText = items
    .map((item) => String(item?.text ?? '').trim())
    .filter(Boolean)
    .join('\n')

  return {
    filename,
    text: recognizedText,
    results: items
      .map((item) => ({
        text: String(item?.text ?? '').trim(),
        confidence: typeof item?.score === 'number' ? item.score : null,
        boundingBox: item?.poly ?? null,
      }))
      .filter((item) => item.text),
    processingTime: rawResult?.metrics?.totalMs ?? 0,
    rawResult,
  }
}

export function resetOCR() {
  engine = null
  enginePromise = null
}
