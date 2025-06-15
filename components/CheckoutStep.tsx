"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useForm } from "@/contexts/FormContext";

export default function EmbeddedCheckoutStep() {
  const router = useRouter();
  const { formData, prevStep, updateFormData, saveProgress } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("EmbeddedCheckout - Form Data:", formData);
    console.log("EmbeddedCheckout - Cart ID:", formData.cartId);
    console.log("EmbeddedCheckout - Customer Info:", formData.customerInfo);

    if (!formData.cartId) {
      setError('Cart ID is required to initialize checkout');
      setIsLoading(false);
      return;
    }

    if (!formData.customerInfo) {
      setError('Customer information is required to initialize checkout');
      setIsLoading(false);
      return;
    }

    // Keep track of whether component is mounted
    let isMounted = true;

    // Initialize the checkout via Next.js API and get the checkout URL
    async function initializeCheckout() {
      try {
        console.log("Initializing checkout via API...");
        
        // Prepare customer data in the format expected by the API
        const customerData = {
          firstName: formData.customerInfo?.firstName,
          lastName: formData.customerInfo?.lastName,
          email: formData.customerInfo?.email,
          phone: formData.customerInfo?.phone,
          address: formData.customerInfo?.address,
          city: formData.customerInfo?.city,
          state: formData.customerInfo?.state,
          zipCode: formData.customerInfo?.zipCode,
        };

        const response = await fetch('/api/bigcommerce/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartId: formData.cartId,
            customer: customerData
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to initialize checkout');
        }

        const data = await response.json();
        console.log("Checkout initialized via API:", data);

        if (data.success && data.checkoutUrl) {
          if (isMounted) {
            console.log("Checkout URL received:", data.checkoutUrl);
            
            // Update form data with checkout URL
            updateFormData({
              checkoutUrl: data.checkoutUrl
            });
            
            // Save progress
            await saveProgress();
            
            // Redirect to checkout URL
            window.location.href = data.checkoutUrl;
          }
        } else {
          throw new Error('Checkout URL not provided by API');
        }
      } catch (err: any) {
        console.error('Error initializing checkout via API:', err);
        if (isMounted) {
          setError(err.message || 'Failed to initialize checkout');
          setIsLoading(false);
        }
      }
    }

    // If we already have a checkout URL, redirect immediately
    if (formData.checkoutUrl) {
      console.log("Checkout URL already exists, redirecting:", formData.checkoutUrl);
      window.location.href = formData.checkoutUrl;
      return;
    }

    // Otherwise, initialize checkout
    initializeCheckout();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [formData.cartId, formData.customerInfo, formData.checkoutUrl, updateFormData, saveProgress]);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Clear the checkout URL to force re-initialization
    updateFormData({ checkoutUrl: undefined });
    // Reload the page to restart the process
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={prevStep}
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customer Info
      </Button>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Checkout</h2>
        <p className="text-gray-600">
          {isLoading ? 'Preparing your checkout...' : 'Complete your purchase'}
        </p>
      </div>

      {error && (
        <div className="p-6 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600 font-medium mb-2">Checkout Error</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <div className="flex gap-2">
            <Button 
              onClick={handleRetry}
              className="flex-1"
            >
              Retry Checkout
            </Button>
            <Button 
              variant="outline"
              onClick={prevStep}
              className="flex-1"
            >
              Back to Customer Info
            </Button>
          </div>
        </div>
      )}

      {isLoading && !error && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-lg">Initializing checkout...</p>
          <p className="text-sm text-gray-600">
            Please wait while we prepare your secure checkout experience
          </p>
        </div>
      )}

      {/* Debug information (remove in production) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
          <p><strong>Debug Info:</strong></p>
          <p>Cart ID: {formData.cartId || 'Not set'}</p>
          <p>Checkout URL: {formData.checkoutUrl || 'Not set'}</p>
          <p>Customer Email: {formData.customerInfo?.email || 'Not set'}</p>
          <p>Error: {error || 'None'}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        </div>
      )} */}
    </div>
  );
}