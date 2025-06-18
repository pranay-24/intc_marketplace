import React from 'react';
import { Check } from 'lucide-react';

// Define the specific type for cancer benefits
export interface ShortTermPlanBenefits {
  dailyBenefit: string;
  

}

interface ShortTermBenefitsRendererProps {
  benefits: ShortTermPlanBenefits;
}

export function ShortTermBenefitsRenderer({ benefits }: ShortTermBenefitsRendererProps) {
  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-700 mb-3">Your Benefits:</h4>
      <div className="space-y-3">
        <BenefitItem 
          label="Daily Benefit:" 
          value={benefits.dailyBenefit} 
        />
       
       
        
        {/* <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Additional Occurrence Coverage:</p>
          <div className="ml-4">
            <div className="flex items-start mb-2">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600">{benefits.additionalOccurrence.description}</span>
            </div>
            
            <div className="ml-6 space-y-1">
              <p className="text-xs font-medium text-gray-700 mb-1">Time without treatment:</p>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Less than 2 years:</span>
                  <span className="text-xs font-medium text-gray-700">{benefits.additionalOccurrence.timeWithoutTreatment.lessThan2Years}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">2-4 years:</span>
                  <span className="text-xs font-medium text-gray-700">{benefits.additionalOccurrence.timeWithoutTreatment.twoToFourYears}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">5+ years:</span>
                  <span className="text-xs font-medium text-gray-700">{benefits.additionalOccurrence.timeWithoutTreatment.fivePlusYears}</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

// Helper component for individual benefit items
function BenefitItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start">
      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600 ml-1">{value}</span>
      </div>
    </div>
  );
}