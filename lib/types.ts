// import { z } from "zod";

// export const customerSchema = z.object({
//   firstName: z.string().min(2, "first name must be at least 2 characters"),
//   lastName: z.string().min(2, "last name must be at least 2 characters"),
//   email: z.string().email("Invalid email address"),
//   phone: z.string().min(10, "Phone number must be at least 10 characters"),
//   address: z.string().min(5, "Address must be at least 5 characters"),
//   city: z.string().min(2, "City must be at least 2 characters"),
//   state: z.string().min(2, "State must be at least 2 characters"),
//   zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
// });

// export type CustomerData = z.infer<typeof customerSchema>;

// export interface Collection {
//   id: number;
//   name: string;
//   description: string;
//   image: string;
//   commonBenefits: string[];
//   products: Product[];
 
// }

// export interface Product {
//   productId: number;
//   name: string;
//   price: number;
//   image: string;
//   sku_id: number; // Added field
//   sku: string; // Added field
//   variantId: number; // Added field
//   productBenefits: string[]; // Added product benefits array
// }
// export type QuestionType = "single_choice" | "multi_choice" | "text";

// export interface BaseQuestion {
//   id: string;
//   question: string;
//   type: QuestionType;
//   required: boolean;
// }

// export interface TextQuestion extends BaseQuestion {
//   type: "text";
//   placeholder: string;
// }

// export interface ChoiceQuestion extends BaseQuestion {
//   type: "single_choice" | "multi_choice";
//   options: string[];
// }

// export type Question = TextQuestion | ChoiceQuestion;

// export interface CollectionQuestions {
//   collectionName: string;
//   questions: Question[];
// }


// export interface FormState {
//   collection?: Collection;
//   questions?: Record<string, string | string[]>;
//   product?: Product;
//   customerInfo?: CustomerData;
// }

import { z } from "zod";
import {InsuranceBenefits} from '@/lib/calculateBenefits'
// Product interface
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

// Collection interface
export interface Collection {
  id: string;
  name: string;
  description: string;
  products: Product[];
  commonBenefits?: string[];
}

export const customerSchema = z.object({
  firstName: z.string().min(2, "first name must be at least 2 characters"),
  lastName: z.string().min(2, "last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),

   dateOfBirth: z.string().min(1, "Date of birth is required").refine((date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - parsedDate.getFullYear();
    return !isNaN(parsedDate.getTime()) && age >= 0 && age <= 120;
  }, "Please enter a valid date of birth"),
  
  weight: z.string().min(1, "Weight is required").refine((weight) => {
    const weightNum = parseFloat(weight);
    return !isNaN(weightNum) && weightNum > 0 && weightNum <= 1000;
  }, "Please enter a valid weight (in lbs)"),
  
  height: z.string().min(1, "Height is required").refine((height) => {
    // Accept formats like "5'8"", "5'8", "68", "5 ft 8 in", etc.
    const heightRegex = /^(\d{1,2})'?\s*(\d{1,2})"?$|^\d{1,3}$/;
    return heightRegex.test(height.trim());
  }, "Please enter a valid height (e.g., 5'8\" or 68 inches)")

});

export type CustomerData = z.infer<typeof customerSchema>;

export interface StepConfig {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  isRequired: boolean;
  isVisible: (formData: any) => boolean;
}



import { Timestamp } from 'firebase/firestore';

// export interface FormResponse {
//   id?: string;
//   userId: string;
//   collectionId?: string;
//   collectionName?: string;
//   questionsAnswers: Record<string, any>;
//   selectedProduct?: Product;
//   customerInfo?: CustomerData;
//   cartId?: string;
//   status: 'in_progress' | 'completed' | 'abandoned';
//   createdAt?: Timestamp | Date;
//   updatedAt?: Timestamp | Date;
// }

export interface FormResponse {
  id?: string;
  userId: string;
  status: 'in_progress' | 'completed';
  
  // Collection step
  collectionId?: string;
  collectionName?: string;
  collection?: Collection;
  
  // Questions step
  questionsAnswers?: Record<string, any>;
  
  // Product step
  selectedProduct?: Product;
  productId?: number;
  productName?: string;
  productPrice?: number;
  sku?: string;
  variantId?: number;
  sku_id?: number;
  // Customer step
  customerInfo?: CustomerData;
  
   familyMembers?: FamilyMember[];
   
   benefits?: InsuranceBenefits;

  // Checkout step
  cartId?: string;
  checkoutUrl?: string;
  
  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}


export interface FamilyMember {
  id?: string;
  formResponseId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  height: string;
  weight: string;
  relationship: string;
}

// export interface Product1 {
//   id: string;
//   name: string;
//   description?: string;
//   price?: number;
//   image?: string;
//   category?: string;
// }

// export interface CustomerData1 {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone?: string;
//   address?: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
// }

// export interface StepConfig {
//   id: string;
//   title: string;
//   description?: string;
//   component: React.ComponentType<any>;
//   isRequired: boolean;
//   isVisible: (formData: any) => boolean;
// }

// Firebase-specific interfaces
export interface FirebaseFormResponse extends Omit<FormResponse, 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseFamilyMember extends Omit<FamilyMember, 'createdAt'> {
  createdAt: Timestamp;
}