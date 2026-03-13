import './ShaderPlayer.css'

export default function ShaderPlayer({ onBack }) {
  return (
    <div className="sp-root">
      <iframe
        src="/labs/audio-player/index.html"
        className="sp-iframe"
        title="Music Player"
      />
      <button className="sp-back" onClick={onBack}>← Back</button>
    </div>
  )
}
