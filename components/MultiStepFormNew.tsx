"use client";  
import React from 'react';
import { FormProvider, useForm } from '@/contexts/FormContext';
import { AuthComponent } from '@/components/AuthComponent';
import ProgressBar from '@/components/ProgressBar';
import CollectionSelectionStep from '@/components/CollectionSelectionStep';
import QuestionsStep from '@/components/QuestionsStep';
import ProductSelectionStep from '@/components/ProductSelectionStep';
import CustomerInfoStep from '@/components/CustomerInfoStep';
import CheckoutStep from '@/components/CheckoutStep';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const steps = [
  {
    id: 'collection',
    title: 'Choose Collection',
    component: CollectionSelectionStep,
    isRequired: true,
    isVisible: () => true,
  },
  {
    id: 'questions',
    title: 'Answer Questions',
    component: QuestionsStep,
    isRequired: true,
    isVisible: (formData: any) => !!formData.collectionName,
  },
  {
    id: 'products',
    title: 'Select Product',
    component: ProductSelectionStep,
    isRequired: true,
    isVisible: (formData: any) => !!formData.questionsAnswers,
  },
  {
    id: 'customer',
    title: 'Your Information',
    component: CustomerInfoStep,
    isRequired: true,
    isVisible: (formData: any) => !!formData.selectedProduct,
  },
  {
    id: 'checkout',
    title: 'Checkout',
    component: CheckoutStep,
    isRequired: true,
    isVisible: (formData: any) => !!formData.customerInfo,
  },
];

function MultiStepFormContent() {
  const { user, isLoading, currentStep, steps: visibleSteps } = useForm();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthComponent onAuthSuccess={() => {}} />;
  }

  const CurrentStepComponent = visibleSteps[currentStep]?.component;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* User info and sign out */}
      {/* <h1>Hi User</h1> */}
      {/* <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Welcome, {user.email}
          {!user.emailVerified && (
            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
              Email not verified
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div> */}

      <ProgressBar />
      
      {CurrentStepComponent && <CurrentStepComponent />}
    </div>
  );
}

export default function MultiStepFormNew() {
  return (
    <FormProvider steps={steps}>
      <MultiStepFormContent />
    </FormProvider>
  );
}