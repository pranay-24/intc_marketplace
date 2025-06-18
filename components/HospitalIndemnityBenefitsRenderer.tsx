import React from 'react';
import { Check } from 'lucide-react';

// Define the specific type for hospital indemnity benefits
export interface HospitalIndemnityPlanBenefits {
  hospitalAdmission: string;
  hospitalPerDay: {
    amount: string;
    maxDays: string;
  };
  emergencyRoom: {
    amount: string;
    maxVisits: string;
  };
  outpatientSurgery: {
    minor: string;
    major: string;
  };
}

interface HospitalIndemnityBenefitsRendererProps {
  benefits: HospitalIndemnityPlanBenefits;
}

export function HospitalIndemnityBenefitsRenderer({ benefits }: HospitalIndemnityBenefitsRendererProps) {
  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-700 mb-3">Your Plan Benefits:</h4>
      <div className="space-y-3">
        <BenefitItem 
          label="Hospital Admission:" 
          value={benefits.hospitalAdmission} 
        />
        
        <BenefitItem 
          label="Hospital Per Day:" 
          value={`${benefits.hospitalPerDay.amount} (${benefits.hospitalPerDay.maxDays})`} 
        />
        
        <BenefitItem 
          label="Emergency Room:" 
          value={`${benefits.emergencyRoom.amount} (${benefits.emergencyRoom.maxVisits})`} 
        />
        
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">Outpatient Surgery:</p>
          <ul className="space-y-1 ml-4">
            <li className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600">Minor Surgery: {benefits.outpatientSurgery.minor}</span>
            </li>
            <li className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600">Major Surgery: {benefits.outpatientSurgery.major}</span>
            </li>
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