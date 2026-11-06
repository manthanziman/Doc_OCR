export default function Header({ status }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Local browser OCR</p>
        <h1>Document OCR Tester</h1>
      </div>

      <div className={`status-badge ${status.toLowerCase().includes('error') ? 'error' : 'ready'}`}>
        <span className="status-dot" aria-hidden="true" />
        {status}
      </div>
    </header>
  )
}
