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

function getHashSection() {
  const hash = window.location.hash.replace('#', '')
  return sections[hash] ? hash : 'about'
}

export default function App() {
  const [active, setActive] = useState(getHashSection)

  useEffect(() => {
    const onHashChange = () => setActive(getHashSection())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function handleNav(id) {
    window.location.hash = id
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
