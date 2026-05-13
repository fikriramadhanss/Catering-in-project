import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, ChefHat } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();
  const { cartTotalItems, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  const navLinks = [
    { name: 'Tentang Kami', to: 'about' },
    { name: 'Menu', to: 'menu' },
    { name: 'Galeri', to: 'gallery' },
    { name: 'Cara Pesan', to: 'how-to-order' },
    { name: 'Testimoni', to: 'testimonials' },
    { name: 'Kontak', to: 'contact' },
  ];

  const handleNavClick = (to) => {
    setIsOpen(false);
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(to);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <>
      <nav className="fixed w-full z-40 bg-white/90 backdrop-blur-md border-b border-gray-100/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-3">
            
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.business_name} className="h-9 md:h-10 w-auto object-contain flex-shrink-0" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-matcha-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-matcha-700 transition-colors">
                    <ChefHat size={20} className="text-white" />
                  </div>
                  <span className="text-lg md:text-xl font-extrabold text-gray-900 truncate max-w-[180px] sm:max-w-xs">
                    {settings.business_name}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                isHomePage ? (
                  <ScrollLink
                    key={link.name}
                    to={link.to}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-matcha-700 font-medium cursor-pointer transition-colors rounded-lg hover:bg-matcha-50"
                  >
                    {link.name}
                  </ScrollLink>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.to)}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-matcha-700 font-medium cursor-pointer transition-colors rounded-lg hover:bg-matcha-50"
                  >
                    {link.name}
                  </button>
                )
              ))}
            </div>
            
            {/* Right side: Cart + CTA */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-500 hover:text-matcha-700 hover:bg-matcha-50 rounded-xl transition-colors"
              >
                <ShoppingCart size={22} />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-matcha-600 rounded-full">
                    {cartTotalItems}
                  </span>
                )}
              </button>

              <button 
                onClick={() => {
                  if (isHomePage) {
                    const el = document.getElementById('menu');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/');
                  }
                }}
                className="bg-matcha-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-matcha-700 transition-colors shadow-sm hover:shadow-md"
              >
                Pesan Sekarang
              </button>
            </div>

            {/* Mobile: Cart + Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-500 hover:text-matcha-700 rounded-xl transition-colors"
              >
                <ShoppingCart size={22} />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-matcha-600 rounded-full">
                    {cartTotalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-matcha-700 hover:bg-matcha-50 rounded-xl transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  isHomePage ? (
                    <ScrollLink
                      key={link.name}
                      to={link.to}
                      smooth={true}
                      duration={500}
                      offset={-80}
                      className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-matcha-700 hover:bg-matcha-50 rounded-xl cursor-pointer transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </ScrollLink>
                  ) : (
                    <button
                      key={link.name}
                      onClick={() => handleNavClick(link.to)}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-matcha-700 hover:bg-matcha-50 rounded-xl transition-colors"
                    >
                      {link.name}
                    </button>
                  )
                ))}
                <div className="pt-3 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      if (isHomePage) {
                        const el = document.getElementById('menu');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/');
                      }
                    }}
                    className="w-full bg-matcha-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-matcha-700 transition-colors"
                  >
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <CartDrawer />
    </>
  );
};

export default Navbar;
