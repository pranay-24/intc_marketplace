import { FormResponse } from '@/lib/types';
import collectionsData from '@/data/collections.json';
import questionCollectionsData from '@/data/questions.json';

import {Product, UserAnswers,QuestionCollection, Question ,InsuranceFormData, findQuestionIdByName,findAllQuestionIdsByName,getAnswerFromIds, getNumericAnswer, extractUserAnswers} from '@/lib/pricing'
import {AccidentPlanBenefits} from '@/components/AccidentBenefitsRenderer'
import {CancerPlanBenefits} from '@/components/CancerBenefitsRenderer'

import {HospitalIndemnityPlanBenefits} from '@/components/HospitalIndemnityBenefitsRenderer'

import {CoverageDetail, CriticalIllnessPlanBenefits} from '@/components/CriticalIllnessBenefitsRenderer'

import{ShortTermPlanBenefits} from '@/components/ShortTermBenefitsRenderer' 
// Benefit display interfaces
// interface AccidentPlanBenefits {
//   hospitalAdmission: string;
//   hospitalConfinement: string;
//   emergencyRoom: string;
//   outpatientSurgery: string[];
//   fractures: string[];
//   doctorVisits: string;
//   wellnessBenefit: string;
// }

// export interface CancerBenefits {
//   type: 'cancer';
//   oneTimeBenefits: {
//     invasiveCancer: {
//       insured: string;
//       spouse: string;
//       children: string;
//     };
//     skinCancer: {
//       insured: string;
//       spouse: string;
//       children: string;
//     };
//   };
//   additionalOccurrence: {
//     timeWithoutTreatment: {
//       lessThan2Years: string;
//       from2To4Years: string;
//       moreThan5Years: string;
//     };
//   };
// }





// Union type for all possible benefit structures
export type InsuranceBenefits = 
  | AccidentPlanBenefits 
  | CancerPlanBenefits 
   | HospitalIndemnityPlanBenefits 
   | CriticalIllnessPlanBenefits 

  

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

// Main function to get accident insurance benefit table
export function getAccidentInsuranceBenefits(
  selectedPlan: string
): AccidentPlanBenefits {
  // Define all benefits data with proper typing
  const allBenefits: Record<string, AccidentPlanBenefits> = {
    plana: {
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
    planb: {
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
  const planKey = selectedPlan.toLowerCase().replace(/\s+/g, '');
  
  if (planKey in allBenefits) {
    return allBenefits[planKey];
  }
  
  // Default fallback to Plan A if selectedPlan doesn't match
  //console.warn(`Selected plan "${selectedPlan}" not found, defaulting to Plan A`);
  return allBenefits.plana;
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
  coverageAmount: string | undefined,
  coverageType:string | undefined
): CancerPlanBenefits {
  const questionData = questionCollectionsData as InsuranceFormData;
  //const userAnswers = extractUserAnswers(formData, questionData.collections);

  // Get one-time benefit from coverage amount
  const oneTimeBenefit = coverageAmount || '$5,000';
 let skinCancerBenefit = "$500";
  // Determine invasive cancer benefit display based on coverage type
  let invasiveCancerBenefit = '$5,000';
  if (coverageType) {
    switch (coverageType) {
      case 'Just me':
        invasiveCancerBenefit = '$5,000 (Individual)';
        skinCancerBenefit = '$500 (Individual)'
        break;
      case 'Me + 1':
        invasiveCancerBenefit = '$5,000 (Individual, Spouse)';
        skinCancerBenefit ='$500 (Individual, Spouse)'
        break;
      case 'My Family':
        invasiveCancerBenefit = '$5,000 (Individual, Spouse, Children)';
        skinCancerBenefit ='$500 (Individual, Spouse, Children)'
        break;
      default:
        invasiveCancerBenefit = '$5,000 (Individual)';
    }
  }

  
  return {
    oneTimeBenefit,
    invasiveCancerBenefit,
    skinCancerBenefit, // This could be configurable if needed
    additionalOccurrence: {
      description: 'Coverage for additional occurrence( another type of cancer )',
      timeWithoutTreatment: {
        lessThan2Years: '0%',
        twoToFourYears: '50%',
        fivePlusYears: '100%'
      }
    }
  };
}


// Function to get Hospital Indemnity benefits based on selected plan
export function getHospitalIndemnityInsuranceBenefits(
  selectedPlan: string
): HospitalIndemnityPlanBenefits {
  // Define all benefits data with proper typing
  const allBenefits: Record<string, HospitalIndemnityPlanBenefits> = {
    plana: {
      hospitalAdmission: "$750",
      hospitalPerDay: {
        amount: "$150 Per Day",
        maxDays: "Max 30 days"
      },
      emergencyRoom: {
        amount: "$100/visit",
        maxVisits: "Max 2/year"
      },
      outpatientSurgery: {
        minor: "$250 for Minor Surgery",
        major: "$750 for Major Surgery"
      }
    },
    planb: {
      hospitalAdmission: "$1,500",
      hospitalPerDay: {
        amount: "$200 Per Day",
        maxDays: "Max 30 days"
      },
      emergencyRoom: {
        amount: "$150/visit",
        maxVisits: "Max 2/year"
      },
      outpatientSurgery: {
        minor: "$250 for Minor Surgery",
        major: "$1,000 for Major Surgery"
      }
    }
  };

  // Return benefits for the selected plan
  const planKey = selectedPlan.toLowerCase().replace(/\s+/g, '');
  
  if (planKey in allBenefits) {
    return allBenefits[planKey];
  }
  
  // Default fallback to Plan 1 if selectedPlan doesn't match
  //console.warn(`Selected plan "${selectedPlan}" not found, defaulting to Plan 1`);
  return allBenefits.plana;
}


// Function to calculate critical illness benefits based on coverage type and amount
export function getCriticalIllnessBenefits(
  coverageType: string | undefined  ,
  coverageAmount: number
): CriticalIllnessPlanBenefits {
  
  //console.log("from calculateBenefit",coverageType, coverageAmount)

  const calculateMaxBenefit = (faceAmount: number) => {
    return faceAmount * 3;
  };

  // Base benefits for insured person
  const insuredPerson: CoverageDetail = {
   
    faceAmount: coverageAmount,
    faceAmountRange: "[$5,000 - $25,000]",
    maxBenefit: calculateMaxBenefit(coverageAmount)
   
  };

  let spouse: CoverageDetail | undefined;
  let children: CoverageDetail | undefined;

  if (!coverageType) {
  // Handle the undefined case - maybe return default benefits or throw an error
  throw new Error('Coverage type is required');
}


  const plainCoverageType = coverageType.toLowerCase()
  .replace(/\s*\+\s*/g, '+') // remove spaces around '+'
  .replace(/\s+/g, ''); ;

  //console.log( plainCoverageType)
  // Calculate spouse benefits (50% to 100% of face amount)
 
  //console.log(plainCoverageType === 'me+1' )
  if (plainCoverageType === 'me+1' || 'myfamily') {
    
    const spouseFaceAmount = Math.floor(coverageAmount * 0.75); // Using 75% as middle ground
    spouse = {
      
      faceAmount: spouseFaceAmount,
      faceAmountRange: "[50% to 100%] of Face Amount of Insurance for Insured Person",
      maxBenefit: calculateMaxBenefit(spouseFaceAmount)
      
    };
   // console.log("this is spouse limit",spouse)
  }

  // Calculate children benefits (25% to 50% of face amount)
  if (plainCoverageType === 'myfamily') {
    //console.log("inside myfamily if in calculate benfit")
    const childrenFaceAmount = Math.floor(coverageAmount * 0.375); // Using 37.5% as middle ground
    children = {
      
      faceAmount: childrenFaceAmount,
      faceAmountRange: "[25% to 50%] of Face Amount of Insurance for Insured Person",
      maxBenefit: calculateMaxBenefit(childrenFaceAmount)
      
    };
  }

   //console.log("Individual spouse object:", spouse);

     const result = {
    insuredPerson,
    spouse,
    children
  };

 //console.log("Complete benefits object being returned:", result);
  //console.log("Spouse exists in result:", !!result.spouse);
  
  return result;
}


export function getShortTermBenefits(
  dbAmount: string | undefined
): ShortTermPlanBenefits {
  if (!dbAmount) {
    return {
      dailyBenefit: '$0/Day'
    };
  }

  if (dbAmount === '$50/Day' || dbAmount === '$50/day') {
    return {
      dailyBenefit: '$50/Day'
    };
  }

  if (dbAmount === '$100/Day' || dbAmount === '$100/day') {
    return {
      dailyBenefit: '$100/Day'
    };
  }

  if (dbAmount === '$150/Day' || dbAmount === '$150/day') {
    return {
      dailyBenefit: '$150/Day'
    };
  }

  if (dbAmount === '$200/Day' || dbAmount === '$200/day') {
    return {
      dailyBenefit: '$200/Day'
    };
  }

  // Default fallback for any unmatched input
  return {
    dailyBenefit: '$0/Day'
  };
}