import { z } from "zod";

export const customerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
});

export type CustomerData = z.infer<typeof customerSchema>;

export interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
  products: Product[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface FormData {
  collection?: Collection;
  product?: Product;
  customerInfo?: CustomerData;
}