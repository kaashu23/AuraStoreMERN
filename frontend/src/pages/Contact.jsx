import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaChevronRight } from 'react-icons/fa';
import api from '../utils/axios';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/contact', formData);
      toast.success('Your message has been sent to our concierge.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Contact Error:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* Header */}
      <section className="py-24 border-b border-gray-50">
        <div className="section-container text-center space-y-6">
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Inquiries</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-dark-1 uppercase italic leading-none">Connect with Us</h1>
          <p className="text-gray-400 font-light text-lg max-w-xl mx-auto leading-relaxed">
            Our concierge team is available 24/7 to assist you with order tracking, product details, or styling advice.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 sm:py-32">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            
            {/* Contact Info */}
            <div className="space-y-16">
              <div className="space-y-10">
                <div className="flex items-start space-x-8">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-dark-1">
                    <FaMapMarkerAlt size={18} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-dark-1">Flagship Studio</h3>
                    <p className="text-gray-400 font-light leading-relaxed">
                      789 Elite Avenue, Fashion District <br />
                      New York, NY 10012, USA
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-8">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-dark-1">
                    <FaPhoneAlt size={18} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-dark-1">Concierge Line</h3>
                    <p className="text-gray-400 font-light leading-relaxed">+1 (888) AURA-ELITE</p>
                  </div>
                </div>

                <div className="flex items-start space-x-8">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-dark-1">
                    <FaEnvelope size={18} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-dark-1">Digital Inquiries</h3>
                    <p className="text-gray-400 font-light leading-relaxed">concierge@aurastore.premium</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video bg-gray-50 rounded-sm overflow-hidden grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Store Location" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50/50 p-10 md:p-16 border border-gray-50">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold tracking-widest uppercase focus:border-primary outline-none transition-colors"
                      placeholder="ENTER YOUR NAME"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold tracking-widest uppercase focus:border-primary outline-none transition-colors"
                      placeholder="ENTER YOUR EMAIL"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Message</label>
                    <textarea
                      name="message"
                      required
                      rows="4"
                      className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-bold tracking-widest uppercase focus:border-primary outline-none transition-colors resize-none"
                      placeholder="HOW CAN WE ASSIST YOU?"
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="btn-premium w-full flex items-center justify-center space-x-4 py-5 shadow-2xl shadow-primary/10"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FaChevronRight size={10} />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
