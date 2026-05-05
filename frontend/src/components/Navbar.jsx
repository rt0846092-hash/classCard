import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
  
  const activeClass = (path) => isActive(path) ? 'navbar-link--active' : '';

  const navLinks = user ? [
    { to: '/dashboard', label: 'Dashboard', show: true },
    { to: '/pinned-study', label: '📌 Pinned', show: user.role === 'student' },
    { to: '/review-study', label: '🔁 Review', show: user.role === 'student' },
    { to: '/teacher', label: 'Students', show: user.role === 'teacher' },
  ].filter(l => l.show) : [];

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        {/* Left: Brand */}
        <Link to="/dashboard" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          Class<span>Card</span>
        </Link>

        {/* Desktop Links */}
        {user && (
          <div className="navbar-links navbar-links--desktop">
            {navLinks.map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                className={`navbar-link ${activeClass(link.to)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right: User + Hamburger */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="navbar-user">
              <span className="text-gray-400 text-sm">{user.name}</span>
              <span className="badge badge-role">{user.role}</span>
            </div>
          )}

          {/* Hamburger toggle (mobile only) */}
          {user && (
            <button 
              className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          )}

          {user ? (
            <button 
              onClick={handleLogout} 
              className="btn btn-ghost navbar-logout"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary navbar-login">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {user && (
        <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
          <div className="container">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`mobile-link ${activeClass(link.to)}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button 
              onClick={handleLogout} 
              className="mobile-link mobile-link--logout"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;