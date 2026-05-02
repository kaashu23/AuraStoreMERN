import React from 'react';
import { FaFingerprint, FaGlobe, FaLeaf } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 border-b border-gray-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50/50 -z-0" />
        <div className="section-container relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 space-y-8">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Est. 2026</p>
            <h1 className="text-5xl lg:text-7xl font-light tracking-tight text-dark-1 leading-tight uppercase italic">
              Redefining <br />
              <span className="font-black text-primary">Aura.</span>
            </h1>
            <p className="text-gray-500 font-light text-lg leading-relaxed max-w-lg">
              Aura Store was born from a singular vision: to bridge the gap between high-fashion elegance and sustainable technological innovation. We don't just sell products; we curate experiences that elevate your daily rhythm.
            </p>
          </div>
          <div className="md:w-1/2 aspect-[4/5] overflow-hidden bg-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Luxury Architecture" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 sm:py-32">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { icon: <FaFingerprint />, title: 'Unique Identity', desc: 'Every piece in our collection is selected to reinforce your personal aura and distinct style.' },
              { icon: <FaGlobe />, title: 'Global Vision', desc: 'We source materials ethically from across the globe, ensuring high-end quality with a conscience.' },
              { icon: <FaLeaf />, title: 'Sustainable Soul', desc: 'Luxury shouldn’t cost the earth. Our packaging and logistics are 100% carbon-neutral.' },
            ].map((value, i) => (
              <div key={i} className="space-y-6 group">
                <div className="text-4xl text-dark-1 group-hover:text-primary transition-colors duration-500">{value.icon}</div>
                <h3 className="text-lg font-black uppercase tracking-[0.2em] text-dark-1 italic">{value.title}</h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="bg-dark-1 py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2" />
        <div className="section-container relative z-10 space-y-8">
          <h2 className="text-white text-3xl md:text-5xl font-light italic tracking-tight">"Style is a way to say who you are <br /> without having to speak."</h2>
          <div className="h-px w-24 bg-primary mx-auto" />
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">The Aura Philosophy</p>
        </div>
      </section>
    </div>
  );
};

export default About;
