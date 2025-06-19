import React, { useState } from 'react';
import { Check, User, Users, Heart , ChevronDown} from 'lucide-react';

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
    const [showBenefitDetails, setShowBenefitDetails] = useState(false);

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

         <div className="mb-6">
  <div className="border border-gray-300 rounded-md overflow-hidden">
    <button
      type="button"
      onClick={() => setShowBenefitDetails(!showBenefitDetails)}
      className="w-full bg-white px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-700">More info on covered diseases</span>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showBenefitDetails ? 'rotate-180' : ''}`} />
      </div>
    </button>
    
    {showBenefitDetails && (
      <div className="border-t border-gray-200 bg-gray-50 p-4">
        <h5 className="font-medium text-gray-800 mb-4">Coverage Details</h5>
        
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Covered Diseases</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700">Amount Covered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 text-gray-800">Heart Attack (Myocardial Infarction)</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-gray-800">Coronary Artery Bypass Graft Surgery</td>
                  <td className="text-center py-3 px-4 text-gray-700">25%</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 text-gray-800">Angioplasty</td>
                  <td className="text-center py-3 px-4 text-gray-700">25%</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-gray-800">Heart Valve Transcatheter</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 text-gray-800">Implantable Cardioverter</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-gray-800">Heart Valve Open Heart Surgery</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 text-gray-800">Pacemaker Placement</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-gray-800">Benign Brain Tumor</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 text-gray-800">Stroke</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-gray-800">ESRD (End Stage Renal Disease)</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 text-gray-800">Heart Transplant</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-gray-800">Kidney Transplant</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 text-gray-800">Liver Transplant</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-gray-800">Lung Transplant</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 text-gray-800">Pancreas Transplant</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-gray-800">Multiple Sclerosis</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 text-gray-800">Permanent Paralysis</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-gray-800">Dismemberment of 2 or More Limbs</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 px-4 text-gray-800">Severe Burns</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 text-gray-800">Loss of Sight in Both Eyes</td>
                  <td className="text-center py-3 px-4 text-gray-700">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="divide-y divide-gray-200">
              <div className="p-3 bg-blue-50 flex justify-between items-center">
                <span className="font-medium text-gray-800">Heart Attack (Myocardial Infarction)</span>
                <span className="text-gray-700 font-medium">100%</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-gray-800">Coronary Artery Bypass Graft Surgery</span>
                <span className="text-gray-700">25%</span>
              </div>
              <div className="p-3 bg-blue-50 flex justify-between items-center">
                <span className="text-gray-800">Angioplasty</span>
                <span className="text-gray-700">25%</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-gray-800">Heart Valve Transcatheter</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 bg-blue-50 flex justify-between items-center">
                <span className="text-gray-800">Implantable Cardioverter</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-gray-800">Heart Valve Open Heart Surgery</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 bg-blue-50 flex justify-between items-center">
                <span className="text-gray-800">Pacemaker Placement</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-gray-800">Benign Brain Tumor</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 bg-blue-50 flex justify-between items-center">
                <span className="text-gray-800">Stroke</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-gray-800">ESRD (End Stage Renal Disease)</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 bg-blue-50 flex justify-between items-center">
                <span className="text-gray-800">Heart Transplant</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-gray-800">Kidney Transplant</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 bg-blue-50 flex justify-between items-center">
                <span className="text-gray-800">Liver Transplant</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-gray-800">Lung Transplant</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 bg-blue-50 flex justify-between items-center">
                <span className="text-gray-800">Pancreas Transplant</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-gray-800">Multiple Sclerosis</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 bg-blue-50 flex justify-between items-center">
                <span className="text-gray-800">Permanent Paralysis</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-gray-800">Dismemberment of 2 or More Limbs</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 bg-blue-50 flex justify-between items-center">
                <span className="text-gray-800">Severe Burns</span>
                <span className="text-gray-700">100%</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-gray-800">Loss of Sight in Both Eyes</span>
                <span className="text-gray-700">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
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
        <p className="text-sm text-gray-900 font-semibold">${value}</p>
        {subtext && (
          <p className="text-xs text-gray-500">{subtext}</p>
        )}
      </div>
    </div>
  );
}



