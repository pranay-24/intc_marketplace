"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerData, customerSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

interface CustomerInfoProps {
  onBack: () => void;
  onSubmit: (data: CustomerData) => void;
}

export default function CustomerInfo({ onBack, onSubmit }: CustomerInfoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerData>({
   // resolver: zodResolver(customerSchema),
  });

  const handleFormSubmit =  (data: CustomerData) => {
   // console.log("submit button inside customerInfo clicked")
    setIsSubmitting(true);
    try {
       // console.log(data);
      // console.log("About to submit customer data:", data);
        onSubmit(data);
      //console.log("Customer data submitted successfully");
    } catch (error) {
      console.error("Error submitting customer info:", error);
      console.error("Full error:", JSON.stringify(error, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        className="mb-4"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register("address")}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register("city")}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-red-500 text-sm">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">state</Label>
            <Input
              id="state"
              {...register("state")}
              className={errors.state ? "border-red-500" : ""}
            />
            {errors.state && (
              <p className="text-red-500 text-sm">
                {errors.state.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              {...register("zipCode")}
              className={errors.zipCode ? "border-red-500" : ""}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm">
                {errors.zipCode.message}
              </p>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
          onClick={() => console.log("Button directly clicked")}
        >
          {isSubmitting ? "Processing..." : "Continue to Checkout"}
        </Button>
      </form>
    </div>
  );
}