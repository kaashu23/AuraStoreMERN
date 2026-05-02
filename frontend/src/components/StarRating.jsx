import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating, count, size = 12 }) => {
  const stars = [];
  
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-yellow-500" size={size} />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" size={size} />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-200" size={size} />);
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-0.5">
        {stars}
      </div>
      {count !== undefined && (
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
          ({count})
        </span>
      )}
    </div>
  );
};

export default StarRating;
