import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    { id: 1, name: 'Siti Aminah', role: 'Wedding Client', text: 'Makanannya sangat enak dan porsinya pas. Dekorasi buffet-nya juga sangat elegan. Terima kasih Catering-in sudah membuat pernikahan saya sempurna!' },
    { id: 2, name: 'Budi Santoso', role: 'HR Manager', text: 'Pesan untuk acara gathering kantor. Pelayanannya sangat profesional dan on-time. Semua peserta memuji rasa makanannya.' },
    { id: 3, name: 'Ibu Ratna', role: 'Ibu Rumah Tangga', text: 'Pesan tumpeng mini untuk ulang tahun anak. Bentuknya lucu, rasanya autentik, dan harganya juga sangat terjangkau. Recommended!' },
  ];

  return (
    <section id="testimonials" className="py-20 bg-matcha-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Apa Kata <span className="text-matcha-600">Mereka?</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Testimoni pelanggan yang telah mempercayakan momen spesialnya kepada Catering-in.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, index) => (
            <motion.div
              key={testi.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 relative"
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic leading-relaxed">"{testi.text}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-matcha-200 rounded-full flex items-center justify-center text-matcha-700 font-bold text-xl mr-4">
                  {testi.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-dark font-bold">{testi.name}</h4>
                  <p className="text-gray-500 text-sm">{testi.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
