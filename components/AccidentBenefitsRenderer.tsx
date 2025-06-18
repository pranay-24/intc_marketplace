import React from 'react';
import { Check } from 'lucide-react';

// Define the specific type for accident benefits (individual plan)
export interface AccidentPlanBenefits {
  hospitalAdmission: string;
  hospitalConfinement: string;
  emergencyRoom: string;
  outpatientSurgery: string[];
  fractures: string[];
  doctorVisits: string;
  wellnessBenefit: string;
}

interface AccidentBenefitsRendererProps {
  benefits: AccidentPlanBenefits;
}

export function AccidentBenefitsRenderer({ benefits }: AccidentBenefitsRendererProps) {
  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-700 mb-3">Your Plan Benefits:</h4>
      <div className="space-y-3">
        <BenefitItem 
          label="Hospital Admission:" 
          value={benefits.hospitalAdmission} 
        />
        <BenefitItem 
          label="Hospital Confinement:" 
          value={benefits.hospitalConfinement} 
        />
        <BenefitItem 
          label="Emergency Room:" 
          value={benefits.emergencyRoom} 
        />
        <BenefitItem 
          label="Doctor Visits:" 
          value={benefits.doctorVisits} 
        />
        <BenefitItem 
          label="Wellness Benefit:" 
          value={benefits.wellnessBenefit} 
        />
        
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Outpatient Surgery:</p>
          <ul className="space-y-1 ml-4">
            {benefits.outpatientSurgery.map((surgery, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{surgery}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Fracture Coverage:</p>
          <ul className="space-y-1 ml-4">
            {benefits.fractures.map((fracture, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{fracture}</span>
              </li>
            ))}
          </ul>
        </div>
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