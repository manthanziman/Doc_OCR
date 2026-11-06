import { useState } from 'react'

import './App.css'
import DocumentUploader from './components/DocumentUploader'
import ErrorMessage from './components/ErrorMessage'
import Header from './components/Header'
import ImagePreview from './components/ImagePreview'
import OCRResult from './components/OCRResult'
import { initializeOCR, runOCR } from './services/paddleOCR'
import { revokePreviewUrls, validateFiles } from './utils/imageUtils'

function App() {
  const [documentType, setDocumentType] = useState('Aadhaar')
  const [images, setImages] = useState([])
  const [engineStatus, setEngineStatus] = useState('Idle')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [ocrResults, setOcrResults] = useState([])
  const [copiedFilename, setCopiedFilename] = useState(null)

  const addFiles = (incomingFiles) => {
    const nextImages = validateFiles(incomingFiles)

    if (!nextImages.length) {
      setError('Only PNG, JPG, JPEG, and WebP images are supported.')
      return
    }

    setError('')
    setImages((previous) => [...previous, ...nextImages])
  }

  const handleRemoveImage = (imageId) => {
    const removedImage = images.find((image) => image.id === imageId)

    if (removedImage?.previewUrl) {
      URL.revokeObjectURL(removedImage.previewUrl)
    }

    setImages((previous) => previous.filter((image) => image.id !== imageId))
  }

  const handleReplaceImage = (imageId, incomingFiles) => {
    const replacement = validateFiles(incomingFiles)

    if (!replacement.length) {
      setError('Only PNG, JPG, JPEG, and WebP images are supported.')
      return
    }

    setImages((previous) =>
      previous.map((image) => {
        if (image.id !== imageId) {
          return image
        }

        URL.revokeObjectURL(image.previewUrl)
        return { ...image, ...replacement[0], id: imageId }
      }),
    )
    setError('')
  }

  const handleClear = () => {
    revokePreviewUrls(images)
    setImages([])
    setOcrResults([])
    setCopiedFilename(null)
    setError('')
  }

  const handleRunOCR = async () => {
    if (!images.length) {
      setError('Upload at least one image before running OCR.')
      return
    }

    setError('')
    setIsProcessing(true)
    setEngineStatus('Initializing OCR engine...')

    try {
      await initializeOCR()
      setEngineStatus('Running OCR...')
      const results = await runOCR(images)
      setOcrResults(results)
      setEngineStatus('Ready')
    } catch (errorObject) {
      console.error(errorObject)
      setEngineStatus('Error')
      setError(errorObject?.message || 'OCR failed while initializing or processing the document.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopyText = async (result) => {
    try {
      await navigator.clipboard.writeText(result.text)
      setCopiedFilename(result.filename)
      window.setTimeout(() => setCopiedFilename(null), 1500)
    } catch (clipboardError) {
      console.error(clipboardError)
      setError('Clipboard access failed. You can still copy the text manually from the result panel.')
    }
  }

  return (
    <div className="app-shell">
      <Header status={engineStatus} />

      <main className="app-main">
        <section className="panel control-panel">
          <DocumentUploader
            documentType={documentType}
            onDocumentTypeChange={setDocumentType}
            onFilesSelected={addFiles}
            selectedFiles={images}
            disabled={isProcessing}
          />

          <div className="action-row">
            <button
              type="button"
              className="primary"
              onClick={handleRunOCR}
              disabled={isProcessing || !images.length}
            >
              {isProcessing ? 'Processing...' : 'Run OCR'}
            </button>
            <button type="button" className="secondary" onClick={handleClear} disabled={isProcessing}>
              Clear
            </button>
          </div>
        </section>

        <section className="panel preview-panel">
          <h2>Uploaded documents</h2>
          <ImagePreview
            images={images}
            onRemoveImage={handleRemoveImage}
            onReplaceImage={handleReplaceImage}
          />
        </section>
      </main>

      {error ? <ErrorMessage message={error} /> : null}

      <section className="panel results-panel">
        <div className="results-header">
          <h2>OCR results</h2>
        </div>
        <OCRResult results={ocrResults} onCopyText={handleCopyText} copiedFilename={copiedFilename} />
      </section>
    </div>
  )
}

export default App
