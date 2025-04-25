import { z } from "zod";

export const customerSchema = z.object({
  firstName: z.string().min(2, "first name must be at least 2 characters"),
  lastName: z.string().min(2, "last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
});

export type CustomerData = z.infer<typeof customerSchema>;

export interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  commonBenefits: string[];
  products: Product[];
 
}

export interface Product {
  productId: number;
  name: string;
  price: number;
  image: string;
  sku_id: number; // Added field
  sku: string; // Added field
  variantId: number; // Added field
  productBenefits: string[]; // Added product benefits array
}
export type QuestionType = "single_choice" | "multi_choice" | "text";

export interface BaseQuestion {
  id: string;
  question: string;
  type: QuestionType;
  required: boolean;
}

export interface TextQuestion extends BaseQuestion {
  type: "text";
  placeholder: string;
}

export interface ChoiceQuestion extends BaseQuestion {
  type: "single_choice" | "multi_choice";
  options: string[];
}

export type Question = TextQuestion | ChoiceQuestion;

export interface CollectionQuestions {
  collectionName: string;
  questions: Question[];
}


export interface FormState {
  collection?: Collection;
  questions?: Record<string, string | string[]>;
  product?: Product;
  customerInfo?: CustomerData;
}