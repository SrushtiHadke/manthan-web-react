import './Blogs.css'

const posts = [
  {
    id: 1,
    title: 'Technical Writing for Geeks',
    summary: 'How developers can improve their technical documentation — active voice, concise language, and proper use of lists and tables.',
    date: 'Feb 2023',
    href: 'https://dev.to/mantyk/technical-writing-for-geeks-2oia',
  },
  {
    id: 2,
    title: 'Make a Sound Recorder in Flutter',
    summary: 'A step-by-step guide to building a fully functional sound recorder app using Flutter and Dart.',
    date: 'Medium',
    href: 'https://manthankhandale.medium.com/make-a-sound-recorder-in-flutter-d64fd0809f6c',
  },
  {
    id: 3,
    title: 'Fade Widgets in Flutter',
    summary: 'Learn how to animate widget opacity with fade transitions in Flutter for smoother, more polished UIs.',
    date: 'Medium',
    href: 'https://manthankhandale.medium.com/fade-widgets-in-flutter-ed740cfac1a',
  },
]

export default function Blogs() {
  return (
    <section className="section" id="blogs">
      <h2 className="section-title">Blogs</h2>

      <div className="blogs-list">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className="blog-item"
          >
            <div className="blog-top">
              <span className="blog-title">{post.title}</span>
              <span className="blog-date">{post.date}</span>
            </div>
            <p className="blog-summary">{post.summary}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
