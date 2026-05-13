import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { ArrowRight, Star, Users, Award, Clock } from "lucide-react";

const stats = [
  { icon: Users, label: "Event Dilayani", value: "200+" },
  { icon: Star, label: "Rating Pelanggan", value: "4.9" },
  { icon: Award, label: "Tahun Pengalaman", value: "1+" },
  { icon: Clock, label: "Siap Tepat Waktu", value: "100%" },
];

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative pt-20 overflow-hidden min-h-screen flex items-center"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop"
          alt="Catering Background"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-matcha-950/90 via-matcha-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-matcha-950/60 via-transparent to-transparent" />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-matcha-400/10 rounded-full blur-3xl z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-matcha-300/10 rounded-full blur-2xl z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-matcha-100 font-semibold text-sm px-4 py-2 rounded-full mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-matcha-400 animate-pulse" />
            Layanan Catering Premium & Terpercaya
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] mb-6"
          >
            Hidangkan{" "}
            <span className="relative inline-block">
              <span className="text-matcha-300">Momen Spesial</span>
              <svg className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                <path d="M0 5 Q50 0 100 3 Q150 6 200 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-matcha-400/60"/>
              </svg>
            </span>
            <br />dengan Rasa Tak Terlupakan
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-base sm:text-lg text-matcha-100/80 mb-10 max-w-xl leading-relaxed"
          >
            Catering-in menyajikan hidangan lezat, higienis, dan elegan untuk
            setiap acara berharga Anda. Kualitas bintang lima di setiap gigitan.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link
              to="menu"
              smooth={true}
              duration={500}
              offset={-80}
              className="cursor-pointer inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-full text-matcha-900 bg-matcha-300 hover:bg-matcha-200 shadow-lg shadow-matcha-900/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              Lihat Menu Kami
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="contact"
              smooth={true}
              duration={500}
              offset={-80}
              className="cursor-pointer inline-flex justify-center items-center px-8 py-4 text-base font-bold rounded-full text-white bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              Konsultasi Gratis
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {stats.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3 flex flex-col gap-1 hover:bg-white/15 transition-colors"
              >
                <Icon size={18} className="text-matcha-300" />
                <span className="text-white font-extrabold text-xl leading-none">{value}</span>
                <span className="text-matcha-200/70 text-xs leading-tight">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
