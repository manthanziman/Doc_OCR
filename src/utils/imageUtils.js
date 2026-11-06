export const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export function validateFiles(fileList) {
  return Array.from(fileList ?? [])
    .filter((file) => file && file.type && ALLOWED_MIME_TYPES.includes(file.type))
    .map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    }))
}

export function formatFileSize(bytes) {
  if (!bytes) {
    return '0 KB'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

export function revokePreviewUrls(images) {
  images.forEach((image) => {
    if (image?.previewUrl) {
      URL.revokeObjectURL(image.previewUrl)
    }
  })
}
