import { useEffect, useMemo, useState } from 'react';
import { profileImage } from './assets';
import { Navbar, SectionHeading, Footer, Contact } from './components';
import { aboutData, skillsData, projectsData, certificatesData, educationData } from './data';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [typedText, setTypedText] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const roles = useMemo(() => ['Java Full Stack Developer', 'MERN Stack Developer', 'Spring Boot & React Engineer'], []);
  const contactEmail = 'abhayyadav232236@gmail.com';

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let index = 0;
    let charIndex = 0;
    const interval = setInterval(() => {
      setTypedText(roles[index].slice(0, charIndex));
      charIndex += 1;
      if (charIndex > roles[index].length) {
        clearInterval(interval);
        setTimeout(() => {
          index = (index + 1) % roles.length;
          charIndex = 0;
          const next = setInterval(() => {
            setTypedText(roles[index].slice(0, charIndex));
            charIndex += 1;
            if (charIndex > roles[index].length) {
              clearInterval(next);
            }
          }, 90);
        }, 1000);
      }
    }, 90);
    return () => clearInterval(interval);
  }, [roles]);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitted) {
      setSubmitted(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return;
    }

    setSubmitError('');

    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(formData.subject)}&body=${mailtoBody}`;

    window.location.href = mailtoLink;
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="app-shell">
      {isLoading && (
        <div className="loader" aria-label="Loading portfolio">
          <div className="loader-inner" />
        </div>
      )}

      <Navbar activeSection={activeSection} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main>
        <section id="home" className="section container hero">
          <div className="hero-copy reveal">
            <span className="gradient-text">Hello, I’m</span>
            <h1>
              Abhay <span className="gradient-text">Yadav</span>
            </h1>
            <div className="typing-text">{typedText}</div>
            <p>
              I design and build scalable web applications with Java Full Stack and MERN Stack expertise, combining Spring Boot, React, Node.js, and modern cloud-ready architectures.
              I bring a strong mix of backend engineering and polished frontend experiences to every product.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/Abhay_Yadav.pdf" download>
                Download Resume
              </a>
              <a className="btn btn-secondary" href="#contact">
                Contact Me
              </a>
            </div>
          </div>

          <div className="hero-card glass-card reveal">
            <div className="shape one" />
            <div className="shape two" />
            <img className="profile-image" src={profileImage} alt="Software developer portrait" />
          </div>
        </section>

        <section id="about" className="section container">
          <SectionHeading eyebrow="About" title="Building practical solutions with a premium user experience" />
          <div className="about-grid reveal">
            <div className="about-card glass-card">
              <h3 className="gradient-text" style={{ marginBottom: '0.8rem' }}>
                Professional Summary
              </h3>
              <p>{aboutData.summary}</p>
              <br />
              <h3 className="gradient-text" style={{ marginBottom: '0.8rem' }}>
                Career Objective
              </h3>
              <p>{aboutData.objective}</p>
            </div>
            <div className="info-grid">
              {aboutData.info.map((item) => (
                <div key={item.label} className="info-card glass-card">
                  <h3>{item.label}</h3>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="timeline-list reveal" style={{ marginTop: '1.2rem' }}>
            {aboutData.timeline.map((item) => (
              <div key={item.title} className="timeline-card glass-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="section container">
          <SectionHeading eyebrow="Skills" title="A full-stack toolbox for modern product development" />
          <div className="skills-grid reveal">
            {skillsData.map((skill) => (
              <div key={skill.title} className="skill-card glass-card">
                <div className="skill-icon">{skill.icon}</div>
                <h3>{skill.title}</h3>
                <ul>
                  {skill.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" className="section container">
          <SectionHeading eyebrow="Projects" title="Selected work that balances performance and design" />
          <div className="projects-grid reveal">
            {projectsData.map((project) => (
              <article key={project.title} className="project-card glass-card">
                <img className="project-image" src={project.image} alt={project.title} />
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-stack">
                  {project.tech.map((tech) => (
                    <span key={tech} className="pill">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="project-actions">
                  <a className="btn btn-secondary" href={project.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="education" className="section container">
          <SectionHeading eyebrow="Education" title="Academic foundation with a focus on technology" />
          <div className="education-layout reveal">
            <div className="about-card glass-card">
              <h3 className="gradient-text">B.Sc. Information Technology</h3>
              <p style={{ marginTop: '0.7rem' }}>University of Mumbai</p>
              <p style={{ marginTop: '0.4rem' }}>Graduation Year: 2026</p>
            </div>
            <div className="timeline-list">
              {educationData.map((item) => (
                <div key={item.title} className="timeline-card glass-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="certificates" className="section container">
          <SectionHeading eyebrow="Certificates" title="Recognized milestones and continuous learning" />
          <div className="certs-grid reveal">
            {certificatesData.map((certificate) => (
              <div key={certificate.title} className="certificate-card glass-card">
                <div className="skill-icon">🏅</div>
                <h3>{certificate.title}</h3>
                <p>{certificate.provider}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section container">
          <SectionHeading eyebrow="Contact" title="Let’s turn ideas into high-impact software" />
          <Contact />
        </section>
      </main>

      <Footer />
      <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
        ↑
      </button>
    </div>
  );
};

export default App;
