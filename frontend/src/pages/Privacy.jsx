import React from 'react';

const Privacy = () => {
  const sections = [
    {
      title: 'Digital Sovereignty',
      content: 'We respect your digital boundaries. Aura Store employs world-class end-to-end encryption to ensure that your acquisition history and personal data remain strictly within your control.'
    },
    {
      title: 'Data Collection',
      content: 'We only collect essential data required to facilitate your secure checkout and global logistics. We never trade, sell, or disclose your information to third-party commercial entities.'
    },
    {
      title: 'Member Profiles',
      content: 'Your member profile is stored on encrypted nodes. You have the right to request a full protocol wipe of your digital footprint at any time through our concierge team.'
    },
    {
      title: 'Secure Cookies',
      content: 'We utilize minimalist session tokens to maintain your curated selection and theme preferences. No persistent tracking beacons are deployed within our interface.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      <section className="py-24 border-b border-gray-50 bg-gray-50/50">
        <div className="section-container text-center space-y-6">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em]">Trust Protocol</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-dark-1 uppercase italic leading-none">Privacy Charter</h1>
          <p className="text-gray-400 font-light text-lg max-w-xl mx-auto leading-relaxed">
            Establishing the foundation of a secure and elite digital partnership.
          </p>
        </div>
      </section>

      <div className="section-container mt-20 max-w-3xl space-y-20">
        {sections.map((section, i) => (
          <div key={i} className="space-y-6">
             <div className="flex items-center space-x-6">
                <span className="text-xs font-black text-primary font-mono tracking-tighter">0{i+1}</span>
                <h2 className="text-2xl font-black uppercase tracking-widest italic text-dark-1">{section.title}</h2>
             </div>
             <p className="text-gray-500 font-light leading-[2] text-base pl-12 border-l border-gray-50">
               {section.content}
             </p>
          </div>
        ))}

        <div className="pt-20 border-t border-gray-100 text-center">
           <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.4em]">Revised & Finalized: May 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
