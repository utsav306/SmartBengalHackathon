import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Define animation classes that might be missing
const styles = {
  animatePulseSlow: 'animate-[pulse_3s_ease-in-out_infinite]',
  animationDelay2000: 'animation-delay-[2000ms]',
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  // Set active section based on current route
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/analyze') return 'analyze';
    if (path === '/features') return 'features';
    if (path === '/about') return 'about';
    return '';
  };
  
  const [activeSection, setActiveSection] = useState(getActiveSection());
  
  // Update active section when route changes
  useEffect(() => {
    setActiveSection(getActiveSection());
  }, [location]);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Menu items
  const menuItems = [
    { id: 'home', label: 'HOME', path: '/' },
    { id: 'analyze', label: 'ANALYZE', path: '/analyze' },
    { id: 'features', label: 'FEATURES', path: '/features' },
    { id: 'about', label: 'ABOUT', path: '/features#about' },
  ];
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]' : 'bg-transparent py-4'}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMjkgNThsMSAxSDI4ek0yOSAyTDI4IDFoMnpNMSAyOWwxIDFWMjh6TTU4IDI5bDEtMXYyeiIvPjwvZz48L2c+PC9zdmc+')]"></div>
        </div>
        
        {/* Animated light beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-[pulse_2s_ease-in-out_infinite]"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-fuchsia-500/10 rounded-full blur-xl animate-[pulse_2s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/4 left-10 w-12 h-12 bg-cyan-500/10 rounded-full blur-xl animate-[pulse_3s_ease-in-out_infinite]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            {/* Logo icon */}
            <div className="relative mr-3 w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-fuchsia-600 rounded-lg rotate-45 transform transition-transform duration-300 hover:rotate-[135deg]"></div>
              <div className="absolute inset-[2px] bg-black rounded-lg rotate-45"></div>
              <div className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 font-bold text-xl">W</div>
            </div>
            
            {/* Logo text */}
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">WEB</span>
                <span className="text-white">ANALYZER</span>
              </h1>
              <div className="text-[10px] -mt-1 tracking-widest text-gray-400 uppercase">AI-Powered Design Analysis</div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                to={item.path}
                onClick={() => setActiveSection(item.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeSection === item.id ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}
              >
                {activeSection === item.id && (
                  <span className={`absolute inset-0 w-full h-full ${styles.animatePulseSlow}`}>
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></span>
                  </span>
                )}
                {item.label}
              </Link>
            ))}
            
            {/* Action button */}
            <Link to="/analyze" className="ml-4 relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white text-sm font-medium py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105">
              <span className="relative z-10">GET STARTED</span>
              <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-blue-600 to-purple-600"></div>
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
          >
            <div className={`w-6 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}>
              <span className={`block w-full h-[2px] bg-cyan-400 mb-1.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className="block w-full h-[2px] bg-fuchsia-400 mb-1.5"></span>
              <span className={`block w-full h-[2px] bg-cyan-400 transition-all duration-300 ${menuOpen ? '-rotate-90 -translate-y-[8px]' : ''}`}></span>
            </div>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden absolute left-0 right-0 bg-black/95 backdrop-blur-md border-t border-gray-800 transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-64 border-b border-gray-800' : 'max-h-0'}`}>
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  to={item.path}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMenuOpen(false);
                  }}
                  className={`block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors ${activeSection === item.id ? 'border-cyan-500 text-cyan-400 bg-cyan-900/10' : 'border-transparent text-gray-300'}`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Action button */}
              <Link to="/analyze" className="mx-4 mt-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white text-sm font-medium py-2 px-4 rounded-md inline-block">
                GET STARTED
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
