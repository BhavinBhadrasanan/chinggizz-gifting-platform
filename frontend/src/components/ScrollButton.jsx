import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function ScrollButton() {
  const [showButton, setShowButton] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Always show button (we'll handle visibility with CSS)
      setShowButton(true);

      // Check if near bottom (within 200px from bottom)
      const distanceFromBottom = documentHeight - (currentPosition + windowHeight);
      setIsNearBottom(distanceFromBottom < 200);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const currentPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const distanceFromBottom = documentHeight - (currentPosition + windowHeight);

    if (distanceFromBottom < 200) {
      // Near bottom - scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Not at bottom - scroll to bottom
      window.scrollTo({
        top: documentHeight,
        behavior: 'smooth'
      });
    }
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50">
      <button
        onClick={handleClick}
        className="group bg-gradient-to-br from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white p-3 sm:p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-90 border-2 border-white"
        aria-label={isNearBottom ? "Scroll to top" : "Scroll to bottom"}
        title={isNearBottom ? "Scroll to top" : "Scroll to bottom"}
      >
        {isNearBottom ? (
          <ChevronUp className="h-6 w-6 sm:h-7 sm:w-7 group-hover:animate-bounce" />
        ) : (
          <ChevronDown className="h-6 w-6 sm:h-7 sm:w-7 group-hover:animate-bounce" />
        )}
      </button>
    </div>
  );
}

