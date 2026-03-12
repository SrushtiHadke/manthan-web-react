import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Labs from './components/Labs'
import Accomplishments from './components/Accomplishments'
import Blogs from './components/Blogs'
import BlogPost from './components/BlogPost'
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
  return { section: sections[section] ? section : 'about', slug }
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

  const { section, slug } = route
  const Section = sections[section]

  return (
    <div className="layout">
      <Sidebar active={section} onNav={handleNav} />
      <main className="content">
        {section === 'blogs' && slug
          ? <BlogPost slug={slug} onBack={handleBlogBack} />
          : <Section onBlogOpen={handleBlogOpen} />
        }
      </main>
    </div>
  )
}
