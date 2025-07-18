'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    loadJokulCheckout: (url: string) => void;
  }
}

interface DokuCheckoutProps {
  checkoutUrl: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export default function DokuCheckout({ checkoutUrl, onSuccess, onError }: DokuCheckoutProps) {
  useEffect(() => {
    // Load DOKU Checkout JS
    const script = document.createElement('script');
    script.src = 'https://sandbox.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js';
    script.async = true;
    script.onload = () => {
      console.log('DOKU Checkout JS loaded');
    };
    script.onerror = (error: unknown) => {
      console.error('Failed to load DOKU Checkout JS:', error);
      onError?.(error);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onError]);

  const handleCheckout = () => {
    try {
      if (typeof window.loadJokulCheckout === 'function') {
        window.loadJokulCheckout(checkoutUrl);
        onSuccess?.();
      } else {
        throw new Error('DOKU Checkout JS not loaded');
      }
    } catch (error: unknown) {
      console.error('Failed to load checkout:', error);
      onError?.(error);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
    >
      Bayar Sekarang
    </button>
  );
} 