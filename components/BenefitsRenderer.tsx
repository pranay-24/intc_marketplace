import React from 'react';
import { Check } from 'lucide-react';
import { InsuranceBenefits, AccidentBenefits, CancerBenefits } from '@/lib/calculateBenefits'; // Adjust import path as needed

interface BenefitsRendererProps {
  collectionName: string;
  benefits: InsuranceBenefits;
}


// Type guard functions
function isAccidentBenefits(benefits: InsuranceBenefits): benefits is AccidentBenefits[keyof AccidentBenefits] {
  return typeof benefits === 'object' && benefits !== null && 
    'hospitalAdmission' in benefits && 'hospitalConfinement' in benefits;
}

function isCancerBenefits(benefits: InsuranceBenefits): benefits is CancerBenefits {
  return typeof benefits === 'object' && benefits !== null && 
    'type' in benefits && (benefits as any).type === 'cancer';
}


// Main Benefits Renderer Component
export function BenefitsRenderer({ collectionName, benefits }: BenefitsRendererProps) {
  switch (collectionName) {
    case 'Accident Insurance':
      return <AccidentBenefitsComponent benefits={benefits as AccidentBenefits[keyof AccidentBenefits]} />;
    case 'Cancer Insurance':
      return <CancerBenefitsComponent benefits={benefits as CancerBenefits} />;
    // Add more cases for other insurance types
    default:
      return <DefaultBenefitsComponent benefits={benefits} />;
  }
}

// Accident Insurance Benefits Component
function AccidentBenefitsComponent({ benefits }: { benefits: AccidentBenefits[keyof AccidentBenefits] }) {
  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-700 mb-3">Accident Insurance Benefits:</h4>
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

// Cancer Insurance Benefits Component
function CancerBenefitsComponent({ benefits }: { benefits: CancerBenefits }) {
  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-700 mb-3">Cancer Insurance Benefits:</h4>
      <div className="space-y-4">
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">One-Time Benefits - Invasive Cancer:</h5>
          <div className="ml-4 space-y-1">
            <BenefitItem label="Insured:" value={benefits.oneTimeBenefits.invasiveCancer.insured} />
            <BenefitItem label="Spouse:" value={benefits.oneTimeBenefits.invasiveCancer.spouse} />
            <BenefitItem label="Children:" value={benefits.oneTimeBenefits.invasiveCancer.children} />
          </div>
        </div>
        
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">One-Time Benefits - Skin Cancer:</h5>
          <div className="ml-4 space-y-1">
            <BenefitItem label="Insured:" value={benefits.oneTimeBenefits.skinCancer.insured} />
            <BenefitItem label="Spouse:" value={benefits.oneTimeBenefits.skinCancer.spouse} />
            <BenefitItem label="Children:" value={benefits.oneTimeBenefits.skinCancer.children} />
          </div>
        </div>
        
        <div>
          <h5 className="text-sm font-medium text-gray-700 mb-2">Additional Occurrence Benefits:</h5>
          <div className="ml-4 space-y-1">
            <BenefitItem 
              label="Less than 2 years without treatment:" 
              value={benefits.additionalOccurrence.timeWithoutTreatment.lessThan2Years} 
            />
            <BenefitItem 
              label="2-4 years without treatment:" 
              value={benefits.additionalOccurrence.timeWithoutTreatment.from2To4Years} 
            />
            <BenefitItem 
              label="More than 5 years without treatment:" 
              value={benefits.additionalOccurrence.timeWithoutTreatment.moreThan5Years} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Default Benefits Component (fallback)
function DefaultBenefitsComponent({ benefits }: { benefits: InsuranceBenefits }) {
  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-700 mb-3">Insurance Benefits:</h4>
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Benefits information available after product selection.
        </p>
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