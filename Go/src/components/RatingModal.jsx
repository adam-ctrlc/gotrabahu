import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  initialRating,
  applicantName,
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  if (!isOpen) return null;

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleMouseEnter = (starValue) => {
    setHoveredRating(starValue);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto'>
        <h2 className='text-xl font-bold text-gray-900 mb-4'>
          Rate {applicantName}
        </h2>
        <div className='flex justify-center mb-6'>
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            return (
              <Star
                key={starValue}
                className={`w-8 h-8 cursor-pointer ${
                  displayRating >= starValue
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }
                `}
                onClick={() => handleStarClick(starValue)}
                onMouseEnter={() => handleMouseEnter(starValue)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </div>
        <div className='flex justify-end gap-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(rating)}
            disabled={rating === 0}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
}
