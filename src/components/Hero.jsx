import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden min-h-screen flex items-center"
    >
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-bone via-bone/90 to-bone/40 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop"
          alt="Catering Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-matcha-100 text-matcha-700 font-semibold text-sm mb-6">
              Layanan Catering Premium
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-dark leading-tight mb-6">
              Hidangkan <span className="text-matcha-600">Momen Spesial</span>{" "}
              dengan Rasa Tak Terlupakan
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-lg">
              Catering-in menyajikan hidangan lezat, higienis, dan elegan untuk
              setiap acara berharga Anda. Kualitas bintang lima di setiap
              gigitan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="menu"
                smooth={true}
                duration={500}
                offset={-80}
                className="cursor-pointer inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-full text-white bg-matcha-600 hover:bg-matcha-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Lihat Menu Kami
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="contact"
                smooth={true}
                duration={500}
                offset={-80}
                className="cursor-pointer inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-full text-matcha-700 bg-white border-2 border-matcha-200 hover:border-matcha-600 shadow-sm transition-all duration-300"
              >
                Hubungi Kami
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
