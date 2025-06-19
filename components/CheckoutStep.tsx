"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CreditCard, User, MapPin, Shield, ExternalLink } from "lucide-react";
import { useForm } from "@/contexts/FormContext";
import collectionsData from '@/data/questions.json';

// Collections data - you might want to import this from a separate file


// Helper function to get question by ID
const getQuestionById = (questionId: string, collectionName?: string) => {
  if (!collectionName) return null;
  
  const collection = collectionsData.collections.find(
    col => col.collectionName === collectionName
  );
  
  if (!collection) return null;
  
  return collection.questions.find(q => q.id === questionId);
};

export default function EmbeddedCheckoutStep() {
  const router = useRouter();
  const { formData, prevStep, updateFormData, saveProgress } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(true);

  // Validation check
  const isReadyForCheckout = formData.cartId && formData.customerInfo;

  const initializeCheckout = async () => {
    if (!isReadyForCheckout) {
      setError('Cart ID and customer information are required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Initializing checkout via API...");
      
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
 //console.log( customerData )

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
        // Update form data with checkout URL
        updateFormData({
          checkoutUrl: data.checkoutUrl
        });
        
        // Save progress
        await saveProgress();
        
        // Redirect to checkout URL
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('Checkout URL not provided by API');
      }
    } catch (err: any) {
      console.error('Error initializing checkout via API:', err);
      setError(err.message || 'Failed to initialize checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToCheckout = () => {
    // If we already have a checkout URL, redirect immediately
    if (formData.checkoutUrl) {
      window.location.href = formData.checkoutUrl;
      return;
    }
    
    // Otherwise, initialize checkout
    setShowConfirmation(false);
    initializeCheckout();
  };

  const handleRetry = () => {
    setError(null);
    // Clear the checkout URL to force re-initialization
    updateFormData({ checkoutUrl: undefined });
    initializeCheckout();
  };

  // Show error state if not ready for checkout
  if (!isReadyForCheckout) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={prevStep}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="p-6 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600 font-medium mb-2">Cannot proceed to checkout</p>
          <p className="text-red-600 text-sm mb-4">
            {!formData.cartId && "Cart information is missing. "}
            {!formData.customerInfo && "Customer information is missing."}
          </p>
          <Button 
            variant="outline"
            onClick={prevStep}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Show confirmation screen
  if (showConfirmation && !isLoading) {
    return (
      <div className="space-y-6">
        {/* <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={prevStep}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customer Info
        </Button> */}

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Confirm Your Details</h2>
          <p className="text-gray-600">
            Review your information, plan details and proceed to secure checkout
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Order Summary</h3>
          </div>
          
          {formData.selectedProduct && (
            <div className="border-b pb-4">
               <h4 className="font-medium">{formData.collectionName}</h4>
              <h3 className="font-medium">{formData.selectedProduct.name}</h3>
              {/* <p className="text-sm text-gray-600">{formData.selectedProduct.description}</p> */}
              <p className="font-bold text-lg">${formData.selectedProduct.price}</p>
            </div>
          )}

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium mb-1">Customer Information</h4>
              <p className="text-sm text-gray-600">
                {formData.customerInfo?.firstName} {formData.customerInfo?.lastName}
              </p>
              <p className="text-sm text-gray-600">{formData.customerInfo?.email}</p>
              <p className="text-sm text-gray-600">{formData.customerInfo?.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium mb-1">Contact Address</h4>
              <p className="text-sm text-gray-600">
                {formData.customerInfo?.address}<br />
                {formData.customerInfo?.city}, {formData.customerInfo?.state} {formData.customerInfo?.zipCode}
              </p>
            </div>
          </div>

          {/* Family Members */}
          {formData.familyMembers && formData.familyMembers.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Family Members
              </h4>
              <div className="space-y-3">
                {formData.familyMembers.map((member, index) => (
                  <div key={member.id || index} className="bg-white rounded-lg p-3 border">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">{member.firstName} {member.lastName}</span>
                        <p className="text-gray-600">Relationship: {member.relationship}</p>
                      </div>
                      <div className="text-gray-600">
                        <p>DOB: {new Date(member.dateOfBirth).toLocaleDateString()}</p>
                        <p>Gender: {member.gender}</p>
                        <p>Height: {member.height}, Weight: {member.weight}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions and Answers */}
          {formData.questionsAnswers && Object.keys(formData.questionsAnswers).length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Your Answers</h4>
              <div className="space-y-2">
                {Object.entries(formData.questionsAnswers).map(([questionId, answer]) => {
                  // Skip family member entries (they're displayed separately above)
                  if (questionId.includes('_family_members')) return null;
                  
                  const question = getQuestionById(questionId, formData.collectionName);
                  if (!question) return null;
                  
                  return (
                    <div key={questionId} className="bg-white rounded-lg p-3 border">
                      <p className="font-medium text-sm mb-1">{question.question}</p>
                      <p className="text-sm text-gray-600">{String(answer)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

           <div className="border-t pt-6">
      <div className="flex items-start gap-3 mb-4">
        <Shield className="h-5 w-5 text-blue-600 mt-1" />
        <div className="w-full">
          <h4 className="font-medium mb-3">Insurance Partner</h4>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              {/* NFC Logo Placeholder */}
              <div className="w-25 h-14   flex items-center justify-center">
               <img alt="NFC logo" className="w-full h-full object-contain" src="/NFC_logo.png" />
              </div>
              
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">NFC Insurance Company</h5>
                <p className="text-blue-700 text-xs">Our Preferred Insurance Partner</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-blue-800">
                <strong>NFC is our preferred insurance partner</strong> to provide comprehensive insurance plans to our customers.With years of trusted service and expertise, NFC will process and issue your insurance plan directly upon checkout completion.
              </p>
              
              
              {/* Website Link */}
              <div className="pt-1">
                <a 
                  href="https://nfcinsurance.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  Visit NFC Insurance Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        </div>

        {error && (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-600 font-medium mb-2">Checkout Error</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button 
              onClick={handleRetry}
              className="w-full"
            >
              Retry Checkout
            </Button>
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={prevStep}
            className="w-1/2 px-[40px] py-7"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit Info
          </Button>
          <Button 
            onClick={handleContinueToCheckout}
            disabled={isLoading}
            className="w-1/2 px-[40px] py-7"
          >
            {formData.checkoutUrl ? 'Continue to Checkout' : 'Proceed to Checkout'} <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state during checkout initialization
  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => setShowConfirmation(true)}
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Checkout</h2>
        <p className="text-gray-600">
          Preparing your secure checkout experience...
        </p>
      </div>

      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-lg">Initializing checkout...</p>
        <p className="text-sm text-gray-600">
          Please wait while we prepare your secure checkout experience
        </p>
      </div>
    </div>
  );
}


// "use client";

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import { useForm } from "@/contexts/FormContext";

// export default function EmbeddedCheckoutStep() {
//   const router = useRouter();
//   const { formData, prevStep, updateFormData, saveProgress } = useForm();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     console.log("EmbeddedCheckout - Form Data:", formData);
//     console.log("EmbeddedCheckout - Cart ID:", formData.cartId);
//     console.log("EmbeddedCheckout - Customer Info:", formData.customerInfo);

//     if (!formData.cartId) {
//       setError('Cart ID is required to initialize checkout');
//       setIsLoading(false);
//       return;
//     }

//     if (!formData.customerInfo) {
//       setError('Customer information is required to initialize checkout');
//       setIsLoading(false);
//       return;
//     }

//     // Keep track of whether component is mounted
//     let isMounted = true;

//     // Initialize the checkout via Next.js API and get the checkout URL
//     async function initializeCheckout() {
//       try {
//         console.log("Initializing checkout via API...");
        
//         // Prepare customer data in the format expected by the API
//         const customerData = {
//           firstName: formData.customerInfo?.firstName,
//           lastName: formData.customerInfo?.lastName,
//           email: formData.customerInfo?.email,
//           phone: formData.customerInfo?.phone,
//           address: formData.customerInfo?.address,
//           city: formData.customerInfo?.city,
//           state: formData.customerInfo?.state,
//           zipCode: formData.customerInfo?.zipCode,
//         };

//         const response = await fetch('/api/bigcommerce/checkout', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             cartId: formData.cartId,
//             customer: customerData
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to initialize checkout');
//         }

//         const data = await response.json();
//         console.log("Checkout initialized via API:", data);

//         if (data.success && data.checkoutUrl) {
//           if (isMounted) {
//             console.log("Checkout URL received:", data.checkoutUrl);
            
//             // Update form data with checkout URL
//             updateFormData({
//               checkoutUrl: data.checkoutUrl
//             });
            
//             // Save progress
//             await saveProgress();
            
//             // Redirect to checkout URL
//             window.location.href = data.checkoutUrl;
//           }
//         } else {
//           throw new Error('Checkout URL not provided by API');
//         }
//       } catch (err: any) {
//         console.error('Error initializing checkout via API:', err);
//         if (isMounted) {
//           setError(err.message || 'Failed to initialize checkout');
//           setIsLoading(false);
//         }
//       }
//     }

//     // If we already have a checkout URL, redirect immediately
//     if (formData.checkoutUrl) {
//       console.log("Checkout URL already exists, redirecting:", formData.checkoutUrl);
//       window.location.href = formData.checkoutUrl;
//       return;
//     }

//     // Otherwise, initialize checkout
//     initializeCheckout();

//     // Cleanup function
//     return () => {
//       isMounted = false;
//     };
//   }, [formData.cartId, formData.customerInfo, formData.checkoutUrl, updateFormData, saveProgress]);

//   const handleRetry = () => {
//     setError(null);
//     setIsLoading(true);
//     // Clear the checkout URL to force re-initialization
//     updateFormData({ checkoutUrl: undefined });
//     // Reload the page to restart the process
//     window.location.reload();
//   };

//   return (
//     <div className="space-y-6">
//       <Button 
//         variant="ghost" 
//         className="mb-4" 
//         onClick={prevStep}
//         disabled={isLoading}
//       >
//         <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customer Info
//       </Button>

//       <div className="text-center">
//         <h2 className="text-2xl font-bold mb-2">Checkout</h2>
//         <p className="text-gray-600">
//           {isLoading ? 'Preparing your checkout...' : 'Complete your purchase'}
//         </p>
//       </div>

//       {error && (
//         <div className="p-6 border border-red-200 rounded-lg bg-red-50">
//           <p className="text-red-600 font-medium mb-2">Checkout Error</p>
//           <p className="text-red-600 text-sm mb-4">{error}</p>
//           <div className="flex gap-2">
//             <Button 
//               onClick={handleRetry}
//               className="flex-1"
//             >
//               Retry Checkout
//             </Button>
//             <Button 
//               variant="outline"
//               onClick={prevStep}
//               className="flex-1"
//             >
//               Back to Customer Info
//             </Button>
//           </div>
//         </div>
//       )}

//       {isLoading && !error && (
//         <div className="flex flex-col items-center justify-center p-12 space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//           <p className="text-lg">Initializing checkout...</p>
//           <p className="text-sm text-gray-600">
//             Please wait while we prepare your secure checkout experience
//           </p>
//         </div>
//       )}

//       {/* Debug information (remove in production) */}
//       {/* {process.env.NODE_ENV === 'development' && (
//         <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
//           <p><strong>Debug Info:</strong></p>
//           <p>Cart ID: {formData.cartId || 'Not set'}</p>
//           <p>Checkout URL: {formData.checkoutUrl || 'Not set'}</p>
//           <p>Customer Email: {formData.customerInfo?.email || 'Not set'}</p>
//           <p>Error: {error || 'None'}</p>
//           <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
//         </div>
//       )} */}
//     </div>
//   );
// }