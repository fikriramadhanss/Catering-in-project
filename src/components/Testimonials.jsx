import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, X, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 5,
    text: ''
  });

  const dummyTestimonials = [
    { id: 1, name: 'Siti Aminah', role: 'Wedding Client', text: 'Makanannya sangat enak dan porsinya pas. Dekorasi buffet-nya juga sangat elegan. Terima kasih Catering-in sudah membuat pernikahan saya sempurna!', rating: 5 },
    { id: 2, name: 'Budi Santoso', role: 'HR Manager', text: 'Pesan untuk acara gathering kantor. Pelayanannya sangat profesional dan on-time. Semua peserta memuji rasa makanannya.', rating: 5 },
    { id: 3, name: 'Ibu Ratna', role: 'Ibu Rumah Tangga', text: 'Pesan tumpeng mini untuk ulang tahun anak. Bentuknya lucu, rasanya autentik, dan harganya juga sangat terjangkau. Recommended!', rating: 5 },
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6); // Tampilkan 6 terbaru
        
      if (error) throw error;
      if (data) setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('reviews')
        .insert([formData]);
        
      if (error) throw error;
      
      setIsModalOpen(false);
      setShowSuccess(true);
      setFormData({ name: '', role: '', rating: 5, text: '' });
      fetchTestimonials();
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting review:', error.message);
      alert('Gagal mengirim ulasan. Pastikan Anda sudah menjalankan tabel SQL reviews.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayData = testimonials.length > 0 ? testimonials : dummyTestimonials;

  return (
    <section id="testimonials" className="py-20 bg-matcha-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Apa Kata <span className="text-matcha-600">Mereka?</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Testimoni pelanggan yang telah mempercayakan momen spesialnya kepada Catering-in.
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-matcha-700 border-2 border-matcha-600 px-6 py-3 rounded-full font-bold hover:bg-matcha-600 hover:text-white transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <MessageSquare size={20} />
              Tulis Ulasan Anda
            </button>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-matcha-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayData.map((testi, index) => (
              <motion.div
                key={testi.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < (testi.rating || 5) ? "currentColor" : "none"} 
                      className={i < (testi.rating || 5) ? "" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed flex-grow">"{testi.text}"</p>
                <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 bg-matcha-100 rounded-full flex items-center justify-center text-matcha-700 font-bold text-xl mr-4 flex-shrink-0">
                    {testi.name ? testi.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-dark font-bold truncate">{testi.name}</h4>
                    <p className="text-gray-500 text-sm truncate">{testi.role || 'Pelanggan'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form Ulasan */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 p-6 sm:p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-dark">Tulis Ulasan</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 outline-none bg-gray-50"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status / Peran</label>
                  <input 
                    type="text" 
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 outline-none bg-gray-50"
                    placeholder="Contoh: Klien Wedding, HRD Perusahaan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Penilaian (1-5 Bintang) *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData({...formData, rating: star})}
                        className="focus:outline-none"
                      >
                        <Star 
                          size={32} 
                          fill={star <= formData.rating ? "#FBBF24" : "none"} 
                          className={star <= formData.rating ? "text-yellow-400" : "text-gray-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Ulasan Anda *</label>
                  <textarea 
                    name="text"
                    value={formData.text}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-matcha-500 outline-none bg-gray-50 resize-none"
                    placeholder="Ceritakan pengalaman Anda dengan Catering-in..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-matcha-600 hover:bg-matcha-700 disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md mt-4"
                >
                  {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 font-medium"
          >
            <CheckCircle size={20} className="text-green-400" />
            <span>Ulasan berhasil dikirim! Terima kasih.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;
