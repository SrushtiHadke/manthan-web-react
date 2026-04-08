import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Labs from './components/Labs'
import Accomplishments from './components/Accomplishments'
import Blogs from './components/Blogs'
import BlogPost from './components/BlogPost'
import ShaderPlayer from './components/ShaderPlayer'
import NotFound from './components/NotFound'
import './App.css'

const sections = {
  about: About,
  experience: Experience,
  projects: Projects,
  labs: Labs,
  accomplishments: Accomplishments,
  blogs: Blogs,
}

function parsePath() {
  const parts = window.location.pathname.replace(/^\//, '').split('/')
  const section = parts[0] || 'about'
  const slug = parts[1] || null
  return { section: sections[section] ? section : '404', slug }
}

export default function App() {
  const [route, setRoute] = useState(parsePath)

  useEffect(() => {
    const onPopState = () => setRoute(parsePath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function handleNav(id) {
    window.history.pushState(null, '', '/' + id)
    setRoute({ section: id, slug: null })
  }

  function handleBlogOpen(slug) {
    window.history.pushState(null, '', '/blogs/' + slug)
    setRoute({ section: 'blogs', slug })
  }

  function handleBlogBack() {
    window.history.pushState(null, '', '/blogs')
    setRoute({ section: 'blogs', slug: null })
  }

  function handleLabOpen(slug) {
    window.history.pushState(null, '', '/labs/' + slug)
    setRoute({ section: 'labs', slug })
  }

  function handleLabBack() {
    window.history.pushState(null, '', '/labs')
    setRoute({ section: 'labs', slug: null })
  }

  const { section, slug } = route
  const Section = sections[section]

  // Full-screen routes (no sidebar/layout)
  if (section === 'labs' && slug === 'audio-player') {
    return <ShaderPlayer onBack={handleLabBack} />
  }

  if (section === '404') {
    return (
      <div className="layout">
        <Sidebar active={null} onNav={handleNav} />
        <div className="content-outer">
          <main className="content">
            <NotFound onNav={handleNav} />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="layout">
      <Sidebar active={section} onNav={handleNav} />
      <div className="content-outer">
        <main className="content">
          {section === 'blogs' && slug
            ? <BlogPost slug={slug} onBack={handleBlogBack} />
            : <Section onBlogOpen={handleBlogOpen} onLabOpen={handleLabOpen} />
          }
        </main>
      </div>
    </div>
  )
}
