import './Labs.css'

const labs = [
  {
    id: 1,
    name: 'Music Player',
    description: 'An audio player experiment with a WebGL shader background that reacts to music beats.',
    slug: 'audio-player',
  },
]

export default function Labs({ onLabOpen }) {
  return (
    <section className="section" id="labs">
      <h2 className="section-title">Labs</h2>

      <div className="labs-list">
        {labs.map((item) => (
          <div key={item.id} className="lab-item">
            <div className="lab-top">
              <span className="lab-name">{item.name}</span>
            </div>
            <p className="lab-desc">{item.description}</p>
            <button
              className="lab-try-btn"
              onClick={() => onLabOpen(item.slug)}
            >
              Try it ↗
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
