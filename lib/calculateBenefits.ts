import { FormResponse } from '@/lib/types';
import collectionsData from '@/data/collections.json';
import questionCollectionsData from '@/data/questions.json';

import {Product, UserAnswers,QuestionCollection, Question ,InsuranceFormData, findQuestionIdByName,findAllQuestionIdsByName,getAnswerFromIds, getNumericAnswer, extractUserAnswers} from '@/lib/pricing'


// Benefit display interfaces
export interface AccidentBenefits {
  planA: {
    hospitalAdmission: string;
    hospitalConfinement: string;
    emergencyRoom: string;
    outpatientSurgery: string[];
    fractures: string[];
    doctorVisits: string;
    wellnessBenefit: string;
  };
  planB: {
    hospitalAdmission: string;
    hospitalConfinement: string;
    emergencyRoom: string;
    outpatientSurgery: string[];
    fractures: string[];
    doctorVisits: string;
    wellnessBenefit: string;
  };
}

export interface CancerBenefits {
  type: 'cancer';
  oneTimeBenefits: {
    invasiveCancer: {
      insured: string;
      spouse: string;
      children: string;
    };
    skinCancer: {
      insured: string;
      spouse: string;
      children: string;
    };
  };
  additionalOccurrence: {
    timeWithoutTreatment: {
      lessThan2Years: string;
      from2To4Years: string;
      moreThan5Years: string;
    };
  };
}

export interface HospitalIndemnityBenefits {
  type: 'hospital_indemnity';
  // Will be defined based on actual hospital indemnity structure
  [key: string]: any;
}

export interface CriticalIllnessBenefits {
  type: 'critical_illness';
  // Will be defined based on actual critical illness structure
  [key: string]: any;
}

export interface ShortTermBenefits {
  type: 'short_term';
  // Will be defined based on actual short term structure
  [key: string]: any;
}

// Union type for all possible benefit structures
export type InsuranceBenefits = 
  | AccidentBenefits 
  | CancerBenefits 
  | HospitalIndemnityBenefits 
  | CriticalIllnessBenefits 
  | ShortTermBenefits;
  

  // Generic function to get benefits for any insurance type
// export function getInsuranceBenefits(
//   formData: Partial<FormResponse>,
//   collectionName: string
// ): InsuranceBenefits | null {
//   switch (collectionName) {
//     case 'Accident Insurance':
//       return getAccidentInsuranceBenefits(formData);
//     case 'Cancer Insurance':
//       return getCancerInsuranceBenefits(formData);
//     case 'Hospital Indemnity Insurance':
//       // TODO: Implement when you provide the benefit structure
//       return null;
//     case 'Critical Illness Insurance':
//       // TODO: Implement when you provide the benefit structure
//       return null;
//     case 'Short Term Accident/Sickness Pay':
//       // TODO: Implement when you provide the benefit structure
//       return null;
//     default:
//       return null;
//   }
// }


// Main function to get accident insurance benefit table

export function getAccidentInsuranceBenefits(
  selectedPlan: string,
 
): AccidentBenefits[keyof AccidentBenefits] {
  // Define all benefits data
  const allBenefits: AccidentBenefits = {
    planA: {
      hospitalAdmission: "$500/Accident",
      hospitalConfinement: "$200/Day (30 Days/Accident)",
      emergencyRoom: "$150/visit (Max 2/year)",
      outpatientSurgery: [
        "$500 for Minor Surgery",
        "$1,000 for Major Surgery"
      ],
      fractures: [
        "$500 for Minor Fracture",
        "$1,000 for Major Fracture"
      ],
      doctorVisits: "$75/Visit (Max 2/year)",
      wellnessBenefit: "$50/year"
    },
    planB: {
      hospitalAdmission: "$1,000/Accident",
      hospitalConfinement: "$400/Day (30 Days/Accident)",
      emergencyRoom: "$200/visit (Max 2/year)",
      outpatientSurgery: [
        "$750 for Minor Surgery",
        "$1,500 for Major Surgery"
      ],
      fractures: [
        "$500 for Minor Fracture",
        "$1,000 for Major Fracture"
      ],
      doctorVisits: "$100/Visit (Max 2/year)",
      wellnessBenefit: "$50/year"
    }
  };

  // Return benefits for the selected plan
  const planKey = selectedPlan.toLowerCase().replace(' ', '') as keyof AccidentBenefits;
  
  if (planKey in allBenefits) {
    return allBenefits[planKey];
  }
  
  // Default fallback to Plan A if selectedPlan doesn't match
  console.warn(`Selected plan "${selectedPlan}" not found, defaulting to Plan A`);
  return allBenefits.planA;
}

// Utility function to format benefits for display (returns array of strings for easy rendering)
// export function formatAccidentBenefitsForDisplay(benefits: AccidentBenefits) {
//   return {
//     planA: [
//       `Hospital Admission: ${benefits.planA.hospitalAdmission}`,
//       `Hospital Confinement: ${benefits.planA.hospitalConfinement}`,
//       `Emergency Room: ${benefits.planA.emergencyRoom}`,
//       `Outpatient Surgery:`,
//       ...benefits.planA.outpatientSurgery.map(benefit => `  - ${benefit}`),
//       `Fractures:`,
//       ...benefits.planA.fractures.map(benefit => `  - ${benefit}`),
//       `Doctor Visits: ${benefits.planA.doctorVisits}`,
//       `Wellness Benefit: ${benefits.planA.wellnessBenefit}`
//     ],
//     planB: [
//       `Hospital Admission: ${benefits.planB.hospitalAdmission}`,
//       `Hospital Confinement: ${benefits.planB.hospitalConfinement}`,
//       `Emergency Room: ${benefits.planB.emergencyRoom}`,
//       `Outpatient Surgery:`,
//       ...benefits.planB.outpatientSurgery.map(benefit => `  - ${benefit}`),
//       `Fractures:`,
//       ...benefits.planB.fractures.map(benefit => `  - ${benefit}`),
//       `Doctor Visits: ${benefits.planB.doctorVisits}`,
//       `Wellness Benefit: ${benefits.planB.wellnessBenefit}`
//     ]
//   };
// }


// Cancer insurance benefits function
export function getCancerInsuranceBenefits(
  formData: Partial<FormResponse>
): CancerBenefits {
  const questionData = questionCollectionsData as InsuranceFormData;
  const userAnswers = extractUserAnswers(formData, questionData.collections);

  return {
    type: 'cancer',
    oneTimeBenefits: {
      invasiveCancer: {
        insured: "$5,000",
        spouse: "$5,000", 
        children: "$5,000"
      },
      skinCancer: {
        insured: "$500",
        spouse: "$500",
        children: "$500"
      }
    },
    additionalOccurrence: {
      timeWithoutTreatment: {
        lessThan2Years: "0%",
        from2To4Years: "50%",
        moreThan5Years: "100%"
      }
    }
  };
}
