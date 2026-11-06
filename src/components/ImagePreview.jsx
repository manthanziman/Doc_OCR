import { useRef } from 'react'

import { formatFileSize } from '../utils/imageUtils'

export default function ImagePreview({ images, onRemoveImage, onReplaceImage }) {
  const inputRefs = useRef({})

  if (!images.length) {
    return <div className="empty-state">No images uploaded yet.</div>
  }

  return (
    <div className="image-grid">
      {images.map((image) => (
        <div className="image-card" key={image.id}>
          <div className="image-frame">
            <img src={image.previewUrl} alt={image.name} />
          </div>

          <div className="image-meta">
            <strong>{image.name}</strong>
            <span>{formatFileSize(image.size)}</span>
          </div>

          <div className="image-actions">
            <button
              type="button"
              className="secondary"
              onClick={() => inputRefs.current[image.id]?.click()}
            >
              Replace
            </button>
            <button type="button" className="danger" onClick={() => onRemoveImage(image.id)}>
              Remove
            </button>
          </div>

          <input
            ref={(node) => {
              if (node) {
                inputRefs.current[image.id] = node
              }
            }}
            type="file"
            hidden
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const nextFiles = event.target.files
              if (nextFiles && nextFiles.length) {
                onReplaceImage(image.id, nextFiles)
              }
              event.target.value = ''
            }}
          />
        </div>
      ))}
    </div>
  )
}
