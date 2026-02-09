import React, { useState, useEffect } from 'react';

/**
 * Simple Guide Component
 * Shows hand symbol (👉) on elements one at a time
 */
export default function GuideHighlight({
  currentStep,
  selectedItemId,
  availableItems,
  placedItems,
  onComplete
}) {
  const [currentPhase, setCurrentPhase] = useState('quick-guide');
  const [isActive, setIsActive] = useState(false);
  const [quickGuideClicked, setQuickGuideClicked] = useState(false);

  // Determine which phase we're in based on user actions
  useEffect(() => {
    console.log('GuideHighlight - currentStep:', currentStep);
    console.log('GuideHighlight - quickGuideClicked:', quickGuideClicked);
    console.log('GuideHighlight - selectedItemId:', selectedItemId);
    console.log('GuideHighlight - availableItems.length:', availableItems.length);
    console.log('GuideHighlight - placedItems.length:', placedItems.length);

    if (currentStep !== 2) {
      console.log('GuideHighlight - Not on step 2, hiding');
      setIsActive(false);
      return;
    }

    // Check if guide was already completed
    const guideCompleted = localStorage.getItem('hamperGuideCompleted');
    if (guideCompleted) {
      console.log('GuideHighlight - Guide already completed');
      setIsActive(false);
      return;
    }

    setIsActive(true);

    // Phase 1: Show hand on Quick Guide (initial state)
    if (!quickGuideClicked) {
      console.log('📍 Phase 1: Quick Guide');
      setCurrentPhase('quick-guide');
    }
    // Phase 2: Show hand on Available Items
    else if (quickGuideClicked && !selectedItemId) {
      // If items exist, point to first item; otherwise point to chevron/section
      if (availableItems.length > 0) {
        console.log('📍 Phase 2: Available Items - Point to first item');
        setCurrentPhase('available-items-item');
      } else {
        console.log('📍 Phase 2: Available Items - Point to section');
        setCurrentPhase('available-items');
      }
    }
    // Phase 3: Show hand on Hamper Box (after item selected)
    else if (selectedItemId) {
      console.log('📍 Phase 3: Hamper Box - Item selected, show placement area');
      setCurrentPhase('hamper-box');
    }
    // Complete: User has placed items
    if (placedItems.length > 0) {
      console.log('✅ Guide Complete!');
      setIsActive(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentStep, quickGuideClicked, selectedItemId, availableItems, placedItems, onComplete]);

  // Add click listeners to track user progress
  useEffect(() => {
    const handleQuickGuideClick = (e) => {
      console.log('🖱️ Quick Guide clicked!');
      setQuickGuideClicked(true);
      console.log('✅ quickGuideClicked set to true');
    };

    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const quickGuideEl = document.querySelector('[data-guide="quick-guide"]');

      console.log('🔧 Setting up click listeners:', {
        quickGuideEl: !!quickGuideEl
      });

      if (quickGuideEl) {
        quickGuideEl.addEventListener('click', handleQuickGuideClick, true);
        console.log('✅ Quick Guide listener attached');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const quickGuideEl = document.querySelector('[data-guide="quick-guide"]');

      if (quickGuideEl) quickGuideEl.removeEventListener('click', handleQuickGuideClick, true);
    };
  }, []);

  // Add/remove hand symbols
  useEffect(() => {
    console.log('GuideHighlight - isActive:', isActive, 'currentPhase:', currentPhase);

    if (!isActive) {
      // Remove all hand symbols
      document.querySelectorAll('.guide-hand-symbol').forEach(el => el.remove());
      console.log('GuideHighlight - Removed all hand symbols (not active)');
      return;
    }

    // Wait a bit for DOM to be ready
    const timer = setTimeout(() => {
      // Remove previous hand symbols
      document.querySelectorAll('.guide-hand-symbol').forEach(el => el.remove());

      let element = null;
      let textElement = null;

      // Special handling for available-items-item phase
      if (currentPhase === 'available-items-item') {
        // Find the first item in the available items list
        const availableItemsSection = document.querySelector('[data-guide="available-items"]');
        if (availableItemsSection) {
          // Look for the first item card in the collapsible content
          const firstItemCard = availableItemsSection.parentElement.querySelector('.grid > div:first-child, .space-y-2 > div:first-child');
          if (firstItemCard) {
            element = firstItemCard;
            // Try to find the item name or use the card itself
            textElement = firstItemCard.querySelector('h4, .font-semibold, .text-sm') || firstItemCard;
            console.log('GuideHighlight - Found first item card:', firstItemCard);
          }
        }
      } else {
        // Normal phase handling
        const selector = `[data-guide="${currentPhase}"]`;
        element = document.querySelector(selector);
        console.log('GuideHighlight - Looking for:', selector, 'Found:', element);

        if (element) {
          // Special handling for Available Items section - append to chevron icon wrapper
          if (currentPhase === 'available-items') {
            const chevronWrapper = element.querySelector('.chevron-icon-wrapper');
            textElement = chevronWrapper || element.querySelector('h3, h4, .font-bold') || element;
            console.log('GuideHighlight - Found chevron wrapper:', chevronWrapper);
          } else {
            textElement = element.querySelector('h3, h4, .font-bold') || element;
          }
        }
      }

      if (element && textElement) {
        // Create hand symbol element
        const handSymbol = document.createElement('span');
        handSymbol.className = 'guide-hand-symbol';
        handSymbol.innerHTML = ' 👉';
        handSymbol.style.cssText = `
          display: inline-block;
          animation: handBounce 1s ease-in-out infinite;
          margin-left: 8px;
          font-size: 1.5rem;
        `;

        console.log('GuideHighlight - Appending hand to:', textElement);
        textElement.appendChild(handSymbol);
        console.log('GuideHighlight - Hand symbol added! 👉');

        // Scroll element into view smoothly
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }, 100);
      } else {
        console.log('GuideHighlight - Element not found for phase:', currentPhase);
        console.log('GuideHighlight - All elements with data-guide:', document.querySelectorAll('[data-guide]'));
      }
    }, 500); // Wait 500ms for DOM to be ready

    return () => clearTimeout(timer);
  }, [currentPhase, isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.querySelectorAll('.guide-hand-symbol').forEach(el => el.remove());
    };
  }, []);

  return null; // This component doesn't render anything, just adds hand symbols
}

