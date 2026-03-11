import './Projects.css'

const projects = [
  {
    id: 1,
    name: 'Genetic Disease Risk Analysis using Graph Database',
    type: 'Research Project',
    description: 'Graph-based system to analyze genetic and medical data for identifying potential health risks. Models relationships between patients, symptoms, genes, and diseases using Neo4j.',
    tags: ['Python', 'Neo4j', 'Graph DB'],
    href: 'https://github.com/Manty-K/genetic-disease-risk-analyser',
  },
  {
    id: 2,
    name: 'Mood Detection in Music',
    type: 'ML Project',
    description: 'Machine learning model to detect emotions in raw audio input. Extracts audio features such as Mel Spectrogram, MFCCs, Chroma, Zero Crossing Rate, and RMS.',
    tags: ['Python', 'ML', 'Audio'],
    href: 'https://www.youtube.com/watch?v=BqeD4ftnkCc',
  },
  {
    id: 3,
    name: 'CLI Based CSV Manipulator',
    type: 'Systems Project',
    description: 'Command-line tool to process and manipulate CSV files based on user-defined rule files. Parsed using Flex and Bison with a custom grammar.',
    tags: ['C', 'Flex', 'Bison'],
    href: 'https://github.com/Manty-K/csv-manipulator',
  },
  {
    id: 4,
    name: 'Two-Pass Assembler',
    type: 'Systems Project',
    description: 'NASM-like two-pass assembler that converts assembly code into custom object code format. Focused on low-level code generation, file structure design, and symbol resolution.',
    tags: ['C', 'Flex', 'Bison'],
    href: 'https://github.com/Manty-K/assembler-mini',
  },
  {
    id: 5,
    name: 'Rapid Note — Sound Recorder',
    type: 'Mobile Application',
    description: 'Quick & easy sound recorder with neumorphic UI. Features user accounts, audio playback, track liking, and on-device storage using BLoC state management.',
    tags: ['Dart', 'Flutter'],
    href: 'https://github.com/Manty-K/Rapid-Note',
  },
  {
    id: 6,
    name: 'Spotify Clone',
    type: 'Mobile Application',
    description: 'Full-featured Spotify lookalike using Flutter, replicating the UI and core functionalities with Firebase backend for auth, database, and media storage.',
    tags: ['Dart', 'Flutter', 'Firebase'],
    href: 'https://github.com/Manty-K/spotify_clone_ui',
  },
]

export default function Projects() {
  return (
    <section className="section" id="projects">
      <h2 className="section-title">Projects</h2>

      <div className="projects-list">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card"
          >
            <div className="project-top">
              <div>
                <span className="project-name">{project.name}</span>
                <span className="project-type"> · {project.type}</span>
              </div>
              <span className="project-arrow">↗</span>
            </div>
            <p className="project-desc">{project.description}</p>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-tag">{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
