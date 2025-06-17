"use client";  
import React from 'react';
import { useForm } from '@/contexts/FormContext';
import { Check } from 'lucide-react';

export default function ProgressBar() {
  const { currentStep, allSteps } = useForm();

  return (
    <div className="w-full mt-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        {allSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="relative">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                  ${
                    index < currentStep
                      ? 'bg-primary border-primary text-primary-foreground'
                      : index === currentStep
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-gray-300 text-gray-400 bg-white'
                  }
                `}
              >
                <span className="text-sm font-semibold">{index + 1}</span>
              </div>
              
              {/* Checkmark overlay for completed steps */}
              {index < currentStep && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            {index < allSteps.length - 1 && (
              <div
                className={`
                  h-1 w-16 mx-2 transition-all duration-200
                  ${
                    index < currentStep
                      ? 'bg-primary'
                      : 'bg-gray-200'
                  }
                `}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between text-sm">
        {allSteps.map((step, index) => (
          <div
            key={step.id}
            className={`
              text-center transition-all duration-200
              ${
                index <= currentStep
                  ? 'text-primary font-medium'
                  : 'text-gray-400'
              }
            `}
            style={{ width: '120px' }}
          >
            {step.title}
          </div>
        ))}
      </div>
    </div>
  );
}