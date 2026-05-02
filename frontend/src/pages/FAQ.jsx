import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How do I track my acquisition reference?',
      a: 'Once your transaction is verified, you will receive a 12-digit Vault Reference. Enter this code on the "My Archive" page to see real-time logistics data.'
    },
    {
      q: 'What is the "Elite Member" status?',
      a: 'Elite status is automatically granted to individuals who have successfully completed three or more acquisitions. Members receive early access to seasonal journals and priority dispatch.'
    },
    {
      q: 'Can I cancel an order once authorized?',
      a: 'Cancellations are only possible within the first 60 minutes of authorization. After this window, the dispatch protocol initiates and the items are prepared for high-speed delivery.'
    },
    {
      q: 'How are returns handled globally?',
      a: 'Simply initiate a "Return Protocol" from your archive. We will dispatch a courier to your location to collect the item. A full valuation refund is issued within 48 hours of inspection.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      <section className="py-24 border-b border-gray-50 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="section-container text-center space-y-6 relative z-10">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Knowledge Base</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight uppercase italic leading-none">Frequently Asked</h1>
          <p className="text-gray-400 font-light text-lg max-w-xl mx-auto leading-relaxed">
            Essential information for navigating the Aura Store ecosystem.
          </p>
        </div>
      </section>

      <div className="section-container mt-24 max-w-4xl space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-100 overflow-hidden rounded-sm transition-all duration-500">
             <button 
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full flex justify-between items-center p-8 text-left hover:bg-gray-50 transition-colors"
             >
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-dark-1">{faq.q}</span>
                <div className="text-primary">
                   {openIndex === i ? <FaMinus size={10} /> : <FaPlus size={10} />}
                </div>
             </button>
             <div 
                className={`transition-all duration-700 ease-in-out overflow-hidden ${openIndex === i ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
             >
                <p className="px-8 pb-8 text-gray-500 font-light leading-relaxed text-sm max-w-2xl italic">
                   "{faq.a}"
                </p>
             </div>
          </div>
        ))}

        <div className="mt-20 p-12 bg-gray-50 text-center space-y-6 border border-gray-100">
           <h3 className="text-xl font-bold uppercase italic text-dark-1">Still seeking clarity?</h3>
           <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Our digital concierge is standing by.</p>
           <button className="btn-premium">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
