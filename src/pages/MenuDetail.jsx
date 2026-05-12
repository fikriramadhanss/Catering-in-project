import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MenuDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    fetchMenuDetail();
  }, [id]);

  const fetchMenuDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      setMenu(data);
    } catch (error) {
      console.error('Error fetching menu details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (menu) {
      addToCart(menu, quantity);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-matcha-600"></div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bone p-4">
        <h2 className="text-2xl font-bold text-dark mb-4">Menu tidak ditemukan</h2>
        <Link to="/" className="text-matcha-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bone min-h-screen flex flex-col relative">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-matcha-700 font-medium hover:text-matcha-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Kembali ke Beranda</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image Section */}
            <div className="h-64 md:h-full min-h-[300px] md:min-h-[500px] relative">
              <img 
                src={menu.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'} 
                alt={menu.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-matcha-100 text-matcha-800 rounded-full text-sm font-medium mb-4">
                  Katalog Catering-in
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">{menu.title}</h1>
                <p className="text-2xl font-bold text-matcha-600 mb-6">{menu.price}</p>
              </div>

              <div className="prose prose-matcha mb-8 break-words">
                <h3 className="text-lg font-semibold text-dark mb-2">Deskripsi Paket</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line break-all sm:break-words">
                  {menu.description || 'Belum ada deskripsi untuk paket ini.'}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-8 mt-auto">
                <div className="flex flex-row gap-3 sm:gap-4 items-center w-full">
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between border border-gray-200 rounded-xl bg-gray-50 p-1 flex-shrink-0 h-14 w-[120px] sm:w-[140px]">
                    <button 
                      onClick={handleDecrease}
                      className="w-10 h-10 sm:w-12 sm:h-10 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="flex-1 text-center font-bold text-dark">{quantity}</span>
                    <button 
                      onClick={handleIncrease}
                      className="w-10 h-10 sm:w-12 sm:h-10 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 h-14 bg-matcha-600 hover:bg-matcha-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg relative overflow-hidden group text-sm sm:text-base px-2 sm:px-4"
                  >
                    <ShoppingCart size={18} className="group-active:scale-90 transition-transform flex-shrink-0" />
                    <span className="truncate">Keranjang</span>
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 font-medium"
          >
            <div className="bg-green-500 rounded-full p-1">
              <CheckCircle size={16} className="text-white" />
            </div>
            <span>Pesanan masuk keranjang!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MenuDetail;
