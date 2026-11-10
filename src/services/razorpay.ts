// =============================================================================
// INSTAPRINT - RAZORPAY STANDARD WEB CHECKOUT CLIENT SERVICE
// =============================================================================
import { STORE_INFO } from '../data/products';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

// Client-safe key only (KEY_SECRET remains strictly on backend)
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Txfm24JDWEObyY';

/**
 * Ensures Razorpay Checkout script is loaded in browser
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * STEP 1: Calls backend endpoint POST /api/create-order
 * Request: { amount (paise), currency: 'INR', receipt }
 * Return: { order_id, amount, currency }
 */
export const createRazorpayOrder = async (
  amountInRupees: number,
  receipt?: string
): Promise<{ order_id: string; amount: number; currency: string; key_id?: string }> => {
  const amountInPaise = Math.round(amountInRupees * 100);

  if (amountInPaise < 100) {
    throw new Error('Minimum order amount for Razorpay is ₹1.00 (100 paise).');
  }

  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create Razorpay order');
  }

  return data;
};

/**
 * STEP 3: Calls backend endpoint POST /api/verify-payment
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 */
export const verifyRazorpayPayment = async (
  paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
): Promise<{ success: boolean; message?: string; error?: string }> => {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Payment signature verification failed. Do NOT mark as paid.');
  }

  return data;
};

export interface RazorpayCheckoutParams {
  amountInRupees: number;
  receipt?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  description?: string;
  onSuccess: (payment: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onError: (errorMessage: string) => void;
  onDismiss?: () => void;
}

/**
 * STEP 2: Opens Razorpay Standard Web Checkout Modal
 */
export const openRazorpayCheckout = async (options: RazorpayCheckoutParams): Promise<void> => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    options.onError('Unable to load Razorpay Checkout SDK. Please check your internet connection.');
    return;
  }

  try {
    // 1. Create order on backend (receives order_id, amount, currency)
    const orderData = await createRazorpayOrder(options.amountInRupees, options.receipt);

    // 2. Configure standard checkout options
    const razorpayOptions = {
      key: orderData.key_id || RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: STORE_INFO.name,
      description: options.description || 'Custom Print Order • Baranagar Studio',
      image: '/logo.png',
      order_id: orderData.order_id,
      prefill: {
        name: options.customerName,
        email: options.customerEmail || 'customer@instaprintkolkata.com',
        contact: options.customerPhone
      },
      notes: {
        store: STORE_INFO.name,
        address: STORE_INFO.address
      },
      theme: {
        color: '#f43f5e'
      },
      modal: {
        ondismiss: () => {
          if (options.onDismiss) {
            options.onDismiss();
          }
        }
      },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        try {
          // 3. Verify signature on backend
          await verifyRazorpayPayment(response);
          options.onSuccess(response);
        } catch (err: any) {
          options.onError(err.message || 'Payment signature verification failed. Order not marked as paid.');
        }
      }
    };

    const rzp = new window.Razorpay(razorpayOptions);

    // Handle payment failed event
    rzp.on('payment.failed', (response: any) => {
      console.error('[Razorpay] Payment failed event:', response.error);
      options.onError(response.error?.description || 'Payment was declined or failed. Please try again.');
    });

    rzp.open();
  } catch (err: any) {
    options.onError(err.message || 'Failed to initiate Razorpay checkout.');
  }
};
