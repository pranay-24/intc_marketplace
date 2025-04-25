"use client";

import { useState } from "react";
import collections from "@/data/collections.json";
import questionsData from "@/data/questions.json";
import { Collection, Product, FormState, CustomerData, Question, ChoiceQuestion } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import CustomerInfo from "./CustomerInfo";
import EmbeddedCheckout from "./EmbeddedCheckout";

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState<FormState>({});
  const [cartId, setCartId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectCollection = (collection: Collection) => {
    setFormState({ ...formState, collection });
    setStep(2);
  };

  const handleQuestionSubmit = (answers: Record<string, string | string[]>) => {
    setFormState({ ...formState, questions: answers });
    setStep(3);
  };

  const selectProduct = (product: Product) => {
    setFormState({ ...formState, product });
    setStep(4);
  };

  const handleCustomerSubmit = async (customerInfo: CustomerData) => {
    try {
      if (!formState.product) {
        throw new Error('No product selected');
      }

      const response = await fetch('/api/bigcommerce/create-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems: [
            {
             // productId: formState.product.id,
             // quantity: 1,
             productId: formState.product.productId,
             quantity: 1,
             sku_id: formState.product.sku_id,
             sku: formState.product.sku,
             variantId: formState.product.variantId
            },
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create cart');
      }

      const data = await response.json();
      setCartId(data.cartId);
     // console.log(customerInfo);
     const updatedFormState = { ...formState, customerInfo };
     setFormState(updatedFormState);
     
     // Log the updated state (although this still won't show the updated state)
    // console.log("Updated form state:", updatedFormState.customerInfo);
       //console.log(cartId);
      // console.log(formState.customerInfo);
     // console.log(formState);
      setStep(5);
     
    } catch (error: any) {
      console.error('Error creating cart:', error);
      setError(`Failed to create cart: ${error.message}`);
    }
  };

  const getQuestionsForCollection = () => {
    if (!formState.collection) return [];
    const collectionQuestions = questionsData.collections.find(
      (c) => c.collectionName === formState.collection?.name
    );
    return collectionQuestions?.questions || [];
  };

  const handleCheckoutComplete = () => {
    // Handle successful checkout
    console.log('Checkout completed successfully');
  };

  const handleCheckoutError = (error: any) => {
    console.error('Checkout error:', error);
    setError('An error occurred during checkout. Please try again.');
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4, 5].map((number) => (
          <div
            key={number}
            className={`flex items-center ${
              number !== 5 ? "flex-1" : ""
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
            {number !== 5 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  step > number ? "bg-primary" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}


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

      {/* Step 2: Questions */}
      {step === 2 && formState.collection && (
        <div className="space-y-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setStep(1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collections
          </Button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formElement = e.target as HTMLFormElement;
              const formData = new FormData(formElement);
              const answers: Record<string, string | string[]> = {};

              getQuestionsForCollection().forEach((question) => {
                if (question.type === "multi_choice") {
                  const choiceQuestion = question as ChoiceQuestion;
                  const selectedOptions = choiceQuestion.options.filter(
                    (option) => formData.get(`${question.id}_${option}`) === "on"
                  );
                  answers[question.id] = selectedOptions;
                } else {
                  const value = formData.get(question.id);
                  if (value) answers[question.id] = value.toString();
                }
              });

              handleQuestionSubmit(answers);
            }}
            className="space-y-6"
          >
            {getQuestionsForCollection().map((question) => (
              <div key={question.id} className="space-y-4">
                <Label className="text-lg font-medium">
                  {question.question}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>

                {question.type === "text" && (
                  <Input
                    name={question.id}
                    placeholder={question.placeholder}
                    required={question.required}
                  />
                )}

                {question.type === "single_choice" && (
                  <RadioGroup name={question.id} required={question.required}>
                    {(question as ChoiceQuestion).options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}_${option}`} />
                        <Label htmlFor={`${question.id}_${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === "multi_choice" && (
                  <div className="space-y-2">
                    {(question as ChoiceQuestion).options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${question.id}_${option}`}
                          name={`${question.id}_${option}`}
                        />
                        <Label htmlFor={`${question.id}_${option}`}>{option}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Button type="submit" className="w-full">
              Continue to Products <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Step 3: Product Selection */}
      {step === 3 && formState.collection && (
        <div>
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => setStep(2)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Questions
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formState.collection.products.map((product) => (
              <Card
                key={product.productId}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => selectProduct(product)}
              >
                {/* <div className="aspect-video relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div> */}
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-lg text-primary">
                  ${product.price.toFixed(2)}
                </p>

                      {/* Benefits List - combining product and collection benefits */}
                      <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Plan Benefits:</h4>
                  <ul className="space-y-2">
                    {/* Product-specific benefits */}
                    {product.productBenefits && product.productBenefits.map((benefit, index) => (
                      <li key={`product-${index}`} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                    
                  {/* Collection common benefits */}
                      {formState.collection?.commonBenefits?.map((benefit, index) => (
                      <li key={`common-${index}`} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div> 
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Customer Information */}
      {step === 4 && (
        <CustomerInfo
          onBack={() => setStep(3)}
          onSubmit={handleCustomerSubmit}
        />
      )}

      {/* Step 5: Embedded Checkout */}
      {step === 5 && cartId && formState.customerInfo && (
        <EmbeddedCheckout
          cartId={cartId}
          customerInfo={formState.customerInfo}
          onCheckoutComplete={handleCheckoutComplete}
          onCheckoutError={handleCheckoutError}
        />
      )}
    </div>
  );
}