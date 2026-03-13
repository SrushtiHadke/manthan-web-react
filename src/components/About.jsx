import './About.css'

const contact = {
  email: 'manthankhandale@gmail.com',
  phone: '+91 9607213241',
}

const RESUME_URL = 'https://manthan-khandale-public-assets.s3.ap-south-1.amazonaws.com/manthan-khandale-resume.pdf'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Manty-k' },
  { label: 'YouTube', href: 'https://youtube.com/@manthankhandale23' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/manthan-khandale' },
  { label: 'Dev.to', href: 'https://dev.to/mantyk' },
  { label: 'Resume', href: RESUME_URL, highlight: true },
]

export default function About() {
  return (
    <section className="section" id="about">
      <h2 className="section-title">About</h2>

      <div className="about-body">
        <p className="bio">
          Full-Stack Developer with 4+ years building production-grade systems across backend,
          mobile, and cloud. Currently a <strong>Python Developer at Kisan Forum</strong>, leading
          AWS serverless migration, AI integration, and team-wide engineering initiatives.
        </p>
        <p className="bio">
          Evolved from <strong>Flutter</strong>-first mobile development into <strong>Python</strong>,{' '}
          <strong>AWS serverless architecture</strong>, and <strong>Agentic AI</strong> — shipping
          customer-facing products at scale with a focus on clean code and end-to-end ownership.
        </p>
        <p className="bio">
          MSc. Computer Science, <strong>Savitribai Phule Pune University</strong>.
        </p>

        <div className="contact-block">
          <div className="contact-row">
            <span className="contact-label">Email</span>
            <a href={`mailto:${contact.email}`} className="contact-value link">
              {contact.email}
            </a>
          </div>
          <div className="contact-row">
            <span className="contact-label">Phone</span>
            <span className="contact-value">{contact.phone}</span>
          </div>
        </div>

        <div className="social-links">
          {socialLinks.filter(l => !l.highlight).map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="social-links">
          {socialLinks.filter(l => l.highlight).map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link social-link--resume"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
