import React, { useState, useEffect } from 'react';

/**
 * Simple Hand Pointer Guide Component
 * Points to elements in sequence to guide users
 */
export default function HandPointer({ 
  currentStep,
  selectedItemId,
  availableItems,
  placedItems,
  onComplete 
}) {
  const [targetElement, setTargetElement] = useState(null);
  const [handPosition, setHandPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('quick-guide');

  // Determine which phase we're in based on user actions
  useEffect(() => {
    console.log('HandPointer - Step:', currentStep, 'Items:', availableItems.length, 'Selected:', selectedItemId, 'Placed:', placedItems.length);

    if (currentStep !== 2) {
      setIsVisible(false);
      return;
    }

    // Check if guide was already completed
    const guideCompleted = localStorage.getItem('hamperGuideCompleted');
    if (guideCompleted) {
      console.log('HandPointer - Guide already completed');
      setIsVisible(false);
      return;
    }

    // Phase 1: Point to Quick Guide (initial state - no items, nothing selected)
    if (availableItems.length === 0 && !selectedItemId && placedItems.length === 0) {
      console.log('HandPointer - Phase 1: Quick Guide');
      setCurrentPhase('quick-guide');
      setIsVisible(true);
    }
    // Phase 2: Point to Available Items (has items but none selected)
    else if (availableItems.length > 0 && !selectedItemId && placedItems.length === 0) {
      console.log('HandPointer - Phase 2: Available Items');
      setCurrentPhase('available-items');
      setIsVisible(true);
    }
    // Phase 3: Point to Quick Tips (item selected but not placed)
    else if (selectedItemId && placedItems.length === 0) {
      console.log('HandPointer - Phase 3: Quick Tips');
      setCurrentPhase('quick-tips');
      setIsVisible(true);

      // After 2 seconds, move to hamper box
      const timer = setTimeout(() => {
        console.log('HandPointer - Phase 4: Hamper Box');
        setCurrentPhase('hamper-box');
      }, 2000);

      return () => clearTimeout(timer);
    }
    // Complete: User has placed items
    else if (placedItems.length > 0) {
      console.log('HandPointer - Complete!');
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentStep, selectedItemId, availableItems, placedItems, onComplete]);

  // Update hand position when phase changes
  useEffect(() => {
    updateHandPosition();

    // Re-calculate position on window resize and scroll
    const handleResize = () => updateHandPosition();
    const handleScroll = () => updateHandPosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPhase]);

  const updateHandPosition = () => {
    let selector = null;

    switch (currentPhase) {
      case 'quick-guide':
        selector = '[data-guide="quick-guide"]';
        break;
      case 'available-items':
        selector = '[data-guide="available-items"]';
        break;
      case 'quick-tips':
        selector = '[data-guide="quick-tips"]';
        break;
      case 'hamper-box':
        selector = '[data-guide="hamper-box"]';
        break;
      default:
        break;
    }

    if (selector) {
      const element = document.querySelector(selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        setTargetElement(element);

        // Mobile-friendly positioning
        const isMobile = window.innerWidth < 768;

        const newPosition = isMobile
          ? {
              top: rect.top + scrollY + rect.height / 2,
              left: Math.max(10, rect.left - 60), // 60px to the left, minimum 10px from edge
            }
          : {
              top: rect.top + scrollY + rect.height / 2,
              left: rect.right + 20,
            };

        console.log('HandPointer - Position:', currentPhase, newPosition, 'Element:', selector);
        setHandPosition(newPosition);
      } else {
        console.log('HandPointer - Element not found:', selector);
      }
    }
  };

  if (!isVisible) return null;

  // Get helper text based on current phase
  const getHelperText = () => {
    switch (currentPhase) {
      case 'quick-guide':
        return 'Tap here to see how it works!';
      case 'available-items':
        return 'Select an item to add!';
      case 'quick-tips':
        return 'Read these helpful tips!';
      case 'hamper-box':
        return 'Tap green spot to place item!';
      default:
        return '';
    }
  };

  return (
    <div
      className="fixed z-[9999] pointer-events-none transition-all duration-700 ease-in-out"
      style={{
        top: `${handPosition.top}px`,
        left: `${handPosition.left}px`,
        transform: 'translate(0, -50%)',
      }}
    >
      {/* Animated hand pointer */}
      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-2">
        {/* Hand emoji/icon */}
        <div className="relative animate-bounce">
          {/* Glow effect */}
          <div className="absolute inset-0 -m-3">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-400/50 animate-ping"></div>
          </div>

          {/* Hand emoji - responsive size */}
          <div className="relative text-5xl md:text-6xl drop-shadow-2xl" style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))' }}>
            👉
          </div>

          {/* Pulsing ring */}
          <div className="absolute inset-0 -m-1 md:-m-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-3 md:border-4 border-yellow-500 animate-pulse opacity-80"></div>
          </div>
        </div>

        {/* Helper text bubble - mobile friendly */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-2xl animate-pulse max-w-[200px] md:max-w-none">
          <p className="text-xs md:text-sm font-bold whitespace-normal md:whitespace-nowrap">{getHelperText()}</p>
        </div>
      </div>
    </div>
  );
}

