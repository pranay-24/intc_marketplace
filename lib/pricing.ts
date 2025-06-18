import { FormResponse } from '@/lib/types';
// Import your collections data
import collectionsData from '@/data/collections.json';
import questionCollectionsData from '@/data/questions.json';
import {getAccidentInsuranceBenefits , getCancerInsuranceBenefits, getHospitalIndemnityInsuranceBenefits,getCriticalIllnessBenefits,getShortTermBenefits } from '@/lib/calculateBenefits'
import {AccidentPlanBenefits } from '@/components/AccidentBenefitsRenderer'
import { CancerPlanBenefits } from '@/components/CancerBenefitsRenderer'
import {HospitalIndemnityPlanBenefits   } from '@/components/HospitalIndemnityBenefitsRenderer'
import {CriticalIllnessPlanBenefits } from '@/components/CriticalIllnessBenefitsRenderer'
import {ShortTermPlanBenefits } from '@/components/ShortTermBenefitsRenderer'

// Define interfaces (remove duplicate Product interface)
export interface Product {
  productId: number;
  name: string;
  price: number;
  image: string;
  sku_id: number;
  sku: string;
  variantId: number;
  productBenefits: string[];
}

export type PlanBenefits = 
  | AccidentPlanBenefits 
  | CancerPlanBenefits 
  | HospitalIndemnityPlanBenefits 
  | CriticalIllnessPlanBenefits
  |ShortTermPlanBenefits 


export interface ProductRecommendation {
  product: Product;
  reason: string;
  price: number;
   benefits?: PlanBenefits;
}

export interface UserAnswers {
  age?: number;
  coverageType?: string;
  planChoice?: string;
  tobaccoUse?: boolean;
  coverageAmount?: string;
  benefitPeriod?: string;
  dailyBenefit?: string;
  annualSalary?: number;
  [key: string]: any;
}


export interface ProductCollection {
  id: number;
  name: string;
  description: string;
  image: string;
  commonBenefits: string[];
  products: Product[];
}

export interface ProductCatalog {
  collections: ProductCollection[];
}

export interface Question {
  id: string;
  question: string;
  questionName?: string;
  isCoverageQuestion?: string;
  type: "single_choice" | "multi_choice" | "text";
  options?: string[];
  placeholder?: string;
  required: boolean;
}

export interface QuestionCollection {
  collectionName: string;
  questions: Question[];
}

 export interface InsuranceFormData {
  collections: QuestionCollection[];
}

// Pricing tables for insurance products
const ACCIDENT_PRICING_TABLES = {
  'Accident Insurance': {
    'Plan A': {
      'Individual': 14.03,
      'Individual+1': 29.59,
      'Family': 42.83
    },
    'Plan B': {
      'Individual': 20.97,
      'Individual+1': 43.43,
      'Family': 63.78
    }
  }
  // TODO: Add other insurance types pricing tables
};

// Pricing tables for cancer insurance products
const CANCER_PRICING_TABLES = {
  'Cancer Insurance': {
    '$5000': {
      '17-29': {
        'Individual': 1.82,
        'Individual+1': 2.98,
        'Family': 4.43
      },
      '30-39': {
        'Individual': 3.34,
        'Individual+1': 5.46,
        'Family': 8.13
      },
      '40-49': {
        'Individual': 6.53,
        'Individual+1': 10.69,
        'Family': 15.90
      },
      '50-59': {
        'Individual': 11.42,
        'Individual+1': 18.69,
        'Family': 27.80
      },
      '60-70': {
        'Individual': 14.36,
        'Individual+1': 23.49,
        'Family': 34.94
      }
    },
    '$10000': {
      '17-29': {
        'Individual': 3.61,
        'Individual+1': 5.91,
        'Family': 8.79
      },
      '30-39': {
        'Individual': 6.61,
        'Individual+1': 10.81,
        'Family': 16.08
      },
      '40-49': {
        'Individual': 12.92,
        'Individual+1': 21.14,
        'Family': 31.45
      },
      '50-59': {
        'Individual': 22.63,
        'Individual+1': 37.02,
        'Family': 55.07
      },
      '60-70': {
        'Individual': 28.50,
        'Individual+1': 46.63,
        'Family': 69.35
      }
    },
    '$15000': {
      '17-29': {
        'Individual': 5.40,  
        'Individual+1': 8.83,  
        'Family': 13.14  
      },
      '30-39': {
        'Individual': 9.87, 
        'Individual+1': 16.15,  
        'Family': 24.03  
      },
      '40-49': {
        'Individual': 19.31,  
        'Individual+1': 31.59,
        'Family': 46.99
      },
      '50-59': {
        'Individual': 33.84,
        'Individual+1': 55.36,
        'Family': 82.34
      },
      '60-70': {
        'Individual': 42.64,
        'Individual+1': 69.76,
        'Family': 103.76
      }
    },
    '$20000': {
      '17-29': {
        'Individual': 7.19,
        'Individual+1': 11.76,
        'Family': 17.49
      },
      '30-39': {
        'Individual': 13.14,
        'Individual+1': 21.50,
        'Family': 31.98
      },
      '40-49': {
        'Individual': 25.70,
        'Individual+1':42.05,
        'Family': 62.54
      },
      '50-59': {
        'Individual': 45.04,
        'Individual+1': 73.69,
        'Family': 109.61
      },
      '60-70': {
        'Individual': 56.78,
        'Individual+1': 92.89,
        'Family': 138.16
      }
    }
  }
};

// Pricing tables for hospital indemnity insurance products
const HOSPITAL_INDEMNITY_PRICING_TABLES = {
  'Hospital Indemnity': {
    'Plan A': {
      '17-29': {
        'Individual': 15.19,
        'Individual+1': 30.39,
        'Family': 45.40
      },
      '30-39': {
        'Individual': 19.74,
        'Individual+1': 39.47,
        'Family': 54.95
      },
      '40-49': {
        'Individual': 26.25,
        'Individual+1': 52.50,
        'Family': 68.61
      },
      '50-59': {
        'Individual': 35.94,
        'Individual+1': 73.77,
        'Family': 91.62
      },
      '60-70': {
        'Individual': 48.07,
        'Individual+1': 98.67,
        'Family': 115.75
      }
    },
    'Plan B': {
      '17-29': {
        'Individual': 22.91,
        'Individual+1': 46.98,
        'Family': 69.88
      },
      '30-39': {
        'Individual': 29.77,
        'Individual+1': 61.04,
        'Family': 84.40
      },
      '40-49': {
        'Individual': 39.62,
        'Individual+1': 81.23,
        'Family': 105.19
      },
      '50-59': {
        'Individual': 55.68,
        'Individual+1': 114.16,
        'Family': 136.63
      },
      '60-70': {
        'Individual': 74.47,
        'Individual+1': 152.69,
        'Family': 172.41
      }
    }
  }
};

// Pricing tables for Short Term Accident / Sickness Pay insurance
const SHORT_TERM_PRICING_TABLES = {
  'Short Term Accident/Sickness Pay': {
    '14-Day': {
      '17-29': {
        '$50/Day': 7.77,
        '$100/Day': 15.44,
        '$150/Day': 23.23,
        '$200/Day': 30.86
      },
      '30-39': {
        '$50/Day': 9.69,
        '$100/Day': 19.40,
        '$150/Day': 29.10,
        '$200/Day': 38.73
      },
      '40-49': {
        '$50/Day': 12.98,
        '$100/Day': 26.14,
        '$150/Day': 39.09,
        '$200/Day': 52.12
      },
      '50-59': {
        '$50/Day': 19.10,
        '$100/Day': 38.04,
        '$150/Day': 57.28,
        '$200/Day': 76.09
      },
      '60-67': {
        '$50/Day': 27.00,
        '$100/Day': 53.72,
        '$150/Day': 80.68,
        '$200/Day': 107.58
      }
    },
    '30-Day': {
      '17-29': {
        '$50/Day': 14.31,
        '$100/Day': 28.82,
        '$150/Day': 42.95,
        '$200/Day': 57.33
      },
      '30-39': {
        '$50/Day': 18.45,
        '$100/Day': 36.64,
        '$150/Day': 55.05,
        '$200/Day': 73.17
      },
      '40-49': {
        '$50/Day': 24.98,
        '$100/Day': 49.63,
        '$150/Day': 74.69,
        '$200/Day': 99.59
      },
      '50-59': {
        '$50/Day': 36.60,
        '$100/Day': 73.47,
        '$150/Day': 110.21,
        '$200/Day': 146.96
      },
      '60-67': {
        '$50/Day': 52.61,
        '$100/Day': 105.35,
        '$150/Day': 158.03,
        '$200/Day': 210.71
      }
    },
    '60-Day': {
      '17-29': {
        '$50/Day': 22.23,
        '$100/Day': 44.38,
        '$150/Day': 66.56,
        '$200/Day': 88.74
      },
      '30-39': {
        '$50/Day': 29.19,
        '$100/Day': 58.28,
        '$150/Day': 87.42,
        '$200/Day': 116.56
      },
      '40-49': {
        '$50/Day': 40.62,
        '$100/Day': 80.84,
        '$150/Day': 121.47,
        '$200/Day': 161.96
      },
      '50-59': {
        '$50/Day': 61.36,
        '$100/Day': 122.71,
        '$150/Day': 183.81,
        '$200/Day': 245.79
      },
      '60-67': {
        '$50/Day': 90.20,
        '$100/Day': 181.71,
        '$150/Day': 272.22,
        '$200/Day': 363.87
      }
    }
  }
};


// Pricing tables for Critical Illness Insurance (base rates for $5000 coverage)
const CRITICAL_ILLNESS_PRICING_TABLES = {
  'Critical Illness Insurance': {
    'Non-Tobacco': {
      '17-29': {
        'Individual': 1.91,
        'Individual+1': 2.50,
        'Family': 2.91
      },
      '30-39': {
        'Individual': 3.74,
        'Individual+1': 4.86,
        'Family': 5.61
      },
      '40-49': {
        'Individual': 7.37,
        'Individual+1': 9.58,
        'Family': 11.05
      },
      '50-59': {
        'Individual': 12.85,
        'Individual+1': 16.70,
        'Family': 19.27
      },
      '60-70': {
        'Individual': 21.11,
        'Individual+1': 27.44,
        'Family': 31.66
      }
    },
    'Tobacco': {
      '17-29': {
        'Individual': 3.25,
        'Individual+1': 4.26,
        'Family': 4.96
      },
      '30-39': {
        'Individual': 6.38,
        'Individual+1': 8.29,
        'Family': 9.57
      },
      '40-49': {
        'Individual': 12.56,
        'Individual+1': 16.33,
        'Family': 18.84
      },
      '50-59': {
        'Individual': 21.90,
        'Individual+1': 28.47,
        'Family': 32.85
      },
      '60-70': {
        'Individual': 35.98,
        'Individual+1': 46.78,
        'Family': 53.97
      }
    }
  }
};


// Get price from pricing table
function getPriceFromTable(
  insuranceType: string, 
  plan: string, 
  coverageTier: string
): number {
  const insurancePricing = ACCIDENT_PRICING_TABLES[insuranceType as keyof typeof ACCIDENT_PRICING_TABLES];
  if (!insurancePricing) return 0;
  
  const planPricing = insurancePricing[plan as keyof typeof insurancePricing];
  if (!planPricing) return 0;
  
  return planPricing[coverageTier as keyof typeof planPricing] || 0;
}


// Helper function to find question ID by questionName across all collections
export function findQuestionIdByName(collections: QuestionCollection[], questionName: string): string | null {
  for (const collection of collections) {
    for (const question of collection.questions) {
      if (question.questionName === questionName) {
        return question.id;
      }
    }
  }
  return null;
}

// Helper function to find all question IDs by questionName,so ids is found using questionNames
export function findAllQuestionIdsByName(collections: QuestionCollection[], questionName: string): string[] {
  const ids: string[] = [];
  for (const collection of collections) {
    for (const question of collection.questions) {
      if (question.questionName === questionName) {
        ids.push(question.id);
      }
    }
  }
  return ids;
}

// Helper function to get first available answer from multiple question IDs
export function getAnswerFromIds(questionsAnswers: any, ids: string[]): any {
  for (const id of ids) {
    if (questionsAnswers[id] !== undefined && questionsAnswers[id] !== null) {
      return questionsAnswers[id];
    }
  }
  return undefined;
}

// Updated helper function to handle multiple IDs for numeric answers
export function getNumericAnswer(questionsAnswers: any, ids: string[]): number | undefined {
  for (const id of ids) {
    const answer = questionsAnswers[id];
    if (answer !== undefined && answer !== null) {
      // Remove $ symbol if present
      const cleanAnswer = typeof answer === 'string' ? answer.replace('$', '') : answer;
      const numericValue = typeof cleanAnswer === 'string' ? parseInt(cleanAnswer, 10) : Number(cleanAnswer);
      if (!isNaN(numericValue)) {
        return numericValue;
      }
    }
  }
  return undefined;
}

export function extractUserAnswers(formData: Partial<FormResponse>, collections: QuestionCollection[]): UserAnswers {
  const questionsAnswers = formData.questionsAnswers || {};
  
  // Extract age from questions with questionName 'age'
  const ageQuestionIds = findAllQuestionIdsByName(collections, 'age');
  const age = getNumericAnswer(questionsAnswers, ageQuestionIds);
  
  // Extract coverage type from coverage questions
  const coverageQuestionIds = findAllQuestionIdsByName(collections, 'coverageType');
  const coverageType = getAnswerFromIds(questionsAnswers, coverageQuestionIds);
  
  
  // Extract plan choice from questions with questionName 'planChoice'
  const planChoiceIds = findAllQuestionIdsByName(collections, 'planChoice');
  const planChoice = getAnswerFromIds(questionsAnswers, planChoiceIds);
  
  // Extract illness history for critical illness
  const  tobaccoUseId = findQuestionIdByName(collections, 'tobaccoUse');
  const tobaccoUse = tobaccoUseId ? questionsAnswers[tobaccoUseId] === 'Yes' : false;
  
  // Extract coverage amount
  const coverageAmountId = findQuestionIdByName(collections, 'coverageAmount');
  const coverageAmount = coverageAmountId ? questionsAnswers[coverageAmountId] : undefined;
  
  // Extract annual salary
  const annualSalaryId = findQuestionIdByName(collections, 'annualSalary');
  const annualSalary = annualSalaryId ? getNumericAnswer(questionsAnswers, [annualSalaryId]) : undefined;
  
  // Extract daily benefit
  const dailyBenefitId = findQuestionIdByName(collections, 'dailyBenefit');
  const dailyBenefit = dailyBenefitId ? questionsAnswers[dailyBenefitId] : undefined;

  //Extract Benefit Period
  const benefitPeriodId = findQuestionIdByName(collections, 'benefitPeriod');
  const benefitPeriod = benefitPeriodId ? questionsAnswers[benefitPeriodId] : undefined;
  return {
    age,
    coverageType,
    planChoice,
    tobaccoUse,
    coverageAmount,
    annualSalary,
    dailyBenefit,
    benefitPeriod,
    // Include all original answers for reference
    ...questionsAnswers
  };
}

type CoverageType = 'just-me' | 'me+1' | 'family';
export function getMembers(formData: Partial<FormResponse>
  
  ): CoverageType | undefined {
    const questionData = questionCollectionsData as InsuranceFormData;
    const userAnswers = extractUserAnswers(formData, questionData.collections);

   return userAnswers.coverageType as CoverageType;
  }


// Main function to get recommended products
export function getRecommendedProducts(
  formData: Partial<FormResponse>,
  collectionName: string,
  
): ProductRecommendation[] {
  // Type the imported data properly
  const questionData = questionCollectionsData as InsuranceFormData;
  const productData = collectionsData as ProductCatalog;

  const userAnswers = extractUserAnswers(formData, questionData.collections);
  

  // Find the specific collection by name
  const targetCollection = productData.collections.find(
    collection => collection.name === collectionName
  );
  
  if (!targetCollection) {
    console.log(`Collection "${collectionName}" not found`);
    return [];
  }

  // Extract products from the specific collection
  const collectionProducts = targetCollection.products || [];
//console.log(collectionProducts )
  switch (collectionName) {
    case 'Accident Insurance':
      return getAccidentInsuranceRecommendation(userAnswers, collectionProducts);
      case 'Cancer Insurance':
      return getCancerInsuranceRecommendation(userAnswers, collectionProducts);
      case 'Hospital Indemnity Insurance':
      return getHospitalIndemnityRecommendation(userAnswers, collectionProducts);
      case 'Short Term Accident/Sickness Pay':
      return getShortTermAccidentSicknessRecommendation(userAnswers, collectionProducts);
      case 'Critical Illness Insurance':
      return getCriticalIllnessRecommendation(userAnswers, collectionProducts);

      // Add other cases here
    default:
      return [];
  }
}

// Accident Insurance Product Selection Logic
function getAccidentInsuranceRecommendation(
  userAnswers: UserAnswers,
  collectionProducts: Product[]
): ProductRecommendation[] {
  if (collectionProducts.length === 0) {
    return [];
  }

  // Determine plan preference from user answers
  let selectedPlan = 'Plan A'; // Default to Plan A
  let planReason = 'Default selection - Higher reimbursements for hospital stays, surgeries, and doctor visits';

  if (userAnswers.planChoice) {
    if (userAnswers.planChoice.includes('Plan A') || userAnswers.planChoice.includes('Higher reimbursements')) {
      selectedPlan = 'Plan A';
      planReason = 'Plan A selected - Higher reimbursements for hospital stays, surgeries, and doctor visits';
    } else if (userAnswers.planChoice.includes('Plan B') || userAnswers.planChoice.includes('budget-friendly')) {
      selectedPlan = 'Plan B';
      planReason = 'Plan B selected - Lower reimbursements, but more budget-friendly';
    }
  }
  
  // Determine coverage tier
  let coverageTier = 'Individual'; // Default
  let coverageReason = 'Individual coverage selected';
  
  if (userAnswers.coverageType) {
    if (userAnswers.coverageType === 'Just me') {
      coverageTier = 'Individual';
      coverageReason = 'Individual coverage selected';
    } else if (userAnswers.coverageType === 'Me + 1') {
      coverageTier = 'Individual+1';
      coverageReason = 'Coverage for you and one other person';
    } else if (userAnswers.coverageType === 'My Family') {
      coverageTier = 'Family';
      coverageReason = 'Family coverage selected';
    }
  }
  
  // Get price from pricing table
  const price = getPriceFromTable('Accident Insurance', selectedPlan, coverageTier);
  
  // Get benefits for the selected plan
  const benefits = getAccidentInsuranceBenefits(selectedPlan);


  // Find the matching product
  let selectedProduct = collectionProducts.find(product => 
    product.name.includes(selectedPlan) && 
    product.name.includes(coverageTier)
  );
  
  if (selectedProduct) {
    return [{
      product: {
        ...selectedProduct,
        price: price // Override with pricing table price
      },
      price: price,
      reason: `${planReason}. ${coverageReason}.`,
      benefits: benefits
    }];
  }
  
  // Fallback - use first product
  const fallbackBenefits = getAccidentInsuranceBenefits('Plan A');
  

  // Fallback - use first product
  return [{
    product: collectionProducts[0],
    price: getPriceFromTable('Accident Insurance', 'Plan A', 'Individual'),
    reason: 'Basic accident insurance product selected',
     benefits: fallbackBenefits
  }];
}
/**
 * Cancer Insurance Product Selection Logic (Placeholder)
 */

// Helper function to determine age bracket for cancer insurance
function getAgeBracket(age: number): string {
  if (age >= 17 && age <= 29) return '17-29';
  if (age >= 30 && age <= 39) return '30-39';
  if (age >= 40 && age <= 49) return '40-49';
  if (age >= 50 && age <= 59) return '50-59';
  if (age >= 60 && age <= 70) return '60-70';
  return '17-29'; // Default fallback
}

// Separate function to get price for cancer insurance
function getCancerPriceFromTable(
  coverageAmount: string,
  coverageType: string,
  age: number
): number {
  const insurancePricing = CANCER_PRICING_TABLES['Cancer Insurance'];
  if (!insurancePricing) return 0;
  
  const amountPricing = insurancePricing[coverageAmount as keyof typeof insurancePricing]; // e.g., '$5000'
  if (!amountPricing) return 0;
  
  const ageBracket = getAgeBracket(age);
  const agePricing = amountPricing[ageBracket as keyof typeof amountPricing];
  if (!agePricing) return 0;
  
  return agePricing[coverageType as keyof typeof agePricing] || 0; // e.g., 'Individual'
}

// Cancer Insurance Product Selection Logic
function getCancerInsuranceRecommendation(
  userAnswers: UserAnswers,
  collectionProducts: Product[]
): ProductRecommendation[] {
  if (collectionProducts.length === 0) {
    return [];
  }
  
  // Determine coverage amount from user answers
  let selectedCoverageAmount = '$5000'; // Default
  let amountReason = 'Basic coverage amount selected';
  
  if (userAnswers.coverageAmount) {
    console.log("coverage amount in useranswer",userAnswers.coverageAmount )
    // Clean the coverage amount to match pricing table format
    const cleanAmount = userAnswers.coverageAmount.replace(/[,$]/g, '');
    const numericAmount = parseInt(cleanAmount, 10);
    
    if (numericAmount >= 20000) {
      selectedCoverageAmount = '$20000';
      amountReason = 'Maximum coverage amount selected for comprehensive protection';
    } else if (numericAmount >= 15000) {
      selectedCoverageAmount = '$15000';
      amountReason = 'High coverage amount selected for enhanced protection';
    } else if (numericAmount >= 10000) {
      selectedCoverageAmount = '$10000';
      amountReason = 'Moderate coverage amount selected for balanced protection';
    } else {
      selectedCoverageAmount = '$5000';
      amountReason = 'Basic coverage amount selected for essential protection';
    }
  }
  
  // Determine coverage tier
  let coverageTier = 'Individual'; // Default
  let coverageReason = 'Individual coverage selected';
  
  if (userAnswers.coverageType) {
    if (userAnswers.coverageType === 'Just me') {
      coverageTier = 'Individual';
      coverageReason = 'Individual coverage selected';
    } else if (userAnswers.coverageType === 'Me + 1') {
      coverageTier = 'Individual+1';
      coverageReason = 'Coverage for you and one other person';
    } else if (userAnswers.coverageType === 'My Family') {
      coverageTier = 'Family';
      coverageReason = 'Family coverage selected';
    }
  }
  
  // Get user age
  const userAge = userAnswers.age || 25; // Default age if not provided
  const ageReason = `Based on age ${userAge}`;
  
  // Get price from pricing table using the dedicated cancer function
  const price = getCancerPriceFromTable(selectedCoverageAmount, coverageTier, userAge);
  
   // Get benefits for the selected plan
  const benefits = getCancerInsuranceBenefits(selectedCoverageAmount, userAnswers.coverageType);


  // Find the matching product based on coverage tier and amount
  let selectedProduct = collectionProducts.find(product => 
    product.name.includes(coverageTier) && 
    product.name.includes(selectedCoverageAmount.replace('$', ''))
  );
  
  if (selectedProduct) {
    return [{
      product: {
        ...selectedProduct,
        price: price // Override with pricing table price
      },
      price: price,
      reason: `${amountReason}. ${coverageReason}. ${ageReason}.`,
      benefits: benefits
    }];
  }
  
  const fallbackBenefits = getCancerInsuranceBenefits('$5000','Just Me');

  // Fallback - use first product or create a basic recommendation
  const fallbackProduct = collectionProducts[0] || {
    productId: 0,
    name: `Cancer Insurance - ${coverageTier}, ${selectedCoverageAmount}`,
    price: price,
    image: '',
    sku_id: 0,
    sku: '',
    variantId: 0,
    productBenefits: ['Cancer diagnosis benefit', 'Lump sum payment', 'No waiting period for accidents']
  };
  
  return [{
    product: {
      ...fallbackProduct,
      price: price
    },
    price: price,
    reason: `${amountReason}. ${coverageReason}. ${ageReason}.`,
    benefits:fallbackBenefits
  }];
}
/**
 * Critical Illness Insurance Product Selection Logic (Placeholder)
 */

// Helper function to calculate coverage multiplier for critical illness
function getCriticalIllnessCoverageMultiplier(coverageAmount: string): number {
  // Clean the coverage amount to get numeric value
  const cleanAmount = coverageAmount.replace(/[,$]/g, '');
  const numericAmount = parseInt(cleanAmount, 10);
  
  // Base rate is for $5000, so calculate multiplier
  return numericAmount / 5000;
}

// Separate function to get price for critical illness insurance
function getCriticalIllnessPriceFromTable(
  coverageAmount: string,
  coverageType: string,
  age: number,
  tobaccoUse: boolean
): number {
  const insurancePricing = CRITICAL_ILLNESS_PRICING_TABLES['Critical Illness Insurance'];
  if (!insurancePricing) return 0;
  
  // Determine tobacco status
  const tobaccoStatus = tobaccoUse ? 'Tobacco' : 'Non-Tobacco';
  const tobaccoPricing = insurancePricing[tobaccoStatus];
  if (!tobaccoPricing) return 0;
  
  const ageBracket = getAgeBracket(age);
  const agePricing = tobaccoPricing[ageBracket as keyof typeof tobaccoPricing];
  if (!agePricing) return 0;
  
  const baseRate = agePricing[coverageType as keyof typeof agePricing] || 0;
  
  // Calculate multiplier based on coverage amount
  const multiplier = getCriticalIllnessCoverageMultiplier(coverageAmount);
  
  return baseRate * multiplier;
}



// Critical Illness Insurance Product Selection Logic
function getCriticalIllnessRecommendation(
  userAnswers: UserAnswers,
  collectionProducts: Product[]
): ProductRecommendation[] {
  if (collectionProducts.length === 0) {
    return [];
  }
  
  // Determine coverage amount from user answers
  let selectedCoverageAmount = '$5000'; // Default
  let amountReason = 'Basic coverage amount selected';
  
  if (userAnswers.coverageAmount) {
    // Clean the coverage amount to match pricing table format
    const cleanAmount = userAnswers.coverageAmount.replace(/[,$]/g, '');
    const numericAmount = parseInt(cleanAmount, 10);
    
    if (numericAmount >= 25000) {
      selectedCoverageAmount = '$25000';
      amountReason = 'Maximum coverage amount selected for comprehensive protection';
    } else if (numericAmount >= 20000) {
      selectedCoverageAmount = '$20000';
      amountReason = 'High coverage amount selected for enhanced protection';
    } else if (numericAmount >= 15000) {
      selectedCoverageAmount = '$15000';
      amountReason = 'Moderate-high coverage amount selected for good protection';
    } else if (numericAmount >= 10000) {
      selectedCoverageAmount = '$10000';
      amountReason = 'Moderate coverage amount selected for balanced protection';
    } else {
      selectedCoverageAmount = '$5000';
      amountReason = 'Basic coverage amount selected for essential protection';
    }
  }
  
  // Determine coverage tier
  let coverageTier = 'Individual'; // Default
  let coverageReason = 'Individual coverage selected';
  
  if (userAnswers.coverageType) {
    if (userAnswers.coverageType === 'Just me') {
      coverageTier = 'Individual';
      coverageReason = 'Individual coverage selected';
    } else if (userAnswers.coverageType === 'Me + 1') {
      coverageTier = 'Individual+1';
      coverageReason = 'Coverage for you and one other person';
    } else if (userAnswers.coverageType === 'My Family') {
      coverageTier = 'Family';
      coverageReason = 'Family coverage selected';
    }
  }
  
  // Get user age
  const userAge = userAnswers.age || 25; // Default age if not provided
  const ageReason = `Based on age ${userAge}`;
  
  // Determine tobacco use
  const tobaccoUse = userAnswers.tobaccoUse || false;
  const tobaccoReason = tobaccoUse ? 'Tobacco user rates applied' : 'Non-tobacco user rates applied';
  
  // Get price from pricing table using the dedicated critical illness function
  const price = getCriticalIllnessPriceFromTable(selectedCoverageAmount, coverageTier, userAge, tobaccoUse);
  
  const cleanCoverageAmount = selectedCoverageAmount.replace(/[,$]/g, '');
    const numericCoverageAmount = parseInt(cleanCoverageAmount, 10);


  //  console.log("=== MAIN FUNCTION DEBUG ===");
 // console.log("userAnswers.coverageType:", userAnswers.coverageType);
 // console.log("numericCoverageAmount:", numericCoverageAmount);
  


   const benefits = getCriticalIllnessBenefits(userAnswers.coverageType, numericCoverageAmount);

 //  console.log("Benefits returned from function:", benefits);
 // console.log("Benefits spouse exists:", !!benefits.spouse);
 // console.log("Benefits spouse value:", benefits.spouse);

//console.log(benefits)

  // Find the matching product based on coverage tier and amount
  let selectedProduct = collectionProducts.find(product => 
    product.name.includes(coverageTier) && 
    product.name.includes(selectedCoverageAmount.replace('$', ''))
  );
  
if (selectedProduct) {
    return [{
      product: {
        ...selectedProduct,
        price: price // Override with pricing table price
      },
      price: price,
      reason: `${amountReason}. ${coverageReason}. ${ageReason}. ${tobaccoReason}.`,
      benefits:benefits
    }];
  }

 const fallbackBenefits = benefits;

  // Fallback - use first product or create a basic recommendation
  const fallbackProduct = collectionProducts[0] || {
    productId: 0,
    name: `Critical Illness Insurance - ${coverageTier}, ${selectedCoverageAmount}`,
    price: price,
    image: '',
    sku_id: 0,
    sku: '',
    variantId: 0,
    productBenefits: ['Lump sum benefit for critical illness diagnosis', 'Coverage for major illnesses', 'No restrictions on benefit use']
  };
   //console.log("Final recommendation object:", fallbackProduct);
   // console.log("Final recommendation benefits:", fallbackBenefits);
   // console.log("Final recommendation benefits spouse:", fallbackBenefits.spouse);
  return [{
    product: {
      ...fallbackProduct,
      price: price
    },
    price: price,
    reason: `${amountReason}. ${coverageReason}. ${ageReason}. ${tobaccoReason}.`,
    benefits:fallbackBenefits
  }];
  
}

/**
 * Hospital Indemnity Insurance Product Selection Logic (Placeholder)
 */

// Separate function to get price for hospital indemnity insurance
function getHospitalIndemnityPriceFromTable(
  plan: string,
  coverageType: string,
  age: number
): number {
  const insurancePricing = HOSPITAL_INDEMNITY_PRICING_TABLES['Hospital Indemnity'];
  if (!insurancePricing) return 0;
  
  const planPricing = insurancePricing[plan as keyof typeof insurancePricing ]; // e.g., 'Plan A' or 'Plan B'
  if (!planPricing) return 0;
  
  const ageBracket = getAgeBracket(age);
  const agePricing = planPricing[ageBracket as keyof typeof planPricing];
  if (!agePricing) return 0;
  
  return agePricing[coverageType as keyof typeof agePricing] || 0; // e.g., 'Individual'
}

// Hospital Indemnity Insurance Product Selection Logic
function getHospitalIndemnityRecommendation(
  userAnswers: UserAnswers,
  collectionProducts: Product[]
): ProductRecommendation[] {
  if (collectionProducts.length === 0) {
    return [];
  }
  
  // Determine plan preference from user answers
  let selectedPlan = 'Plan A'; // Default to Plan A
  let planReason = 'Plan A selected - Basic hospital indemnity coverage';
  
  if (userAnswers.planChoice) {
    if (userAnswers.planChoice.includes('Plan A') || userAnswers.planChoice.includes('basic') || userAnswers.planChoice.includes('lower')) {
      selectedPlan = 'Plan A';
      planReason = 'Plan A selected - Basic hospital indemnity coverage with lower premiums';
    } else if (userAnswers.planChoice.includes('Plan B') || userAnswers.planChoice.includes('enhanced') || userAnswers.planChoice.includes('comprehensive')) {
      selectedPlan = 'Plan B';
      planReason = 'Plan B selected - Enhanced hospital indemnity coverage with higher benefits';
    }
  }
  
  // Determine coverage tier
  let coverageTier = 'Individual'; // Default
  let coverageReason = 'Individual coverage selected';
  
  if (userAnswers.coverageType) {
    if (userAnswers.coverageType === 'Just me') {
      coverageTier = 'Individual';
      coverageReason = 'Individual coverage selected';
    } else if (userAnswers.coverageType === 'Me + 1') {
      coverageTier = 'Individual+1';
      coverageReason = 'Coverage for you and one other person';
    } else if (userAnswers.coverageType === 'My Family') {
      coverageTier = 'Family';
      coverageReason = 'Family coverage selected';
    }
  }
  
  // Get user age
  const userAge = userAnswers.age || 25; // Default age if not provided
  const ageReason = `Based on age ${userAge}`;
  
  // Get price from pricing table using the dedicated hospital indemnity function
  const price = getHospitalIndemnityPriceFromTable(selectedPlan, coverageTier, userAge);
  
   const benefits = getHospitalIndemnityInsuranceBenefits(selectedPlan);


  // Find the matching product based on plan and coverage tier
  let selectedProduct = collectionProducts.find(product => 
    product.name.includes(selectedPlan) && 
    product.name.includes(coverageTier)
  );
  
  if (selectedProduct) {
    return [{
      product: {
        ...selectedProduct,
        price: price // Override with pricing table price
      },
      price: price,
      reason: `${planReason}. ${coverageReason}. ${ageReason}.`,
       benefits: benefits
    }];
  }
  
   const fallbackBenefits = getHospitalIndemnityInsuranceBenefits('Plan A');


  // Fallback - use first product or create a basic recommendation
  const fallbackProduct = collectionProducts[0] || {
    productId: 0,
    name: `Hospital Indemnity - ${selectedPlan}, ${coverageTier}`,
    price: price,
    image: '',
    sku_id: 0,
    sku: '',
    variantId: 0,
    productBenefits: ['Daily hospital benefit', 'Outpatient surgery benefit', 'Emergency room benefit']
  };
  
  return [{
    product: {
      ...fallbackProduct,
      price: price
    },
    price: price,
    reason: `${planReason}. ${coverageReason}. ${ageReason}.`,
    benefits:fallbackBenefits
  }];
}


/**
 * Short Term Accident Sickness Pay Product Selection Logic (Placeholder)
 */

// Helper function to determine age bracket for short term insurance (different from others)
function getShortTermAgeBracket(age: number): string {
  if (age >= 17 && age <= 29) return '17-29';
  if (age >= 30 && age <= 39) return '30-39';
  if (age >= 40 && age <= 49) return '40-49';
  if (age >= 50 && age <= 59) return '50-59';
  if (age >= 60 && age <= 67) return '60-67';
  return '17-29'; // Default fallback
}

// Helper function to determine daily benefit based on salary
// function getDailyBenefitFromSalary(annualSalary: number): string {
//   if (annualSalary >= 68000) return '$200/Day';
//   if (annualSalary >= 51000) return '$150/Day';
//   if (annualSalary >= 34000) return '$100/Day';
//   if (annualSalary >= 17000) return '$50/Day';
//   return '$50/Day'; // Default fallback for lower salaries
// }

// Separate function to get price for short term accident/sickness pay insurance
function getShortTermPriceFromTable(
  benefitPeriod: string,
  dailyBenefit: string,
  age: number
): number {
  //console.log('DEBUG - Input parameters:', { benefitPeriod, dailyBenefit, age });
  
  const insurancePricing = SHORT_TERM_PRICING_TABLES['Short Term Accident/Sickness Pay'];
  if (!insurancePricing) {
    //console.log('DEBUG - No insurance pricing found');
    return 0;
  }
  
 // console.log('DEBUG - Available benefit periods:', Object.keys(insurancePricing));
  
  const periodPricing = insurancePricing[benefitPeriod as keyof typeof insurancePricing]; // e.g., '14-Day Benefit Period'
  if (!periodPricing) {
    //console.log('DEBUG - No period pricing found for:', benefitPeriod);
    return 0;
  }
  
  const ageBracket = getShortTermAgeBracket(age);
  //console.log('DEBUG - Age bracket for age', age, ':', ageBracket);
  
  const agePricing = periodPricing[ageBracket as keyof typeof periodPricing];
  if (!agePricing) {
    //console.log('DEBUG - No age pricing found for bracket:', ageBracket);
    return 0;
  }
  
  //console.log('DEBUG - Available daily benefits:', Object.keys(agePricing));
  
  const price = agePricing[dailyBenefit as keyof typeof agePricing] || 0;
  //console.log('DEBUG - Final price for', dailyBenefit, ':', price);
  
  return price;
}

// Short Term Accident/Sickness Pay Insurance Product Selection Logic
// Short Term Accident/Sickness Pay Insurance Product Selection Logic
function getShortTermAccidentSicknessRecommendation(
  userAnswers: UserAnswers,
  collectionProducts: Product[]
): ProductRecommendation[] {
  if (collectionProducts.length === 0) {
    return [];
  }
  //console.log(collectionProducts)
  // Get user age
  const userAge = userAnswers.age || 25; // Default age if not provided
  const ageReason = `Based on age ${userAge}`;
  
  // Get daily benefit directly from user answers
  let dailyBenefit = userAnswers.dailyBenefit || '$50'; // Default daily benefit if not provided
  const dbAmount = dailyBenefit
  const benefits = getShortTermBenefits(dbAmount);


  // Normalize the daily benefit format to match pricing table (ensure uppercase 'D' in 'Day')
  if (dailyBenefit && typeof dailyBenefit === 'string') {
    dailyBenefit = dailyBenefit.replace('/day', '/Day');
  }
  
  const dailyBenefitReason = `Selected daily benefit of ${dailyBenefit}`;
  
  //console.log('DEBUG - Original dailyBenefit:', userAnswers.dailyBenefit);
  //console.log('DEBUG - Normalized dailyBenefit:', dailyBenefit);
  
  // Determine benefit period from user answers (if available) or use default
  let benefitPeriod = '14-Day'; // Default
  let periodReason = '14-day benefit period selected for basic coverage';
  
  //console.log('DEBUG - userAnswers.benefitPeriod:', userAnswers.benefitPeriod);
  
  if (userAnswers.benefitPeriod) {
    if (userAnswers.benefitPeriod.includes('60') || userAnswers.benefitPeriod === '60-Day Benefit Period') {
      benefitPeriod = '60-Day';
      periodReason = '60-day benefit period selected for maximum coverage duration';
     // console.log('DEBUG - Set to 60-day period');
    } else if (userAnswers.benefitPeriod.includes('30') || userAnswers.benefitPeriod === '30-Day Benefit Period') {
      benefitPeriod = '30-Day';
      periodReason = '30-day benefit period selected for extended coverage';
      //console.log('DEBUG - Set to 30-day period');
    } else if (userAnswers.benefitPeriod.includes('14') || userAnswers.benefitPeriod === '14-Day Benefit Period') {
      benefitPeriod = '14-Day';
      periodReason = '14-day benefit period selected for basic coverage';
     // console.log('DEBUG - Set to 14-day period');
    }
  }
  
  //console.log('DEBUG - Final benefitPeriod:', benefitPeriod);
  
  // Get price from pricing table using the dedicated short term function
  const price = getShortTermPriceFromTable(benefitPeriod, dailyBenefit, userAge);
   //console.log(price)
  // Find the matching product based on benefit period and daily benefit
//   let selectedProduct = collectionProducts.find(product => {
//     console.log(product.name)
// product.name.includes(benefitPeriod.replace('-day', '')) && 
//     product.name.includes(dailyBenefit.replace('$', ''))
//   }
    
//   );



  // Find the matching product - FIXED LOGIC
  let selectedProduct = collectionProducts.find(product => {
    //console.log('Checking product:', product.name);
    
    // Extract benefit amount from dailyBenefit (e.g., "$50/Day" -> "50")
    const benefitAmount = dailyBenefit.replace(/[$\/Day]/g, '');
    
    // Extract period number from benefitPeriod (e.g., "14-Day" -> "14")
    const periodNumber = benefitPeriod.replace('-Day', '');
    
     


    // Check if product name contains both the benefit amount and period
    // Product names in JSON are like: "$50, 14-day", "$100, 30-day", etc.
    const matchesBenefit = product.name.includes(`$${benefitAmount}`);
    const matchesPeriod = product.name.includes(`${periodNumber}-day`);
    

    return matchesBenefit && matchesPeriod;
  });

 


 // console.log(selectedProduct?.name)
  if (selectedProduct) {
    return [{
      product: {
        ...selectedProduct,
        price: price // Override with pricing table price
      },
      price: price,
      reason: `${dailyBenefitReason}. ${periodReason}. ${ageReason}.`,
      benefits:benefits
    }];
  }
  
  // Fallback - use first product or create a basic recommendation
  const fallbackProduct = collectionProducts[0] || {
    productId: 0,
    name: `Short Term Accident/Sickness Pay - ${benefitPeriod}, ${dailyBenefit}`,
    price: price,
    image: '',
    sku_id: 0,
    sku: '',
    variantId: 0,
    productBenefits: ['Daily benefit for accident or sickness', 'Short-term income replacement', 'No waiting period for accidents']
  };
  
  return [{
    product: {
      ...fallbackProduct,
      price: price
    },
    price: price,
    reason: `${dailyBenefitReason}. ${periodReason}. ${ageReason}.`
  }];
}
/**
 * Helper function to extract numeric values from answers
 */
// function getNumericAnswer(answers: Record<string, any>, key: string): number | null {
//   const value = answers[key];
//   if (typeof value === 'number') return value;
//   if (typeof value === 'string') {
//     const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
//     return isNaN(parsed) ? null : parsed;
//   }
//   return null;
// }

/**
 * Utility function to get the top recommended product for a collection
 */
// export function getTopRecommendation(
//   formData: FormResponse,
//   allProducts: Product[],
//   collectionName: string
// ): ProductRecommendation | null {
//   const recommendations = getRecommendedProducts(formData, allProducts, collectionName,collectionsData.collections);
//   return recommendations.length > 0 ? recommendations[0] : null;
// }

/**
 * Debug function to log extracted user answers
 */
// export function debugUserAnswers(formData: FormResponse, collections: any[]): void {
//   const userAnswers = extractUserAnswers(formData,collections);
//   console.log('Extracted User Answers:', userAnswers);
// }