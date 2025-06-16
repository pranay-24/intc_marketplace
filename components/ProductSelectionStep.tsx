"use client";  
import React,{ useMemo } from 'react';
import { useForm } from '@/contexts/FormContext';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Product,ProductRecommendation  } from '@/lib/pricing';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getRecommendedProducts} from  '@/lib/pricing';

export default function ProductSelectionStep() {
  const { formData, updateFormData, nextStep, saveProgress, prevStep } = useForm();

  // Get recommended products (filtered and sorted by match score)
  const recommendedProducts = useMemo(() => {
    const products = formData.collection?.products || [];
    console.log(formData.collectionName);
    return getRecommendedProducts(formData, formData.collectionName!);
  }, [formData]);

  const selectProduct = async (product: Product) => {
    updateFormData({ 
      selectedProduct: product,
      productId: product.productId,
      productName: product.name,
      productPrice: product.price,
      sku: product.sku,
      variantId: product.variantId,
      sku_id:product.sku_id
    });
    
    try {
      //console.log(product);
      await saveProgress();
      nextStep();
    } catch (error) {
      console.error('Error saving product selection:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        className="mb-4"
        onClick={prevStep}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to previous Step
      </Button>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select Your Product</h2>
        <p className="text-gray-600">Choose the product that best fits your needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedProducts.map((recommendation: ProductRecommendation) => {
          const product = recommendation.product;
          return (
            <Card
              key={`${product.productId}-${product.variantId}`}
              className={`p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                formData.selectedProduct?.sku_id === product.sku_id  ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => selectProduct(product)}
            >
            {/* Uncomment and modify if you have product images */}
            {/* <div className="aspect-video relative mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg object-cover w-full h-full"
              />
            </div> */}
            
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-lg text-primary mb-4">
              ${product.price.toFixed(2)}
            </p>

            {/* Recommendation reason */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Why this is recommended:</p>
              <p className="text-sm text-blue-700">{recommendation.reason}</p>
            </div>

            {/* Benefits List - combining product and collection benefits */}
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Plan Benefits:</h4>
              <ul className="space-y-2">
                {/* Product-specific benefits */}
                {product.productBenefits && product.productBenefits.map((benefit, index) => (
                  <li key={`product-${index}`} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
                
                {/* Collection common benefits */}
                {formData.collection?.commonBenefits?.map((benefit: string, index: number) => (
                  <li key={`common-${index}`} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
          );
        })}
      </div>
    </div>
  );
}