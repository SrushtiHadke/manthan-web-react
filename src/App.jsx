import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Labs from './components/Labs'
import Accomplishments from './components/Accomplishments'
import Blogs from './components/Blogs'
import './App.css'

const sections = {
  about: About,
  experience: Experience,
  projects: Projects,
  labs: Labs,
  accomplishments: Accomplishments,
  blogs: Blogs,
}

function getPathSection() {
  const path = window.location.pathname.replace(/^\//, '')
  return sections[path] ? path : 'about'
}

export default function App() {
  const [active, setActive] = useState(getPathSection)

  useEffect(() => {
    const onPopState = () => setActive(getPathSection())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function handleNav(id) {
    window.history.pushState(null, '', '/' + id)
    setActive(id)
  }

  const Section = sections[active]

  return (
    <div className="layout">
      <Sidebar active={active} onNav={handleNav} />
      <main className="content">
        <Section />
      </main>
    </div>
  )
}
