"use client";  
import React,{useState,useEffect} from 'react';
import { useForm } from '@/contexts/FormContext';
import QuestionRenderer from '@/components/QuestionRenderer';
import questionsData from '@/data/questions.json';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { FamilyMemberService } from '@/lib/firebaseService';
import { FamilyMember } from '@/lib/types';
import ShortTermAccidentQuestionRenderer from '@/components/ShortTermAccidentQuestionRenderer';

export default function QuestionsStep() {
  const { formData, updateFormData, nextStep, prevStep, saveProgress, resetForm } = useForm();
const [shouldAdvanceStep, setShouldAdvanceStep] = useState(false);
 // Use useEffect to handle step advancement after form data is updated
  useEffect(() => {
    if (shouldAdvanceStep && formData.questionsAnswers) {
      console.log('Advancing step due to form data update');
      nextStep();
      setShouldAdvanceStep(false);
    }
  }, [formData.questionsAnswers, shouldAdvanceStep, nextStep]);


  // const getQuestionsForCollection = () => {
  //   if (!formData.collectionName) return [];
  //   const collectionQuestions = questionsData.collections.find(
  //     (c) => c.collectionName === formData.collectionName
  //   );
  //   return collectionQuestions?.questions || [];
  // };

  // const handleSubmit = async (answers: Record<string, any>) => {
  //   updateFormData({ questionsAnswers: answers });
    
  //   try {
  //     await saveProgress();
  //    await saveFamilyMembers(answers);

  //     nextStep();
  //   } catch (error) {
  //     console.error('Error saving questions:', error);
  //     // You might want to show an error message to the user here
  //   }
  // };


  // const saveFamilyMembers = async (answers: Record<string, any>) => {
  //   // Only proceed if we have a form response ID
  //   if (!formData.id) {
  //     console.warn('No form response ID found, skipping family member save');
  //     return;
  //   }

  //   try {
  //     // console.log('All answers keys:', Object.keys(answers));
  //   //console.log('Full answers object:', answers);
  //     // Find all keys that end with '_family_members' (our family member data)
  //     const memberKeys = Object.keys(answers).filter(key => key.endsWith('_family_members'));
  //       //console.log('Member keys found:', memberKeys);
  //     for (const memberKey of memberKeys) {
  //       const familyMembers = answers[memberKey] as FamilyMember[];
        
  //       if (familyMembers?.length > 0) {
  //         // Delete existing family members for this question to avoid duplicates
  //         // Note: You might want to add a more specific method to your service
  //         // that deletes by formResponseId AND question ID
  //         await FamilyMemberService.deleteByFormResponseId(formData.id);
  //         // Create new family members
  //         for (const member of familyMembers) {
  //           await FamilyMemberService.create({
  //             ...member,
  //             formResponseId: formData.id,
  //           });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error saving family members:', error);
  //     // Don't throw here - we don't want to block progression if family member save fails
  //   }
  // };


const getQuestionsForCollection = () => {
    if (!formData.collectionName) return [];
    const collectionQuestions = questionsData.collections.find(
      (c) => c.collectionName === formData.collectionName
    );
    return collectionQuestions?.questions || [];
  };

  // const handleSubmit = async (answers: Record<string, any>) => {
  //   updateFormData({ questionsAnswers: answers });
    
  //   try {
  //     await saveProgress();
  //     nextStep();
  //   } catch (error) {
  //     console.error('Error saving questions:', error);
  //     // You might want to show an error message to the user here
  //   }
  // };

  const handleSubmit = async (answers: Record<string, any>) => {
    console.log('=== handleSubmit called ===');
    
    // Update form data
    updateFormData({ questionsAnswers: answers });
    
    try {
      // Save progress
      await saveProgress();
      
      // Set flag to advance step (will be handled by useEffect)
      setShouldAdvanceStep(true);
      
    } catch (error) {
      console.error('Error saving questions:', error);
    }
  };


  const questions = getQuestionsForCollection();
 const isShortTermAccident = formData.collectionName === "Short Term Accident/Sickness Pay";

  return (
    <div className="space-y-6">
      {/* <Button variant="ghost" onClick={resetForm}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Reset Form
      </Button> */}

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{formData.collectionName} Product </h2>
        <p className="text-gray-600">Answer a few questions and help us personalize your experience </p>
      </div>

   
      {isShortTermAccident ? (
        <ShortTermAccidentQuestionRenderer 
          questions={questions}
          initialAnswers={formData.questionsAnswers || {}}
          onSubmit={handleSubmit}
        />
      ) : (
        <QuestionRenderer 
          questions={questions}
          initialAnswers={formData.questionsAnswers || {}}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}