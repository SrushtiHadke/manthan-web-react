import './Experience.css'

const jobs = [
  {
    id: 1,
    role: 'Python Developer',
    company: 'KISAN Forum',
    companyUrl: 'https://kisan.in/',
    location: 'Pune, India',
    period: 'June 2025 — Current',
    bullets: [
      'Led migration of server-based infrastructure to AWS serverless — Lambda, S3, RDS, DynamoDB, etc.',
      'Optimized complex PostgreSQL queries, improving performance and reducing response times.',
      'Led internal AI adoption initiative — drove team-wide integration of AI tools into development workflow.',
      'Integrated CI/CD pipelines for faster and reliable deployments.',
      'Implemented secure APIs, authentication, and analytics.',
      'Built agentic AI solutions for internal business use cases.',
      'Mentored 5+ junior developers.',
    ],
  },
  {
    id: 2,
    role: 'App Developer',
    company: 'KISAN Forum',
    companyUrl: 'https://kisan.in/',
    location: 'Pune, India',
    period: 'Nov 2021 — July 2023',
    bullets: [
      'Developed and maintained KISAN app with over 500k+ downloads and 6000+ daily active users.',
      'Designed and optimized ticketing system for KISAN events.',
      'Published applications on Google Play Store and Apple App Store.',
      'Reduced application size from 100 MB to 10 MB (90%).',
    ],
  },
  {
    id: 3,
    role: 'App Developer',
    company: 'Prachet Lifetech',
    location: 'Nashik, India',
    period: 'May 2021 — Oct 2021',
    bullets: [
      'Developed and published both the User App and Admin Dashboard.',
      'Contributed to full-stack development beyond mobile apps, including web development using ReactJS and backend development with Node.js, TypeScript, and Python.',
    ],
  },
]

export default function Experience() {
  return (
    <section className="section" id="experience">
      <h2 className="section-title">Experience</h2>

      <div className="experience-list">
        {jobs.map((job) => (
          <div key={job.id} className="experience-item">
            <div className="experience-header">
              <div>
                <span className="experience-role">{job.role}</span>
                <span className="experience-company"> · {job.companyUrl
                  ? <a href={job.companyUrl} target="_blank" rel="noopener noreferrer">{job.company}</a>
                  : job.company}</span>
                <span className="experience-location"> · {job.location}</span>
              </div>
              <span className="experience-period">{job.period}</span>
            </div>
            <ul className="experience-bullets">
              {job.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
