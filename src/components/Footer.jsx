const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/abhayyadav0323-lang' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abhayyadavl/' },
  { label: 'Email', href: 'mailto:abhayyadav232236@gmail.com' },
];

const Footer = () => {
  return (
    <footer className="footer container">
      <div className="footer-content">
        <div className="social-links">
          {socialLinks.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
              {item.label === 'GitHub' ? 'GH' : item.label === 'LinkedIn' ? 'in' : '✉'}
            </a>
          ))}
        </div>
        <p>© 2026 Abhay Yadav. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
