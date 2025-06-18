import React from 'react';
import { Check, User, Users, Heart } from 'lucide-react';

// Define the coverage types
export type CoverageType = 'me' | 'me+1' | 'family';

// Define the coverage details for each person type
export interface CoverageDetail {
  
  faceAmount: number;
  faceAmountRange: string;
  maxBenefit: number;
 
}

// Define the critical illness benefits structure
export interface CriticalIllnessPlanBenefits {
  
  insuredPerson: CoverageDetail;
  spouse?: CoverageDetail;
  children?: CoverageDetail;
}

interface CriticalIllnessBenefitsRendererProps {
  benefits: CriticalIllnessPlanBenefits;
}

export function CriticalIllnessBenefitsRenderer({ benefits }: CriticalIllnessBenefitsRendererProps) {
  const getCoverageIcon = (type: CoverageType) => {
    switch (type) {
      case 'me':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'me+1':
        return <Users className="h-5 w-5 text-green-500" />;
      case 'family':
        return <Heart className="h-5 w-5 text-red-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCoverageTitle = (type: CoverageType) => {
    switch (type) {
      case 'me':
        return 'Individual Coverage';
      case 'me+1':
        return 'Me + Spouse Coverage';
      case 'family':
        return 'Family Coverage';
      default:
        return 'Coverage';
    }
  };

  return (
    <div className="mt-4">
     
      <div className="space-y-4">
        {/* Insured Person */}
        <CoveragePersonCard 
          title="Insured Person"
          person={benefits.insuredPerson}
          isPrimary={true}
        />
        
        {/* Spouse (if applicable) */}
        {benefits.spouse && (
          <CoveragePersonCard 
            title="Spouse"
            person={benefits.spouse}
            isPrimary={false}
          />
        )}
        
        {/* Children (if applicable) */}
        {benefits.children && (
          <CoveragePersonCard 
            title="Children"
            person={benefits.children}
            isPrimary={false}
          />
        )}
      </div>
    </div>
  );
}

// Helper component for individual coverage person
function CoveragePersonCard({ title, person, isPrimary }: { 
  title: string; 
  person: CoverageDetail; 
  isPrimary: boolean; 
}) {
  return (
    <div className={`p-4 `}>
      <h5 className={`font-medium mb-3 text-gray-700`}>
        {title}
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <BenefitDetail 
          label="Face Amount" 
          value={person.faceAmount}
          subtext={person.faceAmountRange}
        />
        <BenefitDetail 
          label="Maximum Benefit" 
          value={person.maxBenefit}
        />
       
      </div>
    </div>
  );
}

// Helper component for benefit details
function BenefitDetail({ label, value, subtext }: { 
  label: string; 
  value: number; 
  subtext?: string; 
}) {
  return (
    <div className="flex items-start">
      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">{label}:</p>
        <p className="text-sm text-gray-900 font-semibold">{value}</p>
        {subtext && (
          <p className="text-xs text-gray-500">{subtext}</p>
        )}
      </div>
    </div>
  );
}



