import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, MessageCircle, CreditCard, Truck } from 'lucide-react';

const HowToOrder = () => {
  const steps = [
    { icon: <ClipboardList size={32} />, title: "Pilih Menu", desc: "Lihat dan pilih paket atau menu yang sesuai dengan kebutuhan acara Anda." },
    { icon: <MessageCircle size={32} />, title: "Hubungi Kami", desc: "Konsultasikan pesanan Anda melalui WhatsApp. Admin kami siap membantu." },
    { icon: <CreditCard size={32} />, title: "Pembayaran", desc: "Lakukan pembayaran DP untuk mengamankan jadwal pesanan Anda." },
    { icon: <Truck size={32} />, title: "Pesanan Diantar", desc: "Duduk manis, kami akan mengantarkan pesanan Anda tepat waktu." },
  ];

  return (
    <section id="how-to-order" className="py-20 bg-bone">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Cara <span className="text-matcha-600">Pemesanan</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Proses pemesanan yang mudah, cepat, dan transparan.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-matcha-200 -z-10 transform -translate-y-1/2"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white p-6 rounded-2xl shadow-md text-center group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-20 h-20 mx-auto bg-matcha-100 rounded-full flex items-center justify-center text-matcha-600 mb-6 group-hover:bg-matcha-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToOrder;
