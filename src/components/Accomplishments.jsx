import './Accomplishments.css'

const accomplishments = [
  { id: 1, title: 'Neo4j Certified Professional', href: 'https://graphacademy.neo4j.com/c/78edc90f-fc32-4753-a5ff-0a55c17d8973/' },
  { id: 2, title: 'Published Python Packages', href: 'https://pypi.org/user/mantyk/' },
  { id: 3, title: 'Published Community Packages', href: 'https://pub.dev/publishers/manthankhandale.com/packages' },
  { id: 4, title: 'Hack this Fall 2.0 — Winner', href: 'https://devpost.com/software/feelings-hub?_gl=1*1viws8n*_gcl_au*MTMzNjc4MzUwNC4xNzQ0MTQ1OTM0*_ga*NTQ5NjEzNDA0LjE3NDQxNDU5MzQ.*_ga_0YHJK3Y10M*MTc0NDE0NTkzNC4xLjEuMTc0NDE0NjAxNS4wLjAuMA..' },
  { id: 5, title: 'Hosted a Flutter Meetup', href: 'https://www.linkedin.com/feed/update/urn:li:activity:6859494242440556545/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAlHpNYBhlwugdDPGC24RLJcWDrMKiPFsAk' },
  { id: 6, title: 'Dart Language Certification', href: 'https://www.udemy.com/certificate/UC-91550692-ecfd-4527-b3de-7631619e3db1/' },
  { id: 7, title: 'Placement Cell Member (B23), Pune University CS Dept', href: 'http://cs.unipune.ac.in/' },
]

export default function Accomplishments() {
  return (
    <section className="section" id="accomplishments">
      <h2 className="section-title">Accomplishments</h2>

      <div className="accomplishments-list">
        {accomplishments.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="accomplishment-item"
          >
            <span className="accomplishment-title">{item.title}</span>
            <span className="accomplishment-arrow">↗</span>
          </a>
        ))}
      </div>
    </section>
  )
}
