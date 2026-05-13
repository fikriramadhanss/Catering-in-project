import React from "react";
import { motion } from "framer-motion";
import { Leaf, Shield, Timer, Heart, ChefHat, Wallet } from "lucide-react";

const features = [
  {
    icon: Leaf,
    label: "Bahan Baku Segar",
    desc: "Dipilih langsung setiap hari",
  },
  {
    icon: ChefHat,
    label: "Chef Berpengalaman",
    desc: "Keahlian teruji di berbagai event",
  },
  {
    icon: Shield,
    label: "Higienis & Halal",
    desc: "Tersertifikasi dan terjamin",
  },
  { icon: Timer, label: "Tepat Waktu", desc: "Tidak pernah terlambat" },
  {
    icon: Heart,
    label: "Pelayanan Ramah",
    desc: "Profesional dengan sentuhan hangat",
  },
  {
    icon: Wallet,
    label: "Harga Terjangkau",
    desc: "Kualitas premium, harga bersaing",
  },
];

const About = () => {
  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-white to-matcha-50/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-matcha-100 text-matcha-700 rounded-full text-sm font-semibold mb-4">
            Tentang Kami
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Lebih Dari Sekadar <span className="text-matcha-600">Makanan</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Kami percaya bahwa makanan yang lezat dapat menyatukan orang-orang
            dan menciptakan kenangan indah yang abadi.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-[3/2] lg:aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop"
                alt="Chef memasak"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matcha-950/40 via-transparent to-transparent" />
            </div>

            {/* Floating quote card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -right-4 md:-right-8 bg-white rounded-2xl shadow-xl p-5 max-w-[220px] border-l-4 border-matcha-500"
            >
              <p className="text-gray-700 text-sm font-medium italic leading-relaxed">
                "Kepuasan Anda adalah prioritas utama kami."
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-8 h-8 bg-matcha-100 rounded-full flex items-center justify-center">
                  <ChefHat size={16} className="text-matcha-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    Owner Catering-in
                  </p>
                  <p className="text-xs text-gray-400">Mama Tya</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-matcha-100 rounded-full -z-10" />
            <div className="absolute -bottom-8 left-8 w-16 h-16 bg-matcha-200/60 rounded-full -z-10" />
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Catering-in hadir untuk memberikan pengalaman kuliner terbaik di
              setiap acara Anda. Dengan dedikasi tinggi, kami menyajikan
              hidangan yang tidak hanya menggugah selera, tetapi juga
              menyehatkan dan menyenangkan semua tamu Anda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map(({ icon: Icon, label, desc }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white hover:bg-matcha-50 border border-gray-100 hover:border-matcha-200 transition-all duration-300 group"
                >
                  <div className="p-2 bg-matcha-100 rounded-xl group-hover:bg-matcha-200 transition-colors flex-shrink-0">
                    <Icon size={18} className="text-matcha-700" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
