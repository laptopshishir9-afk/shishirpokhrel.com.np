import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, BookOpen } from 'lucide-react';
import { getStoredProfilePhoto, subscribeProfilePhoto, DEFAULT_PHOTO_PATHS } from '../utils/photoManager';

interface NavbarProps {
  activeSection: string;
  currentPage?: 'home' | 'about-me' | 'admin';
  onNavigateHome?: () => void;
  onNavigateAboutMe?: () => void;
}

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Hobbies', href: '#hobbies' },
  { label: 'Video Editing', href: '#video-editing' },
  { label: 'Future Goal', href: '#future-goal' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  currentPage = 'home',
  onNavigateHome,
  onNavigateAboutMe,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Real Profile Photo state
  const [photoUrl, setPhotoUrl] = useState<string | null>(() => getStoredProfilePhoto() || DEFAULT_PHOTO_PATHS[0]);
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Subscribe to photo updates
    const unsubscribe = subscribeProfilePhoto((newUrl) => {
      if (newUrl) {
        setPhotoUrl(newUrl);
        setPhotoError(false);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleNavClick = (href: string) => {
    if (currentPage !== 'home') {
      if (onNavigateHome) {
        onNavigateHome();
      } else {
        window.location.hash = href;
      }
      setTimeout(() => {
        const id = href.replace('#', '');
        const elem = document.getElementById(id);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    if (currentPage !== 'home') {
      e.preventDefault();
      if (onNavigateHome) onNavigateHome();
      else window.location.hash = '#home';
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-sky-200/80 py-3 shadow-xs'
          : 'bg-white/85 backdrop-blur-sm py-4 border-b border-sky-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand identity with REAL profile photo */}
        <a
          id="brand-logo-link"
          href="#home"
          onClick={handleBrandClick}
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-amber-300 ring-2 ring-sky-200 group-hover:border-amber-400 shadow-xs transition-colors shrink-0 bg-sky-50 flex items-center justify-center">
            {photoUrl && !photoError ? (
              <img
                id="navbar-profile-photo"
                src={photoUrl}
                alt="Shishir Pokhrel"
                referrerPolicy="no-referrer"
                onError={() => setPhotoError(true)}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <span className="font-display font-bold text-xs text-blue-800">SP</span>
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm tracking-tight text-blue-950 group-hover:text-blue-600 transition-colors">
              Shishir Pokhrel
            </span>
            <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Class 11 • Computer Science
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === 'home' && activeSection === item.href.substring(1);
            return (
              <a
                key={item.href}
                id={`nav-link-${item.href.substring(1)}`}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`relative px-3 py-1.5 text-xs font-bold rounded-lg transition-colors duration-150 ${
                  isActive
                    ? 'text-blue-900 bg-sky-100/70 shadow-2xs'
                    : 'text-slate-700 hover:text-blue-900 hover:bg-sky-50'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-amber-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
              </a>
            );
          })}

          {/* Option to read full bio & photo upload guide */}
          <button
            type="button"
            onClick={onNavigateAboutMe}
            className={`ml-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1.5 ${
              currentPage === 'about-me'
                ? 'bg-amber-400 text-blue-950 border border-amber-500 shadow-2xs'
                : 'text-blue-900 bg-amber-100/80 hover:bg-amber-200 border border-amber-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read More</span>
          </button>
        </nav>

        {/* Right side: Contact Button & Mobile menu trigger */}
        <div className="flex items-center gap-2.5">
          <a
            href="#contact"
            onClick={() => handleNavClick('#contact')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs hover:shadow-sm"
          >
            <span>Contact Me</span>
          </a>

          {/* Mobile menu trigger */}
          <button
            id="mobile-menu-button"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-sky-50 border border-sky-200 text-blue-950 hover:bg-amber-100 hover:border-amber-300 transition-colors focus:outline-none"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-b border-sky-200 bg-white px-4 pt-3 pb-6 shadow-lg"
          >
            <div className="flex flex-col space-y-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigateAboutMe) onNavigateAboutMe();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-amber-100 border border-amber-300 text-blue-950 font-bold text-xs flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-700" />
                  <span>Read Full Biography & Story</span>
                </span>
                <span className="text-[10px] bg-amber-400 px-2 py-0.5 rounded-full font-extrabold">NEW</span>
              </button>

              {NAV_ITEMS.map((item) => {
                const isActive = currentPage === 'home' && activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.href}
                    id={`mobile-nav-link-${item.href.substring(1)}`}
                    href={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavClick(item.href);
                    }}
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-blue-900 font-bold'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <div className="pt-2">
                <a
                  href="#contact"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavClick('#contact');
                  }}
                  className="block text-center py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
