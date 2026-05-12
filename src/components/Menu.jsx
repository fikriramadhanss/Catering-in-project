import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        if (!supabase) return;
        
        const { data, error } = await supabase
          .from('menus')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setMenus(data);
        }
      } catch (error) {
        console.error('Error fetching menus:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Jika masih loading
  if (loading) {
    return (
      <section id="menu" className="py-20 bg-bone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-matcha-600"></div>
        </div>
      </section>
    );
  }

  // Jika tidak ada data dari database, kita bisa tampilkan pesan kosong
  if (menus.length === 0) {
    return (
      <section id="menu" className="py-20 bg-bone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Paket & <span className="text-matcha-600">Menu Unggulan</span>
          </h2>
          <p className="text-gray-600">Belum ada menu yang tersedia. Silakan tambahkan melalui halaman Admin.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 bg-bone">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Paket & <span className="text-matcha-600">Menu Unggulan</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Kami menawarkan berbagai pilihan paket yang dapat disesuaikan dengan kebutuhan dan anggaran acara Anda.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {menus.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex flex-col h-full"
              onClick={() => navigate(`/menu/${item.id}`)}
            >
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img 
                  src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-matcha-700 shadow-sm">
                  {item.price}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-matcha-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                  {item.description}
                </p>
                <div className="flex items-center text-matcha-600 font-medium group/btn mt-auto">
                  <span className="group-hover/btn:underline">Lihat Detail</span>
                  <ArrowRight size={18} className="ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
