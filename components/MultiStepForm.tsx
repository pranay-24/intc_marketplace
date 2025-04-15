"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import collections from "@/data/collections.json";
import { Collection, Product, customerSchema, FormData } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
  });

  const selectCollection = (collection: Collection) => {
    setFormData({ ...formData, collection });
    setStep(2);
  };

  const selectProduct = (product: Product) => {
    setFormData({ ...formData, product });
    setStep(3);
  };

  const onSubmit = (customerInfo: any) => {
    const finalFormData = { ...formData, customerInfo };
    console.log("Final Form Data:", finalFormData);
    // Here you can handle the form submission
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((number) => (
          <div
            key={number}
            className={`flex items-center ${
              number !== 3 ? "flex-1" : ""
            }`}
          >
            <div
              className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${
                step >= number
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-gray-300 text-gray-300"
              }`}
            >
              {number}
            </div>
            {number !== 3 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  step > number ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Collection Selection */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.collections.map((collection) => (
            <Card
              key={collection.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => selectCollection(collection)}
            >
              <div className="aspect-video relative mb-4">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
              <p className="text-gray-600">{collection.description}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Step 2: Product Selection */}
      {step === 2 && formData.collection && (
        <div>
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setStep(1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collections
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.collection.products.map((product) => (
              <Card
                key={product.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => selectProduct(product)}
              >
                <div className="aspect-video relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-lg text-primary">
                  ${product.price.toFixed(2)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Customer Information */}
      {step === 3 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Button
            type="button"
            variant="ghost"
            className="mb-4"
            onClick={() => setStep(2)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message as string}
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
                  {errors.email.message as string}
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
                  {errors.phone.message as string}
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
                  {errors.address.message as string}
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
                  {errors.city.message as string}
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
                  {errors.zipCode.message as string}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Complete Order <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
}