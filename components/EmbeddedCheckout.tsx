"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EmbeddedCheckoutProps {
  cartId: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
  onCheckoutComplete?: () => void;
  onCheckoutError?: (error: any) => void;
}

export default function EmbeddedCheckout({
    cartId,
    customerInfo,
    onCheckoutComplete,
    onCheckoutError,
  }: EmbeddedCheckoutProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      console.log("EmbeddedCheckout - Customer Info:", customerInfo);
      console.log("EmbeddedCheckout - Cart ID:", cartId);
  
      if (!cartId) {
        setError('Cart ID is required to initialize checkout');
        setIsLoading(false);
        return;
      }
  
      // Keep track of whether component is mounted
      let isMounted = true;
  
      // Initialize the checkout via Next.js API and get the checkout URL
      async function initializeCheckout() {
        try {
          console.log("Initializing checkout via API...");
          const response = await fetch('/api/bigcommerce/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cartId: cartId,
              customer: customerInfo
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
              
              // Instead of setting the URL for an iframe, redirect the browser to the checkout URL
              window.location.href = data.checkoutUrl;
              
              // If you prefer to use Next.js router instead:
              // router.push(data.checkoutUrl);
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
          if (onCheckoutError) {
            onCheckoutError(err);
          }
        }
      }
  
      // Start the checkout process
      initializeCheckout();
  
      // Cleanup function
      return () => {
        isMounted = false;
      };
    }, [cartId, customerInfo, onCheckoutComplete, onCheckoutError, router]);
  
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
  
        {error && (
          <div className="p-6 border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-600 font-medium">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry Checkout
            </Button>
          </div>
        )}
  
        {isLoading && !error && (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="ml-4 text-lg">Loading checkout...</p>
          </div>
        )}
      </div>
    );
  }