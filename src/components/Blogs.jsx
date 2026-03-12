import posts from '../content/blogs/index.js'
import './Blogs.css'

export default function Blogs({ onBlogOpen }) {
  return (
    <section className="section" id="blogs">
      <h2 className="section-title">Blogs</h2>

      <div className="blogs-list">
        {posts.map((post) => (
          <button
            key={post.slug}
            className="blog-item"
            onClick={() => onBlogOpen(post.slug)}
          >
            <div className="blog-top">
              <span className="blog-title">{post.title}</span>
              <span className="blog-date">{post.date}</span>
            </div>
            <p className="blog-summary">{post.description}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
