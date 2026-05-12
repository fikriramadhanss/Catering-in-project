import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Image as ImageIcon } from 'lucide-react';

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback dummy jika database kosong
  const dummyGallery = [
    { image_url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800&auto=format&fit=crop', title: 'Wedding Event' },
    { image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop', title: 'Corporate Gathering' },
    { image_url: 'https://images.unsplash.com/photo-1574365568478-fbb19d453b3f?q=80&w=800&auto=format&fit=crop', title: 'Birthday Party' },
    { image_url: 'https://images.unsplash.com/photo-1626804475297-41609ea265eb?q=80&w=800&auto=format&fit=crop', title: 'Fine Dining' }
  ];

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      if (data) setGalleries(data);
    } catch (error) {
      console.error('Error fetching gallery:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const displayData = galleries.length > 0 ? galleries : dummyGallery;

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Galeri <span className="text-matcha-600">Event</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Dokumentasi berbagai momen spesial yang telah kami layani dengan sepenuh hati.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-matcha-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayData.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl aspect-[4/3] group cursor-pointer shadow-sm bg-gray-100"
              >
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title || `Gallery ${index + 1}`} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={32} className="text-gray-300" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-matcha-900/80 via-matcha-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-white font-bold text-sm md:text-base truncate transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {item.title || 'Momen Spesial'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
