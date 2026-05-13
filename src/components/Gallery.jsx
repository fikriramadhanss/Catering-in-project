import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const dummyGallery = [
    { id: 1, image_url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800&auto=format&fit=crop', title: 'Wedding Event' },
    { id: 2, image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop', title: 'Corporate Gathering' },
    { id: 3, image_url: 'https://images.unsplash.com/photo-1574365568478-fbb19d453b3f?q=80&w=800&auto=format&fit=crop', title: 'Birthday Party' },
    { id: 4, image_url: 'https://images.unsplash.com/photo-1626804475297-41609ea265eb?q=80&w=800&auto=format&fit=crop', title: 'Fine Dining' },
    { id: 5, image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop', title: 'Gala Dinner' },
    { id: 6, image_url: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=800&auto=format&fit=crop', title: 'Outdoor Catering' },
  ];

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
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

  // Masonry-like grid spans for variety
  const spanClass = (index) => {
    const pattern = [
      'col-span-2 row-span-2',   // 0: big
      'col-span-1 row-span-1',   // 1: small
      'col-span-1 row-span-1',   // 2: small
      'col-span-1 row-span-2',   // 3: tall
      'col-span-2 row-span-1',   // 4: wide
      'col-span-1 row-span-1',   // 5: small
    ];
    return pattern[index % pattern.length];
  };

  return (
    <section id="gallery" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-matcha-900/60 text-matcha-300 rounded-full text-sm font-semibold mb-4 border border-matcha-800">
            📸 Dokumentasi Kami
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Galeri <span className="text-matcha-400">Event</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Berbagai momen spesial yang telah kami layani dengan sepenuh hati.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-matcha-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3 md:gap-4">
            {displayData.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                onClick={() => setSelected(item)}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${spanClass(index)}`}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title || `Gallery ${index + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <ImageIcon size={32} className="text-gray-600" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-white font-bold text-sm md:text-base block truncate">
                      {item.title || 'Momen Spesial'}
                    </span>
                    <div className="flex items-center gap-1 mt-1">
                      <ExternalLink size={12} className="text-matcha-300" />
                      <span className="text-matcha-300 text-xs">Lihat detail</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.image_url}
              alt={selected.title}
              className="w-full h-full object-contain rounded-2xl max-h-[80vh]"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 rounded-b-2xl">
              <p className="text-white font-bold text-lg">{selected.title || 'Momen Spesial'}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors shadow-lg font-bold text-lg"
            >
              ×
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
