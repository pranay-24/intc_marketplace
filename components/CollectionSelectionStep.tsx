"use client";  
import React from 'react';
import { useForm } from '@/contexts/FormContext';
import collections from '@/data/collections.json';
import { Card } from '@/components/ui/card';

export default function CollectionSelectionStep() {
  const { formData, updateFormData, nextStep, saveProgress } = useForm();

  const selectCollection = async (collection: any) => {
    updateFormData({ 
      collectionId: collection.id,
      collectionName: collection.name,
      // Keep the full collection object for compatibility if needed elsewhere
      collection: collection
    });
    
    try {
      await saveProgress();
      nextStep();
    } catch (error) {
      console.error('Error saving collection selection:', error);
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
              formData.collectionId === collection.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => selectCollection(collection)}
          >
            <h3 className="text-xl  font-semibold mb-2">{collection.name}</h3>
            <p className="text-gray-600  ">{collection.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}