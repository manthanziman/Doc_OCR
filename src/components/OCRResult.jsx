export default function OCRResult({ results, onCopyText, copiedFilename }) {
  if (!results.length) {
    return <div className="empty-state">OCR results will appear here.</div>
  }

  return (
    <div className="result-list">
      {results.map((result) => (
        <article className="result-card" key={`${result.filename}-${result.processingTime}`}>
          <div className="result-header">
            <div>
              <p className="result-label">Processed image</p>
              <h3>{result.filename}</h3>
            </div>
            <button type="button" className="copy-btn" onClick={() => onCopyText(result)}>
              {copiedFilename === result.filename ? 'Copied' : 'Copy text'}
            </button>
          </div>

          <p className="processing-time">Completed in {result.processingTime} ms</p>

          <div className="recognized-text">
            {result.text || 'No text recognized in this image.'}
          </div>

          <div className="ocr-lines">
            {result.results.length ? (
              result.results.map((item, index) => (
                <div key={`${result.filename}-${index}`} className="ocr-line">
                  <span>{item.text || '—'}</span>
                  <small>
                    {item.confidence !== null ? `${(item.confidence * 100).toFixed(1)}%` : 'No confidence'}
                  </small>
                </div>
              ))
            ) : (
              <p>No individual text regions were returned by the engine.</p>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
