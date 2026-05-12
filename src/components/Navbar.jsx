import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

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
    if (!isHomePage) {
      navigate('/');
      // Delay to allow routing back to home before scrolling
      setTimeout(() => {
        const element = document.getElementById(to);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <>
      <nav className="fixed w-full z-40 bg-bone/90 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <span 
                className="text-xl md:text-2xl font-bold text-matcha-700 cursor-pointer flex items-center gap-2 max-w-[200px] sm:max-w-xs md:max-w-none"
                onClick={() => navigate('/')}
              >
                {settings.logo_url && (
                  <img src={settings.logo_url} alt={settings.business_name} className="h-8 md:h-10 w-auto object-contain flex-shrink-0" />
                )}
                <span className="truncate">{(!settings.logo_url) && settings.business_name}</span>
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                isHomePage ? (
                  <ScrollLink
                    key={link.name}
                    to={link.to}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    className="text-gray-600 hover:text-matcha-600 font-medium cursor-pointer transition-colors"
                  >
                    {link.name}
                  </ScrollLink>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.to)}
                    className="text-gray-600 hover:text-matcha-600 font-medium cursor-pointer transition-colors"
                  >
                    {link.name}
                  </button>
                )
              ))}
              
              {/* Cart Icon */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-matcha-600 transition-colors"
              >
                <ShoppingCart size={24} />
                {cartTotalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-matcha-600 rounded-full">
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
                className="bg-matcha-600 text-white px-6 py-2 rounded-full font-medium hover:bg-matcha-700 transition-colors shadow-sm"
              >
                Pesan Sekarang
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-matcha-600 transition-colors"
              >
                <ShoppingCart size={24} />
                {cartTotalItems > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-matcha-600 rounded-full">
                    {cartTotalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-matcha-600 focus:outline-none"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                isHomePage ? (
                  <ScrollLink
                    key={link.name}
                    to={link.to}
                    smooth={true}
                    duration={500}
                    offset={-80}
                    className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-matcha-600 hover:bg-matcha-50 rounded-md cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </ScrollLink>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => {
                      setIsOpen(false);
                      handleNavClick(link.to);
                    }}
                    className="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-matcha-600 hover:bg-matcha-50 rounded-md"
                  >
                    {link.name}
                  </button>
                )
              ))}
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
                className="w-full mt-4 bg-matcha-600 text-white px-6 py-3 rounded-md font-medium hover:bg-matcha-700"
              >
                Pesan Sekarang
              </button>
            </div>
          </div>
        )}
      </nav>
      <CartDrawer />
    </>
  );
};

export default Navbar;
