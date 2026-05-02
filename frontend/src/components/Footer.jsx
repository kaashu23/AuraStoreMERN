import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaSearch, FaChevronRight } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark-1 text-white pt-20 md:pt-32 pb-12">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 lg:gap-20 mb-20">
          
          {/* Logo & Description */}
          <div className="space-y-8 col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-black tracking-tighter">AURA STORE</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-light max-w-sm">
              Redefining modern elegance through sustainable practices and high-end design. Join us in our journey to create a more beautiful world.
            </p>
            <div className="flex space-x-6">
              {[FaFacebookF, FaTwitter, FaInstagram, FaPinterestP].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-white transition-all duration-300">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* About Links */}
          <div className="space-y-8 lg:pl-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Our Story</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Aura', path: '/about' },
                { name: 'Sustainability', path: '/sustainability' },
                { name: 'Careers', path: '/careers' },
                { name: 'Journal', path: '/blog' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm font-light text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Customer Service</h4>
            <ul className="space-y-4">
              {[
                { name: 'Contact Us', path: '/contact' },
                { name: 'Shipping & Returns', path: '/shipping' },
                { name: 'FAQs', path: '/faq' },
                { name: 'Privacy Policy', path: '/privacy' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-sm font-light text-gray-400 hover:text-white hover:translate-x-1 transition-all inline-block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Search */}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Join the Elite</h4>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-transparent border-b border-gray-800 py-3 text-[10px] font-black uppercase tracking-widest focus:border-accent transition-colors outline-none placeholder:text-gray-700"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">
            © 2026 AURA STORE. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
             <div className="flex items-center space-x-6 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
              <div className="flex items-center space-x-4 grayscale opacity-30">
                {/* Simple representation of payment icons */}
                <span className="text-[10px] font-black border border-gray-700 px-2 py-0.5 rounded">VISA</span>
                <span className="text-[10px] font-black border border-gray-700 px-2 py-0.5 rounded">STRIPE</span>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
