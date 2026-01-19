import { Toaster } from 'react-hot-toast';

export default function MobileToast() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        // Default options - COMPACT for mobile
        duration: 2000, // Shorter duration
        style: {
          background: '#fff',
          color: '#333',
          padding: '8px 12px', // Reduced padding
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          fontSize: '12px', // Smaller font
          fontWeight: '500',
          maxWidth: '85vw', // Slightly narrower
          minHeight: 'auto', // Allow compact height
        },
        
        // Success
        success: {
          duration: 2500,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #86efac',
          },
        },
        
        // Error
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fca5a5',
          },
        },
        
        // Loading
        loading: {
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#fff',
          },
          style: {
            background: '#eff6ff',
            color: '#1e40af',
            border: '1px solid #93c5fd',
          },
        },
      }}
      containerStyle={{
        top: 70, // Closer to navbar
        left: 12,
        right: 12,
      }}
      containerClassName="mobile-toast-container"
      gutter={6} // Reduced gap between toasts
    />
  );
}

