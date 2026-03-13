import './Sidebar.css'
import ThemeToggle from './ThemeToggle'
import ShaderCanvas from './ShaderCanvas'

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'labs', label: 'Labs' },
  { id: 'accomplishments', label: 'Accomplishments' },
  { id: 'blogs', label: 'Blogs' },
]

export default function Sidebar({ active, onNav }) {
  return (
    <aside className="sidebar">
      <ShaderCanvas />
      <div className="sidebar-inner">
        <div className="sidebar-header">
          <h1 className="sidebar-name">Manthan Khandale</h1>
          <p className="sidebar-tagline">Software Engineer</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`nav-item${active === item.id ? ' nav-item--active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </aside>
  )
}
