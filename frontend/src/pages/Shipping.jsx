import React from 'react';
import { FaTruck, FaGlobe, FaBoxOpen, FaUndoAlt } from 'react-icons/fa';

const Shipping = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      <section className="py-20 border-b border-gray-50 bg-gray-50/30">
        <div className="section-container text-center space-y-4">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Logistics Protocol</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-dark-1 uppercase italic">Shipping & Returns</h1>
        </div>
      </section>

      <div className="section-container mt-20 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div className="space-y-10">
            <div className="space-y-4">
               <div className="flex items-center space-x-4 text-primary">
                  <FaTruck size={20} />
                  <h2 className="text-xl font-black uppercase tracking-widest italic text-dark-1">Dispatch Speed</h2>
               </div>
               <p className="text-gray-500 font-light leading-relaxed text-sm">
                 All Aura pieces are dispatched within 24 hours of acquisition verification. We utilize elite express carriers to ensure your items reach you in pristine condition.
               </p>
            </div>

            <div className="space-y-4">
               <div className="flex items-center space-x-4 text-primary">
                  <FaGlobe size={20} />
                  <h2 className="text-xl font-black uppercase tracking-widest italic text-dark-1">Global Coverage</h2>
               </div>
               <p className="text-gray-500 font-light leading-relaxed text-sm">
                 We provide complimentary white-glove shipping to over 120 countries for all selections exceeding $150 valuation.
               </p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
               <div className="flex items-center space-x-4 text-primary">
                  <FaBoxOpen size={20} />
                  <h2 className="text-xl font-black uppercase tracking-widest italic text-dark-1">Packaging</h2>
               </div>
               <p className="text-gray-500 font-light leading-relaxed text-sm">
                 Each item is encased in carbon-neutral, sustainable Aura Vault packaging, designed to be both protective and a work of art.
               </p>
            </div>

            <div className="space-y-4">
               <div className="flex items-center space-x-4 text-primary">
                  <FaUndoAlt size={20} />
                  <h2 className="text-xl font-black uppercase tracking-widest italic text-dark-1">Returns</h2>
               </div>
               <p className="text-gray-500 font-light leading-relaxed text-sm">
                 Our 30-day return protocol allows for seamless exchanges or full refunds, provided the digital security seal remains intact.
               </p>
            </div>
          </div>
        </div>

        <div className="mt-20 p-10 bg-dark-1 text-white text-center rounded-sm">
           <h3 className="text-lg font-black uppercase tracking-widest italic mb-4 text-primary">Tracking Your Acquisition</h3>
           <p className="text-gray-400 text-sm font-light mb-8 max-w-xl mx-auto">
             Enter your Vault Reference on the "My Archive" page to monitor the real-time coordinates of your shipment.
           </p>
           <button className="px-8 py-3 border border-white/20 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-dark-1 transition-all">
              Go to Archive
           </button>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
