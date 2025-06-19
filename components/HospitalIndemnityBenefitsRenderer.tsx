import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { getMembers } from '@/lib/pricing';
import { useForm } from '@/contexts/FormContext';

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

// Constants for benefit amounts based on member type
const BENEFIT_AMOUNTS = {
  hospitalAdmission: {
    insured: '$500',
    spouse: '$500',
    child: '$500',
    maxPeriod: '2 admissions'
  },
  hospitalConfinement: {
    perDay: '$300',
    maxDays: '30 days'
  },
  emergencyRoom: {
    amount: '$100',
    maxVisits: '2 visits'
  },
  outpatientSurgery: {
    major: {
      amount: '$750',
      maxPeriod: '1 Surgery'
    },
    minor: {
      amount: '$250',
      maxPeriod: '1 Surgery'
    }
  }
};

type MemberType = 'Just me' | 'Me + 1' | 'My family';

export function HospitalIndemnityBenefitsRenderer({ benefits }: HospitalIndemnityBenefitsRendererProps) {
  const { formData } = useForm();
  const memberType  = getMembers(formData);
  const [selectedMemberType, setSelectedMemberType] = useState<MemberType>('Just me');
  const [showDropdown, setShowDropdown] = useState(false);

  const memberOptions: MemberType[] = ['Just me', 'Me + 1', 'My family'];
  const [showBenefitDetails, setShowBenefitDetails] = useState(false);



  // Determine which columns to show based on member type
  const getVisibleColumns = () => {

   
    switch (memberType as string) {
      case 'Just me':
        return ['insured'];
      case 'Me + 1':
        return ['insured', 'spouse'];
      case 'My Family':
        return ['insured', 'spouse', 'child'];
      default:
        return ['insured'];
    }
  };

  const getColumnHeader = (column: string) => {
    switch (column) {
      case 'insured':
        return 'Insured Person';
      case 'spouse':
        return 'Spouse';
      case 'child':
        return 'Child(ren)';
      default:
        return '';
    }
  };

  const visibleColumns = getVisibleColumns();

  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-700 mb-3">Your Plan Benefits:{memberType}</h4>
      
      {/* Original benefits display */}
      <div className="space-y-3 mb-6">
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

      {/* Details of Benefit Amount Accordion */}
      <div className="mb-6">
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setShowBenefitDetails(!showBenefitDetails)}
            className="w-full bg-white px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Details of Benefit Amount</span>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${showBenefitDetails ? 'rotate-180' : ''}`} />
            </div>
          </button>
          
          {showBenefitDetails && (
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              <h5 className="font-medium text-gray-800 mb-4">Benefit Amount per Covered Person</h5>
              
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Benefit Type</th>
                        {visibleColumns.map((column) => (
                          <th key={column} className="text-center py-3 px-4 font-medium text-gray-700">
                            {getColumnHeader(column)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="bg-blue-50">
                        <td className="py-3 px-4 font-medium text-gray-800">Hospital Admission Benefit</td>
                        {visibleColumns.map((column) => (
                          <td key={column} className="text-center py-3 px-4 text-gray-700">
                            {BENEFIT_AMOUNTS.hospitalAdmission.insured}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="py-2 px-4 pl-8 text-sm text-gray-600">
                          Maximum Benefit Period per Calendar Year
                        </td>
                        {visibleColumns.map((column) => (
                          <td key={column} className="text-center py-2 px-4 text-sm text-gray-600">
                            {BENEFIT_AMOUNTS.hospitalAdmission.maxPeriod}
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="bg-purple-50">
                        <td className="py-3 px-4 font-medium text-gray-800">Hospital Confinement Benefit</td>
                        <td className="py-3 px-4"></td>
                        {visibleColumns.length > 1 && <td className="py-3 px-4"></td>}
                        {visibleColumns.length > 2 && <td className="py-3 px-4"></td>}
                      </tr>
                      <tr className="bg-purple-50">
                        <td className="py-2 px-4 pl-8 text-sm text-gray-600">Per Day</td>
                        {visibleColumns.map((column) => (
                          <td key={column} className="text-center py-2 px-4 text-gray-700">
                            {BENEFIT_AMOUNTS.hospitalConfinement.perDay}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-purple-50">
                        <td className="py-2 px-4 pl-8 text-sm text-gray-600">
                          Maximum Benefit Period per Calendar Year
                        </td>
                        {visibleColumns.map((column) => (
                          <td key={column} className="text-center py-2 px-4 text-sm text-gray-600">
                            {BENEFIT_AMOUNTS.hospitalConfinement.maxDays}
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="bg-blue-50">
                        <td className="py-3 px-4 font-medium text-gray-800">Emergency Room Benefit</td>
                        {visibleColumns.map((column) => (
                          <td key={column} className="text-center py-3 px-4 text-gray-700">
                            {BENEFIT_AMOUNTS.emergencyRoom.amount}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="py-2 px-4 pl-8 text-sm text-gray-600">
                          Maximum Benefit Period per Calendar Year
                        </td>
                        {visibleColumns.map((column) => (
                          <td key={column} className="text-center py-2 px-4 text-sm text-gray-600">
                            {BENEFIT_AMOUNTS.emergencyRoom.maxVisits}
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">Outpatient Major Surgery Benefit</td>
                        <td className="py-3 px-4"></td>
                        {visibleColumns.length > 1 && <td className="py-3 px-4"></td>}
                        {visibleColumns.length > 2 && <td className="py-3 px-4"></td>}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-2 px-4 pl-8 text-sm text-gray-600">Per Surgery</td>
                        {visibleColumns.map((column) => (
                          <td key={column} className="text-center py-2 px-4 text-gray-700">
                            {BENEFIT_AMOUNTS.outpatientSurgery.major.amount}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="py-2 px-4 pl-8 text-sm text-gray-600">
                          Maximum Benefit Period per Calendar Year
                        </td>
                        {visibleColumns.map((column) => (
                          <td key={column} className="text-center py-2 px-4 text-sm text-gray-600">
                            {BENEFIT_AMOUNTS.outpatientSurgery.major.maxPeriod}
                          </td>
                        ))}
                      </tr>
                      
                      <tr className="bg-blue-50">
                        <td className="py-3 px-4 font-medium text-gray-800">Outpatient Minor Surgery Benefit</td>
                        {visibleColumns.map((column) => (
                          <td key={column} className="text-center py-3 px-4 text-gray-700">
                            {BENEFIT_AMOUNTS.outpatientSurgery.minor.amount}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="py-2 px-4 pl-8 text-sm text-gray-600">
                          Maximum Benefit Period per Calendar Year
                        </td>
                        {visibleColumns.map((column) => (
                          <td key={column} className="text-center py-2 px-4 text-sm text-gray-600">
                            {BENEFIT_AMOUNTS.outpatientSurgery.minor.maxPeriod}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {visibleColumns.map((column) => (
                  <div key={column} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <h6 className="font-medium text-gray-800 mb-3 text-center">
                      {getColumnHeader(column)}
                    </h6>
                    
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="font-medium text-gray-800">Hospital Admission Benefit</div>
                        <div className="text-gray-700">{BENEFIT_AMOUNTS.hospitalAdmission.insured}</div>
                        <div className="text-sm text-gray-600">Max: {BENEFIT_AMOUNTS.hospitalAdmission.maxPeriod}</div>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded">
                        <div className="font-medium text-gray-800">Hospital Confinement Benefit</div>
                        <div className="text-gray-700">{BENEFIT_AMOUNTS.hospitalConfinement.perDay}</div>
                        <div className="text-sm text-gray-600">Max: {BENEFIT_AMOUNTS.hospitalConfinement.maxDays}</div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="font-medium text-gray-800">Emergency Room Benefit</div>
                        <div className="text-gray-700">{BENEFIT_AMOUNTS.emergencyRoom.amount}</div>
                        <div className="text-sm text-gray-600">Max: {BENEFIT_AMOUNTS.emergencyRoom.maxVisits}</div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="font-medium text-gray-800">Outpatient Major Surgery</div>
                        <div className="text-gray-700">{BENEFIT_AMOUNTS.outpatientSurgery.major.amount}</div>
                        <div className="text-sm text-gray-600">Max: {BENEFIT_AMOUNTS.outpatientSurgery.major.maxPeriod}</div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="font-medium text-gray-800">Outpatient Minor Surgery</div>
                        <div className="text-gray-700">{BENEFIT_AMOUNTS.outpatientSurgery.minor.amount}</div>
                        <div className="text-sm text-gray-600">Max: {BENEFIT_AMOUNTS.outpatientSurgery.minor.maxPeriod}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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