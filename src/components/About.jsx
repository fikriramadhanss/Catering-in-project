import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const About = () => {
  const features = [
    "Bahan Baku Segar & Berkualitas",
    "Chef Berpengalaman",
    "Higienis & Halal",
    "Tepat Waktu",
    "Pelayanan Ramah & Profesional",
    "Harga Terjangkau",
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 lg:mb-0 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-[3/2] lg:aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop"
                alt="Chef memasak"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-matcha-900/10"></div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-white p-6 rounded-2xl shadow-xl max-w-xs border-b-4 border-matcha-500">
              <div className="flex items-center gap-4">
                <div className="bg-matcha-100 p-3 rounded-full text-matcha-600 font-bold text-2xl">
                  1+
                </div>
                <div>
                  <p className="text-dark font-bold text-lg">
                    Tahun Pengalaman
                  </p>
                  <p className="text-gray-500 text-sm">
                    Melayani ratusan event
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
              Lebih Dari Sekadar{" "}
              <span className="text-matcha-600">Makanan</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Catering-in hadir untuk memberikan pengalaman kuliner terbaik di
              setiap acara Anda. Kami percaya bahwa makanan yang lezat dapat
              menyatukan orang-orang dan menciptakan kenangan indah. Dengan
              dedikasi tinggi, kami menyajikan hidangan yang tidak hanya
              menggugah selera, tetapi juga menyehatkan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-matcha-500 h-6 w-6 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="bg-matcha-50 p-6 rounded-xl border-l-4 border-matcha-500">
              <p className="text-matcha-800 font-medium italic">
                "Kepuasan Anda adalah prioritas utama kami. Kami berkomitmen
                untuk selalu memberikan yang terbaik."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
