import { useState, useEffect } from 'react'
import './ThemeToggle.css'

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const MODES = [
  { id: 'Light', icon: <SunIcon /> },
  { id: 'Dark',  icon: <MoonIcon /> },
]

export default function ThemeToggle() {
  const [mode, setMode] = useState(
    () => localStorage.getItem('theme') || 'Dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode.toLowerCase())
    localStorage.setItem('theme', mode)
  }, [mode])

  return (
    <div className="theme-toggle">
      {MODES.map((m) => (
        <button
          key={m.id}
          className={`theme-btn ${mode === m.id ? 'active' : ''}`}
          onClick={() => setMode(m.id)}
          title={m.id}
        >
          {m.icon}
        </button>
      ))}
    </div>
  )
}
