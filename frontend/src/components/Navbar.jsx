import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Gift, Menu, X, ShoppingBag, Home, Package, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();

  const isActive = (path) => location.pathname === path;

  // Warm, touching banner messages - rotating every 4 seconds
  const bannerMessages = [
    { icon: '💝', text: 'Crafted with Care, Delivered with Love' },
    { icon: '🎁', text: 'Customize Your Perfect Hamper with Chinggizz' },
    { icon: '✨', text: 'We\'re Here to Help You Create the Best Hampers' },
    { icon: '❤️', text: 'Every Gift Tells a Story - Let Us Help You Tell Yours' },
  ];

  // Rotate banner messages
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerMessages.length);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    // Ensure body scroll is unlocked when route changes
    document.body.style.overflow = 'unset';
  }, [location.pathname]);

  // Lock/unlock body scroll when mobile menu opens/closes
  useEffect(() => {
    if (isOpen) {
      // Lock scroll when menu is open (mobile only)
      if (window.innerWidth < 1024) {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('mobile-menu-open');
      }
    } else {
      // Unlock scroll when menu is closed
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isOpen]);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/hamper-builder', label: 'Build Hamper', icon: Sparkles },
    { path: '/admin/login', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Top Banner - Beautiful Animated Announcement Bar */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white py-3 overflow-hidden relative shadow-lg">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite]"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-[float_4s_ease-in-out_infinite]"></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/20 rounded-full animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/25 rounded-full animate-[float_6s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="flex items-center justify-center space-x-3 sm:space-x-4">
            {/* Animated icon with pulse effect */}
            <span className="text-lg sm:text-xl animate-[bounce_2s_ease-in-out_infinite] drop-shadow-lg" role="img" aria-label="gift">
              {bannerMessages[bannerIndex].icon}
            </span>

            {/* Rotating message with smooth slide animation */}
            <span
              key={bannerIndex}
              className="text-xs sm:text-sm md:text-base font-bold text-center tracking-wide animate-[slideIn_0.6s_ease-out] drop-shadow-md"
            >
              {bannerMessages[bannerIndex].text}
            </span>

            {/* Second animated icon with delayed pulse */}
            <span className="hidden sm:block text-lg sm:text-xl animate-[bounce_2s_ease-in-out_infinite] drop-shadow-lg" role="img" aria-label="gift" style={{ animationDelay: '0.3s' }}>
              {bannerMessages[bannerIndex].icon}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-40 border-b border-neutral-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - BEAUTIFUL ROUND LOGO */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              {/* Round Logo with Glow Effect */}
              <div className="relative">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-teal-500 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>

                {/* Logo Image - Round with Fallback */}
                <div className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300 ring-2 ring-orange-400/50 overflow-hidden bg-white">
                  <img
                    src="/chinggizz-logo.png"
                    alt="Chinggizz Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback: Show beautiful gradient with Gift icon if image not found
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-teal-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg></div>';
                    }}
                  />
                </div>
              </div>

              {/* Text - Always visible on mobile and up */}
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                  Chinggizz
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-xs text-neutral-500 font-medium -mt-1">Customised Gifts</span>
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`group relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      isActive(link.path)
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive(link.path) ? '' : 'group-hover:scale-110 transition-transform'}`} />
                    <span>{link.label}</span>
                    {!isActive(link.path) && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    )}
                  </Link>
                );
              })}

              {/* Cart Button - Desktop */}
              <button
                onClick={() => navigate('/cart', { state: { scrollToCart: true } })}
                className="relative group ml-3 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 shadow-lg shadow-secondary-500/30 hover:shadow-xl hover:shadow-secondary-500/40 transition-all duration-200 flex items-center space-x-2"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Cart</span>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ring-4 ring-white animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Actions - Visible on Mobile/Tablet */}
            <div className="flex lg:hidden items-center space-x-2">
              {/* Cart Button - Mobile */}
              <button
                onClick={() => navigate('/cart', { state: { scrollToCart: true } })}
                className="relative p-3 rounded-xl text-white bg-gradient-to-r from-secondary-500 to-secondary-600 shadow-lg shadow-secondary-500/30 tap-target"
              >
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center ring-2 sm:ring-4 ring-white animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* Menu Button - Mobile */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-3 rounded-xl text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 transition-colors tap-target"
              >
                {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - iOS Glassmorphism Style */}
          {isOpen && (
            <>
              {/* Backdrop overlay with enhanced blur */}
              <div
                className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-md z-30 animate-[fadeIn_0.2s_ease-out]"
                onClick={() => setIsOpen(false)}
              />

              {/* Compact dropdown menu - iOS Glass Effect */}
              <div className="lg:hidden absolute right-4 top-full mt-2 w-56 z-40 animate-[scaleIn_0.2s_cubic-bezier(0.16,1,0.3,1)]">
                {/* Glassy container with frosted glass effect */}
                <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] border border-white/40 overflow-hidden">
                  {/* Subtle gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-white/10 pointer-events-none"></div>

                  {/* Light reflection effect */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>

                  {/* Menu items - Liquid drop style */}
                  <div className="relative py-3 px-2">
                    {navLinks.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => {
                            setIsOpen(false);
                            setTimeout(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }, 100);
                          }}
                          className={`group relative flex items-center space-x-3 px-4 py-3 mb-1.5 last:mb-0 rounded-2xl transition-all duration-300 animate-[slideInRight_0.3s_ease-out] overflow-hidden ${
                            isActive(link.path)
                              ? 'bg-gradient-to-r from-primary-500/90 to-primary-600/90 text-white shadow-lg shadow-primary-500/30'
                              : 'text-neutral-700 hover:bg-white/60 active:bg-white/80'
                          }`}
                          style={{
                            animationDelay: `${index * 0.05}s`,
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)'
                          }}
                        >
                          {/* Liquid glass background for inactive items */}
                          {!isActive(link.path) && (
                            <>
                              {/* Base glass layer */}
                              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                              {/* Liquid shimmer effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>

                              {/* Inner glow */}
                              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </>
                          )}

                          {/* Active item glass effect */}
                          {isActive(link.path) && (
                            <>
                              {/* Glossy highlight */}
                              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-2xl"></div>

                              {/* Inner shadow for depth */}
                              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)]"></div>
                            </>
                          )}

                          {/* Icon with glass bubble effect */}
                          <div className={`relative z-10 p-1.5 rounded-xl transition-all duration-300 ${
                            isActive(link.path)
                              ? 'bg-white/20 shadow-lg backdrop-blur-sm'
                              : 'bg-white/40 group-hover:bg-white/60 group-hover:scale-110 group-hover:shadow-md backdrop-blur-sm'
                          }`}>
                            <Icon className={`h-4 w-4 transition-all duration-300 ${
                              isActive(link.path)
                                ? 'text-white drop-shadow-sm'
                                : 'text-primary-600 group-hover:text-primary-700'
                            }`} />
                          </div>

                          {/* Label with subtle shadow */}
                          <span className={`relative z-10 text-sm font-semibold tracking-wide ${
                            isActive(link.path) ? 'drop-shadow-sm' : ''
                          }`}>
                            {link.label}
                          </span>

                          {/* Active indicator - glowing dot */}
                          {isActive(link.path) && (
                            <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.8)] animate-pulse"></div>
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Bottom light reflection */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
                </div>

                {/* Outer glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-200/20 to-secondary-200/20 blur-xl -z-10 opacity-50"></div>
              </div>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

