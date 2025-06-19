"use client";  
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft,ArrowRight } from 'lucide-react';
import { useForm } from '@/contexts/FormContext';

interface QuestionRendererProps {
  questions: any[];
  initialAnswers: Record<string, any>;
  onSubmit: (answers: Record<string, any>) => void;
}

export default function ShortTermAccidentQuestionRenderer({ questions, initialAnswers, onSubmit }: QuestionRendererProps) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [forceRender, setForceRender] = useState(0);
  const {  resetForm } = useForm();

  // Force re-render when salary changes (using the actual question ID)
  useEffect(() => {
    const salaryQuestion = questions.find(q => q.questionName === 'annualSalary');
    if (salaryQuestion) {
      setForceRender(prev => prev + 1);
    }
  }, [answers[questions.find(q => q.questionName === 'annualSalary')?.id || ''], questions]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  const isFormValid = () => {
    // Check required questions
    const requiredQuestions = questions.filter(q => q.required);
    const hasAllRequiredAnswers = requiredQuestions.every(q => {
      const answer = answers[q.id];
      return answer !== undefined && answer !== '' && (Array.isArray(answer) ? answer.length > 0 : true);
    });

    return hasAllRequiredAnswers;
  };

  const extractNumberFromText = (text: string): number => {
    if (!text) return 0;
    // Remove commas, dollar signs, and extract numbers
    const cleanText = text.toString().replace(/[$,]/g, '');
    const match = cleanText.match(/\d+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const getFilteredDailyBenefitOptions = () => {
    // Find the salary question by questionName and get its ID
    const salaryQuestion = questions.find(q => q.questionName === 'annualSalary');
    const salaryText = salaryQuestion ? (answers[salaryQuestion.id] || '') : '';
    const salary = extractNumberFromText(salaryText);
    
    //console.log('Salary question ID:', salaryQuestion?.id, 'Salary text:', salaryText, 'Parsed salary:', salary); // Debug log
    
    if (salary < 17000) {
      return []; // Not eligible
    } else if (salary >= 17000 && salary <= 33999) {
      return ['$50/day'];
    } else if (salary >= 34000 && salary <= 50999) {
      return ['$50/day', '$100/day'];
    } else if (salary >= 51000 && salary <= 67999) {
      return ['$50/day', '$100/day', '$150/day'];
    } else if (salary >= 68000) {
      return ['$50/day', '$100/day', '$150/day', '$200/day'];
    }
    
    return [];
  };

  const renderQuestion = (question: any) => {
    // Special handling for dailyBenefit question
    if (question.questionName === "dailyBenefit") {
      const filteredOptions = getFilteredDailyBenefitOptions();
      // Find the salary question by questionName and get its value
      const salaryQuestion = questions.find(q => q.questionName === 'annualSalary');
      const salaryText = salaryQuestion ? (answers[salaryQuestion.id] || '') : '';
      const salary = extractNumberFromText(salaryText);
      
     // console.log('Rendering dailyBenefit:', { salaryText, salary, filteredOptions }); // Debug log
      
      // If salary is less than 17000, show ineligibility message
      if (salary > 0 && salary < 17000) {
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 font-medium">
              You are not eligible for this product as your salary is below $17,000.
            </p>
          </div>
        );
      }
      
      // If no salary entered yet, show message
      if (salary === 0) {
        return (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-gray-600">
              Please enter your annual salary to see available options.
            </p>
          </div>
        );
      }
      
      // Show filtered options
      if (filteredOptions.length > 0) {
        return (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Based on your salary of ${salary.toLocaleString()}, you are eligible for:
            </p>
            <RadioGroup 
              value={answers[question.id] || ''} 
              onValueChange={(value) => handleAnswerChange(question.id, value)}
            >
              {filteredOptions.map((option: string) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}_${option}`} />
                  <Label htmlFor={`${question.id}_${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      }
    }

    // Default rendering for other questions
    if (question.type === "text") {
      return (
        <Input
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          placeholder={question.placeholder}
          required={question.required}
          type="text"
        />
      );
    }

    if (question.type === "single_choice") {
      return (
        <RadioGroup 
          value={answers[question.id] || ''} 
          onValueChange={(value) => handleAnswerChange(question.id, value)}
        >
          {question.options.map((option: string) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${question.id}_${option}`} />
              <Label htmlFor={`${question.id}_${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (question.type === "multi_choice") {
      return (
        <div className="space-y-2">
          {question.options.map((option: string) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${question.id}_${option}`}
                checked={(answers[question.id] || []).includes(option)}
                onCheckedChange={(checked) => {
                  const currentAnswers = answers[question.id] || [];
                  if (checked) {
                    handleAnswerChange(question.id, [...currentAnswers, option]);
                  } else {
                    handleAnswerChange(question.id, currentAnswers.filter((a: string) => a !== option));
                  }
                }}
              />
              <Label htmlFor={`${question.id}_${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="space-y-4">
          <Label className="text-lg font-medium">
            {question.question}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {renderQuestion(question)}
        </div>
      ))}

      <div className="flex justify-center mx-auto gap-4">
   <Button variant="outline" className="w-1/2 px-[40px] py-7" onClick={resetForm}>
        <ArrowLeft className="mr-2 h-4 w-4 " /> Reset Form
      </Button>

 <Button 
        type="submit" 
        className="w-1/2 px-[40px] py-7 "
        
        disabled={!isFormValid()}
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
</div>
    </form>
  );
}