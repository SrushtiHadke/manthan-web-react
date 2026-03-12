import { useEffect, useState } from 'react'
import { marked } from 'marked'
import posts from '../content/blogs/index.js'
import './BlogPost.css'

// Dynamically import all markdown files
const modules = import.meta.glob('../content/blogs/*.md', { as: 'raw' })

export default function BlogPost({ slug, onBack }) {
  const [html, setHtml] = useState('')
  const meta = posts.find((p) => p.slug === slug)

  useEffect(() => {
    const key = `../content/blogs/${slug}.md`
    if (modules[key]) {
      modules[key]().then((raw) => setHtml(marked.parse(raw)))
    }
  }, [slug])

  return (
    <article className="blog-post section">
      <button className="blog-back" onClick={onBack}>← Back</button>
      {meta && (
        <div className="blog-post-meta">
          <span className="blog-post-date">{meta.date}</span>
        </div>
      )}
      <div
        className="blog-post-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
