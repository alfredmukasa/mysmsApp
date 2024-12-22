import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from "../assets/logo/alra-tech-high-resolution-logo.png";
import { 
  Home, 
  FileText, 
  MessageCircle, 
  Gem, 
  Info, 
  LogIn,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navigationItems = [
    { icon: Home, name: "Home", link: "/" },
    { icon: FileText, name: "PDF Tools", link: "/pdf-tools" },
    { icon: MessageCircle, name: "Messages", link: "/messages" },
    { icon: Gem, name: "Pricing", link: "#pricing" },
    { icon: Info, name: "About", link: "/about" },
  ];

  return (
    <>
      <style>
        {`
          .main-site-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 64px;
            background: #ffffff;
            transition: all 0.3s ease;
            z-index: 1000;
          }

          .main-logo-image {
            height: 48px;
            width: auto;
            object-fit: contain;
            transition: all 0.3s ease;
            margin: 8px 0;
          }

          .main-site-header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .main-header-content {
            max-width: 1200px;
            margin: 0 auto;
            height: 100%;
            padding: 0 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .main-logo-container {
            display: flex;
            align-items: center;
          }

          .main-logo-image {
            height: 50px;
            width: auto;
            object-fit: contain;
            transition: all 0.3s ease;
          }

          .main-nav-links {
            display: flex;
            gap: 1rem;
            align-items: center;
          }

          .main-nav-link {
            display: flex;
            align-items: center;
            padding: 0.5rem 0.75rem;
            color: #4a5568;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.2s ease;
          }

          .main-nav-link:hover {
            background: #f7fafc;
            color: #2b6cb0;
          }

          .main-nav-link.active {
            background: #ebf8ff;
            color: #2b6cb0;
          }

          .main-login-button {
            padding: 0.5rem 1rem;
            background: #4299e1;
            color: white;
            border-radius: 8px;
            border: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
          }

          .main-login-button:hover {
            background: #3182ce;
          }

          .main-menu-button {
            display: none;
            background: none;
            border: none;
            padding: 0.5rem;
            color: #4a5568;
          }

          .main-mobile-menu {
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            padding: 1rem;
            z-index: 999;
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
          }

          .main-mobile-menu.open {
            transform: translateX(0);
          }

          .main-mobile-nav-link {
            display: flex;
            align-items: center;
            padding: 1rem;
            color: #4a5568;
            text-decoration: none;
            border-radius: 12px;
            margin-bottom: 0.5rem;
            transition: all 0.2s ease;
          }

          .main-mobile-nav-link:hover {
            background: #f7fafc;
          }

          .main-mobile-nav-link.active {
            background: #ebf8ff;
            color: #2b6cb0;
          }

          @media (max-width: 1024px) {
            .main-nav-links {
              display: none;
            }

            .main-menu-button {
              display: flex;
            }

            .main-site-header {
              height: 56px;
            }

            .main-logo-image {
              height: 32px;
            }

            .main-mobile-menu {
              top: 56px;
            }
          }

          @media (max-width: 768px) {
            .main-header-content {
              padding: 0 0.75rem;
            }

            .main-mobile-nav-link {
              padding: 0.875rem;
            }

            .main-site-header.scrolled {
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }
          }

          @supports(padding: max(0px)) {
            .main-header-content {
              padding-left: max(1rem, env(safe-area-inset-left));
              padding-right: max(1rem, env(safe-area-inset-right));
            }
          }
        `}
      </style>

      <header className={`main-site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="main-header-content">
          <Link to="/" className="main-logo-image">
            <img src={Logo} alt="Logo" className="main-logo-image" />
          </Link>

          <nav className="main-nav-links">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className={`main-nav-link ${location.pathname === item.link ? 'active' : ''}`}
              >
                <item.icon size={18} className="me-2" />
                <span>{item.name}</span>
              </Link>
            ))}
            <button className="main-login-button">
              <LogIn size={18} />
              <span>Login</span>
            </button>
          </nav>

          <button 
            className="main-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={`main-mobile-menu ${isMenuOpen ? 'open' : ''}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className={`main-mobile-nav-link ${location.pathname === item.link ? 'active' : ''}`}
              >
                <item.icon size={20} className="me-3" />
                <span className="flex-grow-1">{item.name}</span>
                <ChevronRight size={20} className="text-gray-400" />
              </Link>
            ))}
            <Link to="/login" className="main-mobile-nav-link">
              <LogIn size={20} className="me-3" />
              <span className="flex-grow-1">Login</span>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;