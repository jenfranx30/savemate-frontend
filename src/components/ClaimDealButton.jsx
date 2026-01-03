// src/components/ClaimDealButton.jsx
// Button component to claim a deal and track savings

import { useState } from 'react';
import { trackMoneySaved, formatCurrency } from '../utils/moneySavedTracker';

export default function ClaimDealButton({ deal, className = '' }) {
  const [claimed, setClaimed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClaimDeal = () => {
    if (claimed) return;

    // Track the savings
    const savings = trackMoneySaved(deal);
    
    // Set claimed state
    setClaimed(true);
    setShowConfetti(true);

    // Show success notification
    const savingsText = formatCurrency(savings);
    alert(`🎉 Deal Claimed!\n\nYou saved ${savingsText}!\n\nOriginal: ${formatCurrency(deal.original_price)}\nDiscounted: ${formatCurrency(deal.discounted_price)}`);

    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const savings = deal.original_price - deal.discounted_price;

  return (
    <div className="relative">
      <button
        onClick={handleClaimDeal}
        disabled={claimed}
        className={`
          ${claimed 
            ? 'bg-green-600 cursor-not-allowed' 
            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
          }
          text-white px-8 py-4 rounded-xl font-bold text-lg
          transition-all duration-300 shadow-lg hover:shadow-xl
          flex items-center gap-3 justify-center w-full
          ${className}
        `}
      >
        {claimed ? (
          <>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Deal Claimed! Saved {formatCurrency(savings)}</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Claim Deal - Save {formatCurrency(savings)}</span>
          </>
        )}
      </button>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="confetti-container">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 2s ease-out forwards;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(300px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
