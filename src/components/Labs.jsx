import './Labs.css'

const labs = [
  {
    id: 1,
    name: 'Music Player',
    description: 'An audio player experiment built with React.',
    href: '/labs/audio-player/index.html',
  },
]

export default function Labs() {
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
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="lab-try-btn"
            >
              Try it ↗
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
