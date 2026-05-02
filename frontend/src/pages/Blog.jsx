import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaRegCalendarAlt, FaUserEdit } from 'react-icons/fa';

const Blog = () => {
  const articles = [
    {
      id: 1,
      cat: 'LIFESTYLE',
      title: 'The Minimalist Wardrobe: Quality over Quantity',
      excerpt: 'In an era of fast fashion, discover why investing in timeless, high-quality pieces is the ultimate style statement for 2026.',
      date: 'May 12, 2026',
      author: 'Elena Vance',
      img: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      cat: 'FASHION',
      title: 'Sustainable Silk: The Aura Store Collection',
      excerpt: 'Explore the journey of our latest eco-friendly silk line, from ethical harvesting to the final exquisite garment.',
      date: 'May 08, 2026',
      author: 'Marcus Aurelius',
      img: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      cat: 'TECH',
      title: 'Smart Wearables that Complement High Fashion',
      excerpt: 'Technology meets aesthetics. We review the latest smart devices that seamlessly integrate into your premium lifestyle.',
      date: 'May 05, 2026',
      author: 'Sarah Chen',
      img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      cat: 'CULTURE',
      title: 'The Rise of Digital Elegance in Modern Art',
      excerpt: 'How digital transformations are influencing the way we perceive beauty and sophistication in the current decade.',
      date: 'April 28, 2026',
      author: 'Julian Thorne',
      img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      cat: 'STYLING',
      title: 'Monochrome Magic: Mastering the All-Black Look',
      excerpt: 'A deep dive into texture and layering to make the most versatile color palette work for any occasion.',
      date: 'April 20, 2026',
      author: 'Elena Vance',
      img: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      cat: 'INTERIORS',
      title: 'Curating Space: The Aura Home Philosophy',
      excerpt: 'Bringing the same level of curation to your living space as you do to your wardrobe. Minimalist home essentials.',
      date: 'April 15, 2026',
      author: 'David H',
      img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Blog Hero */}
      <section className="py-24 border-b border-gray-50 bg-gray-50/30">
        <div className="section-container text-center space-y-6">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">The Aura Journal</p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-dark-1 uppercase italic leading-none">Curated Thoughts</h1>
          <p className="text-gray-400 font-light text-lg max-w-xl mx-auto leading-relaxed italic">
            "Design is a silent ambassador of your brand." — Discover the stories behind our collections.
          </p>
        </div>
      </section>

      {/* Main Articles Grid */}
      <section className="py-24 sm:py-32">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {articles.map((article) => (
              <div key={article.id} className="group cursor-pointer flex flex-col h-full">
                <div className="aspect-[16/10] overflow-hidden mb-8 bg-white transition-all duration-700 group-hover:shadow-2xl relative">
                  <img 
                    src={article.img} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-dark-1 shadow-sm">
                      {article.cat}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-5">
                  <div className="flex items-center space-x-6 text-[9px] font-black uppercase tracking-widest text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FaRegCalendarAlt size={10} className="text-primary" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaUserEdit size={10} className="text-primary" />
                      <span>{article.author}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-dark-1 group-hover:text-primary transition-colors leading-tight italic">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 font-light text-sm leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50">
                  <button className="text-[10px] font-black uppercase tracking-[0.3em] text-dark-1 group-hover:text-primary flex items-center space-x-4 transition-all">
                    <span>Read Article</span>
                    <FaArrowRight size={10} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Placeholder */}
          <div className="mt-32 text-center">
             <button className="btn-premium px-16">
                Explore Archives
             </button>
          </div>
        </div>
      </section>

      {/* Featured Quote Section */}
      <section className="bg-dark-1 py-32 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
         <div className="section-container relative z-10 text-center space-y-12">
            <h2 className="text-white text-3xl md:text-5xl font-light italic leading-tight max-w-4xl mx-auto tracking-tight">
               "Luxury is not the opposite of poverty; <br /> it is the opposite of vulgarity."
            </h2>
            <div className="space-y-2">
               <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Coco Chanel</p>
               <p className="text-gray-600 text-[8px] font-black uppercase tracking-[0.3em]">Style Icon & Visionary</p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Blog;
