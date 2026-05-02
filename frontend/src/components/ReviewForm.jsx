import React, { useState } from 'react';
import { FaStar, FaSpinner } from 'react-icons/fa';
import api from '../utils/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const { getToken } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return toast.error('Please include your detailed experience.');

    setLoading(true);
    try {
      const token = await getToken();
      await api.post(`/reviews/${productId}`, { rating, comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Your experience has been recorded.', {
          position: 'bottom-right'
      });
      setComment('');
      setRating(5);
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      console.error('Review error:', error);
      toast.error(error.response?.data?.message || 'Verification failed. Have you acquired and received this item?', {
          position: 'bottom-right'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 sm:p-12 border border-gray-100 shadow-sm animate-fade-in">
      <div className="space-y-2 mb-10">
        <p className="text-primary text-[9px] font-black uppercase tracking-[0.5em]">Contribution</p>
        <h3 className="text-2xl font-light italic uppercase tracking-tighter text-dark-1">Write a Review</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Rating Selector */}
        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Personal Rating</label>
          <div className="flex space-x-3">
            {[...Array(5)].map((_, i) => {
              const ratingValue = i + 1;
              return (
                <button
                  key={i}
                  type="button"
                  className={`text-2xl transition-all duration-300 transform ${
                    ratingValue <= (hover || rating) ? 'text-primary scale-110' : 'text-gray-100 hover:text-gray-200'
                  }`}
                  onClick={() => setRating(ratingValue)}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                >
                  <FaStar />
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Comment Area */}
        <div className="space-y-4">
          <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Detailed Experience</label>
          <textarea
            required
            rows="5"
            className="w-full bg-gray-50 border-none py-4 px-6 text-sm font-light leading-relaxed placeholder:text-gray-200 focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            placeholder="HOW WOULD YOU DESCRIBE THIS ACQUISITION?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-premium w-full flex items-center justify-center space-x-4 py-5 shadow-2xl shadow-primary/10"
        >
          {loading ? (
            <FaSpinner className="animate-spin" size={16} />
          ) : (
            <>
              <span>Dispatch Review</span>
            </>
          )}
        </button>
        
        <p className="text-center text-[8px] text-gray-400 uppercase tracking-[0.3em] font-medium leading-relaxed px-4">
          Submissions are verified against historical acquisition records.
        </p>
      </form>
    </div>
  );
};

export default ReviewForm;
