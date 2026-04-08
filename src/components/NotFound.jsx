import './NotFound.css'

export default function NotFound({ onNav }) {
  return (
    <section className="notfound">
      <div className="notfound-code">404</div>
      <h1 className="notfound-title">Page not found</h1>
      <p className="notfound-desc">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <button className="notfound-btn" onClick={() => onNav('about')}>
        Go home
      </button>
    </section>
  )
}
