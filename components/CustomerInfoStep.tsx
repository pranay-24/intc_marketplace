"use client";

import { useState } from "react";
import { useForm as useReactHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomerData, customerSchema } from "@/lib/types";
import { useForm } from "@/contexts/FormContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {getMembers} from "@/lib/pricing";
// Add these imports at the top of your CustomerInfoStep file
import FamilyMemberSelector, { validateFamilyMembers } from "@/components/FamilyMemberSelector";


import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Add the coverage type
type CoverageType = 'just-me' | 'me+1' | 'family';

// Array of US states for the dropdown
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", 
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
  "District of Columbia"
];

export default function CustomerInfoStep() {
  const { formData, updateFormData, nextStep, prevStep, saveProgress, user, isLoading } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedState, setSelectedState] = useState<string>(formData.customerInfo?.state || "");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  
  // Internal step state (0 = name step, 1 = address step)
  const [internalStep, setInternalStep] = useState(0);

 

// Option 1: Using an immediately invoked function expression (IIFE)
const fixedCoverageType : any= (() => {
// 
  
   // Get coverage type from previous answers
  const coverageType= getMembers(formData);

  const rawAnswer = coverageType  as string;; // adjust key as needed
  
  if (rawAnswer === 'Just me') return 'just-me';
  if (rawAnswer === 'Me + 1') return 'me+1';
  if (rawAnswer === 'My Family') return 'family';
  
  return coverageType; // fallback to original
})();
// Get existing family members from formData
  const existingFamilyMembers = formData.familyMembers || [];

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useReactHookForm<CustomerData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      ...formData.customerInfo,
      email: user?.email || formData.customerInfo?.email || ""
    }
  });

  // Handle moving to address step (internal)
  const handleNameNext = async () => {
    // Validate only name fields
    const isValid = await trigger(['firstName', 'lastName']);
    if (isValid) {
      setInternalStep(1);
    }
  };

  // Handle going back to name step (internal)
  const handleAddressBack = () => {
    setInternalStep(0);
  };

    // Create cart function
  const createCart = async () => {
    try {
      console.log('Creating cart with product data:', {
        productId: formData.productId,
        variantId: formData.variantId,
        sku: formData.sku,
        sku_id: formData.sku_id,
        customPrice: formData.productPrice
      });

      const response = await fetch('/api/bigcommerce/create-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems: [
            {
              productId: formData.productId,
              quantity: 1,
              ...(formData.sku_id && { sku_id: formData.sku_id }),
              ...(formData.sku && { sku: formData.sku }),
              ...(formData.variantId && { variantId: formData.variantId }),
              ...(formData.productPrice && { customPrice: formData.productPrice })
            },
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create cart');
      }

      const cartData = await response.json();
      console.log('Cart created successfully:', cartData);
      
      return cartData;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  };


  // Handle final form submission
  const handleFormSubmit = async (data: CustomerData) => {
    //console.log("Customer info form submitted with data:", data);
    setIsSubmitting(true);
    
    try {
      // Ensure we use the user's email
      const customerData = {
        ...data,
        email: user?.email || data.email
      };
      
      // Update form data with customer information
      updateFormData({ 
        customerInfo: customerData 
      });
      
      await saveProgress();
      // Create cart
      const cartResult = await createCart();


      if (cartResult.success && cartResult.cartId) {
        // Update form data with cart information
        updateFormData({
          cartId: cartResult.cartId,
          ...(cartResult.checkoutUrl && { checkoutUrl: cartResult.checkoutUrl })
        });
        
        // Save progress again with cart data
        await saveProgress();
        
        console.log('Cart created and form data updated:', {
          cartId: cartResult.cartId,
          checkoutUrl: cartResult.checkoutUrl
        });
        
        // Move to next step
        nextStep();
      } else {
        throw new Error('Cart creation failed - no cart ID received');
      }


      // Move to next step in main flow
      //nextStep();

    } catch (error) {
      console.error("Error saving customer info:", error);
      console.error("Full error:", JSON.stringify(error, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle state selection
  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setValue("state", state);
    setStateDropdownOpen(false);
  };

  // Render name step
  if (internalStep === 0) {
    return (
      <div className="space-y-6">
        

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Lets get your personal information</h2>
        </div>

        <div className="space-y-6">
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
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className={errors.dateOfBirth ? "border-red-500" : ""}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

             <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="e.g., 150"
                {...register("weight")}
                className={errors.weight ? "border-red-500" : ""}
              />
              {errors.weight && (
                <p className="text-red-500 text-sm">
                  {errors.weight.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                placeholder="e.g., 5'8&quot; or 68 inches"
                {...register("height")}
                className={errors.height ? "border-red-500" : ""}
              />
              {errors.height && (
                <p className="text-red-500 text-sm">
                  {errors.height.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                You can enter as feet and inches (5&apos;8&quot;) 
              </p>
            </div>



          </div>
<div className="flex justify-center mx-auto gap-4">
 <Button 
            variant="outline"
            onClick={prevStep}
            className="w-1/2 px-[40px] py-7"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
    <Button 
            type="button" 
            className="w-1/2 px-[40px] py-7"
            onClick={handleNameNext}
          >
            Next
          </Button>

</div>
        
        </div>
      </div>
    );
  }

  // Render address step
  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        className="mb-4"
        onClick={handleAddressBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What&apos;s your contact information and address?</h2>
        {user?.email && (
          <p className="text-gray-600 mb-4">We&apos;ll send updates to: {user.email}</p>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Label htmlFor="state">State</Label>
            <input type="hidden" {...register("state")} />
            
            <DropdownMenu open={stateDropdownOpen} onOpenChange={setStateDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedState || "Select a state"}
                  <span className="ml-2">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-60 overflow-y-auto">
                {US_STATES.map((state) => (
                  <DropdownMenuItem
                    key={state}
                    onClick={() => handleStateSelect(state)}
                  >
                    {state}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {errors.state && (
              <p className="text-red-500 text-sm">
                {errors.state.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Codes</Label>
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


        {/* Family Members Section - NEW */}
     {fixedCoverageType && fixedCoverageType !== 'just-me' && (
  <div className="space-y-4 border-t pt-6">
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">
        {fixedCoverageType === 'me+1' ? 'Additional Family Member' : 'Family Members'}
      </h3>
      <p className="text-gray-600 text-sm">
        {fixedCoverageType === 'me+1'
          ? 'Select or add one additional family member to cover'
          : 'Select or add family members to cover (minimum 2 required)'
        }
      </p>
    </div>
    
    <div className="bg-gray-50 p-4 rounded-lg">
      <FamilyMemberSelector 
        coverageType={fixedCoverageType}
        existingMembers={existingFamilyMembers}
      />
      <p className="text-center text-sm text-gray-400 mt-2">
        Coverage type: {fixedCoverageType} | Existing members: {existingFamilyMembers.length}
      </p>
    </div>
  </div>
)}

<div className="flex justify-center mx-auto gap-4">
   <Button
                type="button"
                variant="outline"
                className="w-1/2 px-[40px] py-7"
                onClick={prevStep}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back 
              </Button>


  <Button 
          type="submit" 
          className="w-1/2 px-[40px] py-7"
          disabled={isSubmitting}
        >
          <ArrowRight className="mr-2 h-4 w-4" /> {isSubmitting ? "Saving..." : "Confirm Details"}
        </Button>
</div>

        
      </form>
    </div>
  );
}