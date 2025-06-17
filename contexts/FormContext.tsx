"use client";  
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
// import { FormResponseService } from '@/lib/firebaseService';
import { FormResponse, StepConfig } from '@/lib/types';
import { FormResponseService, FamilyMemberService } from '@/lib/firebaseService';

interface FormContextType {
  formData: Partial<FormResponse>;
  currentStep: number;
  steps: StepConfig[];
  user: User | null;
  isLoading: boolean;
  updateFormData: (data: Partial<FormResponse>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  saveProgress: () => Promise<void>;
  submitForm: () => Promise<void>;
    resetForm: () => void;
}

const FormContext = createContext<FormContextType | null>(null);

const formReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET_FORM':
      return { ...state, formData: {}, currentStep: 0 };
    default:
      return state;
  }
};

export function FormProvider({ children, steps }: { children: React.ReactNode; steps: StepConfig[] }) {
  const [state, dispatch] = useReducer(formReducer, {
    formData: {},
    currentStep: 0,
    user: null,
    isLoading: true,
  });

  const visibleSteps = steps.filter(step => step.isVisible(state.formData));
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      dispatch({ type: 'SET_USER', payload: user });
      
      if (user) {
        try {
          // Load existing in-progress form response if any
          const existingForm = await FormResponseService.getLatestInProgress(user.uid);
          
          if (existingForm) {
            dispatch({ type: 'UPDATE_FORM_DATA', payload: existingForm });
            // Set step based on completed data
            const completedSteps = calculateCompletedSteps(existingForm);
            dispatch({ type: 'SET_STEP', payload: completedSteps });
          }
        } catch (error) {
          console.error('Error loading existing form:', error);
        }
      } else {
        // Reset form data when user logs out
        dispatch({ type: 'RESET_FORM' });
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return () => unsubscribe();
  }, []);

//   useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, async (user) => {
//     dispatch({ type: 'SET_USER', payload: user });
    
//     if (user) {
//       try {
//         // Load existing in-progress form response if any
//         const existingForm = await FormResponseService.getLatestInProgress(user.uid);
//         // console.log("from useeffect",existingForm)
//       if (existingForm && existingForm.id) {
//   // Load family members for this form
//   const familyMembers = await FamilyMemberService.getByFormResponseId(existingForm.id);
//   //console.log("from useeffect",familyMembers)
//   if (familyMembers.length > 0) {
//     // Find the coverage question ID from the existing answers
//     const existingAnswers = existingForm.questionsAnswers || {};
//     const coverageQuestionId = Object.keys(existingAnswers).find(key => 
//       existingAnswers[key] === "Me + 1" || existingAnswers[key] === "My Family"
//     );
    
//     if (coverageQuestionId) {
//       const formDataWithMembers = {
//         ...existingForm,
//         questionsAnswers: {
//           ...existingAnswers,
//           [`${coverageQuestionId}_family_members`]: familyMembers
//         }
        
//       };
      
//       dispatch({ type: 'UPDATE_FORM_DATA', payload: formDataWithMembers });
//       const completedSteps = calculateCompletedSteps(formDataWithMembers);
//       dispatch({ type: 'SET_STEP', payload: completedSteps });
//     }
//   } else {
//     dispatch({ type: 'UPDATE_FORM_DATA', payload: existingForm });
//     const completedSteps = calculateCompletedSteps(existingForm);
//     dispatch({ type: 'SET_STEP', payload: completedSteps });
//   }
//       }
//       } catch (error) {
//         console.error('Error loading existing form:', error);
//       }
//     } else {
//       // Reset form data when user logs out
//       dispatch({ type: 'RESET_FORM' });
//     }
    
//     dispatch({ type: 'SET_LOADING', payload: false });
//   });

//   return () => unsubscribe();
// }, []);

  const calculateCompletedSteps = (data: FormResponse) => {
    if (data.cartId) return 4; // Checkout step
    if (data.customerInfo) return 3; // Customer info completed
    if (data.selectedProduct) return 2; // Product selected
    if (data.questionsAnswers && Object.keys(data.questionsAnswers).length > 0) return 1; // Questions answered
    if (data.collectionName) return 1; // Collection selected
    return 0;
  };

  const updateFormData = (data: Partial<FormResponse>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  };

  const nextStep = () => {
    const visibleSteps = steps.filter(step => step.isVisible(state.formData));
    if (state.currentStep < visibleSteps.length - 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 0) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  };

  const goToStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };
   const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };


  const saveProgress = async () => {
    if (!state.user || !state.formData) return;

    try {
      const formDataToSave = {
        ...state.formData,
        userId: state.user.uid,
        status: 'in_progress' as const,
      };

      const formId = await FormResponseService.upsert(formDataToSave);
      
      if (!state.formData.id) {
        dispatch({ type: 'UPDATE_FORM_DATA', payload: { id: formId } });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  };

  const submitForm = async () => {
    if (!state.user || !state.formData || !state.formData.id) return;

    try {
      await FormResponseService.update(state.formData.id, { 
        status: 'completed'
      });
      
      // Optionally reset form after submission
      dispatch({ type: 'RESET_FORM' });
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  return (
    <FormContext.Provider value={{
      formData: state.formData,
      currentStep: state.currentStep,
      steps: steps.filter(step => step.isVisible(state.formData)),
      user: state.user,
      isLoading: state.isLoading,
      updateFormData,
      nextStep,
      prevStep,
      goToStep,
      resetForm,
      saveProgress,
      submitForm,
    }}>
      {children}
    </FormContext.Provider>
  );
}

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};