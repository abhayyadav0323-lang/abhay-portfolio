const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = ({ activeSection, isMenuOpen, setIsMenuOpen }) => {
  return (
    <header className="site-nav">
      <div className="container navbar">
        <a className="logo gradient-text" href="#home">
          AY
        </a>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          ☰
        </button>

        <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.label}
              className={`nav-link ${activeSection === item.href.slice(1) ? 'active' : ''}`}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
