import { useRef, useState } from 'react'

const documentOptions = ['Aadhaar', 'Passport', 'Indian Visa', 'Driving Licence']

export default function DocumentUploader({
  documentType,
  onDocumentTypeChange,
  onFilesSelected,
  selectedFiles,
  disabled,
}) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (fileList) => {
    if (!fileList || !fileList.length || disabled) {
      return
    }

    onFilesSelected(fileList)
  }

  return (
    <div className="upload-panel">
      <div className="field-row">
        <label htmlFor="document-type">Document type</label>
        <select
          id="document-type"
          value={documentType}
          onChange={(event) => onDocumentTypeChange(event.target.value)}
          disabled={disabled}
        >
          {documentOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          handleFiles(event.dataTransfer.files)
        }}
      >
        <input
          ref={inputRef}
          hidden
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />

        <div className="upload-copy">
          <span className="upload-icon" aria-hidden="true">
            ↑
          </span>
          <strong>Drag &amp; drop images here</strong>
          <span>or click to browse</span>
        </div>
        <span className="supported-types">PNG, JPG, JPEG, WebP</span>
      </div>

      <div className="selected-files">
        {selectedFiles.length ? (
          selectedFiles.map((file) => <span key={file.id}>{file.name}</span>)
        ) : (
          <span>No images selected</span>
        )}
      </div>
    </div>
  )
}
