import { Toaster } from 'react-hot-toast';

export default function MobileToast() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        // Default options
        duration: 3000,
        style: {
          background: '#fff',
          color: '#333',
          padding: '12px 16px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '14px',
          fontWeight: '500',
          maxWidth: '90vw',
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
        top: 80, // Below navbar
        left: 16,
        right: 16,
      }}
      containerClassName="mobile-toast-container"
    />
  );
}

