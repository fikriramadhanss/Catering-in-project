import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Menu from '../components/Menu';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import HowToOrder from '../components/HowToOrder';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { Helmet } from 'react-helmet-async';

const LandingPage = () => {
  return (
    <div className="font-sans text-dark bg-bone overflow-x-hidden">
      <Helmet>
        <title>Catering-in | Layanan Catering Modern & Profesional</title>
        <meta name="description" content="Catering-in menyediakan layanan catering terbaik, elegan, dan profesional untuk berbagai acara Anda." />
      </Helmet>
      
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Menu />
        <Gallery />
        <HowToOrder />
        <Testimonials />
        <Contact />
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LandingPage;
