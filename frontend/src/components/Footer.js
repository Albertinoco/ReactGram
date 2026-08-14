import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <span className="footer__title">ReactGram</span>
          <p className="footer__text">
            Share moments, explore images, and keep your network always active.
          </p>
        </div>

        <nav className="footer__links" aria-label="Footer links">
          <Link to="/" className="footer__link">
            Home
          </Link>
          <Link to="/login" className="footer__link">
            Sign in
          </Link>
          <Link to="/register" className="footer__link">
            Create account
          </Link>
        </nav>

        <div className="footer__copy">
          <span>© {new Date().getFullYear()} ReactGram</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
