"use client";  
import React from 'react';
import { useForm } from '@/contexts/FormContext';
import collections from '@/data/collections.json';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CollectionSelectionStep() {
  const { formData, updateFormData, nextStep, saveProgress } = useForm();

  const selectCollection = async (collection: any) => {
    updateFormData({ 
      collectionId: collection.id.toString(),
      collectionName: collection.name,
      // Keep the full collection object for compatibility if needed elsewhere
      collection: collection
    });
    
    try {
      await saveProgress();
     
    } catch (error) {
      console.error('Error saving collection selection:', error);
      // You might want to show an error message to the user here
    }
  };

  const onSubmit = async () => {
    try {
      await saveProgress();
      nextStep();
    } catch (error) {
      console.error('Error saving progress:', error);
      // You might want to show an error message to the user here
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Which Insurance would you like?</h2>
        <p className="text-gray-600">Select the collection that best fits your needs</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.collections.map((collection) => (
          <Card
            key={collection.id}
            className={`p-6 cursor-pointer hover:shadow-lg transition-shadow text-center ${
              formData.collectionId === collection.id.toString() ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => selectCollection(collection)}
          >
            <h3 className="text-xl  font-semibold mb-2">{collection.name}</h3>
            <p className="text-gray-600  ">{collection.description}</p>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mx-auto">
       <Button 
        type="submit" 
        className="w-1/2 px-[40px] py-7 "
        disabled={!formData.collectionId}
         onClick={onSubmit}
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      </div>
      
    </div>
  );
}