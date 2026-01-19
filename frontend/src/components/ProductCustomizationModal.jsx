import { useState, useEffect } from 'react';
import ProductCustomizationModalMobile from './ProductCustomizationModalMobile';
import ProductCustomizationModalDesktop from './ProductCustomizationModalDesktop';

/**
 * Main ProductCustomizationModal Component
 *
 * This is a WRAPPER component that detects the device type and renders
 * the appropriate modal component:
 * - Mobile (< 768px): ProductCustomizationModalMobile
 * - Desktop (≥ 768px): ProductCustomizationModalDesktop
 *
 * This separation allows us to:
 * 1. Maintain separate codebases for mobile and desktop
 * 2. Prevent mobile changes from affecting desktop (and vice versa)
 * 3. Optimize each view independently
 * 4. Easier maintenance and debugging
 */
export default function ProductCustomizationModal({ product, isOpen, onClose }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect device type on mount and window resize
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768); // 768px = Tailwind 'md' breakpoint
    };

    checkDevice(); // Initial check
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Render the appropriate component based on device type
  if (isMobile) {
    return <ProductCustomizationModalMobile product={product} isOpen={isOpen} onClose={onClose} />;
  } else {
    return <ProductCustomizationModalDesktop product={product} isOpen={isOpen} onClose={onClose} />;
  }
}