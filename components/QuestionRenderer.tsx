"use client";  
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight } from 'lucide-react';

interface QuestionRendererProps {
  questions: any[];
  initialAnswers: Record<string, any>;
  onSubmit: (answers: Record<string, any>) => void;
}

export default function QuestionRenderer({ questions, initialAnswers, onSubmit }: QuestionRendererProps) {
  const [answers, setAnswers] = useState(initialAnswers);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="space-y-4">
          <Label className="text-lg font-medium">
            {question.question}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </Label>

          {question.type === "text" && (
            <Input
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              required={question.required}
            />
          )}

          {question.type === "single_choice" && (
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
          )}

          {question.type === "multi_choice" && (
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
          )}
        </div>
      ))}

      <Button 
        type="submit" 
        className="w-full"
        disabled={!isFormValid()}
      >
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}

// "use client";  
// import React, { useState , useEffect} from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Checkbox } from '@/components/ui/checkbox';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { ArrowRight , Plus, Trash2 } from 'lucide-react';

// interface FamilyMember {
//   id?: string;
//   formResponseId?: string;
//   firstName: string;
//   lastName: string;
//   dateOfBirth: string;
//   gender: string;
//   height: string;
//   weight: string;
//   relationship: string;
// }

// interface QuestionRendererProps {
//   questions: any[];
//   initialAnswers: Record<string, any>;
//   onSubmit: (answers: Record<string, any>) => void;
// }

// export default function QuestionRenderer({ questions, initialAnswers, onSubmit }: QuestionRendererProps) {
//   const [answers, setAnswers] = useState(initialAnswers);
//  const [members, setMembers] = useState<Record<string, FamilyMember[]>>({});


//     useEffect(() => {
//     const initialMembers: Record<string, FamilyMember[]> = {};
//     questions.forEach(question => {
//       if (isCoverageQuestion(question)) {
//         const membersKey = `${question.id}_family_members`;
//         if (initialAnswers[membersKey]) {
//           initialMembers[question.id] = initialAnswers[membersKey];
//         }
//       }
//     });
//     setMembers(initialMembers);
//   }, [questions, initialAnswers]);

//   //debugging useffect

// //   useEffect(() => {
// //   console.log('QuestionRenderer - initialAnswers:', initialAnswers);
// //   console.log('QuestionRenderer - questions:', questions);
  
// //   const initialMembers: Record<string, FamilyMember[]> = {};
// //   questions.forEach(question => {
// //     if (isCoverageQuestion(question)) {
// //       const membersKey = `${question.id}_family_members`;
// //       console.log(`Looking for key: ${membersKey}`, initialAnswers[membersKey]);
// //       if (initialAnswers[membersKey]) {
// //         initialMembers[question.id] = initialAnswers[membersKey];
// //         console.log(`Found members for ${question.id}:`, initialAnswers[membersKey]);
// //       }
// //     }
// //   });
// //   setMembers(initialMembers);
// //   console.log('Final members state:', initialMembers);
// // }, [questions, initialAnswers]);

//   //check if question is family memeber question
//    const isCoverageQuestion = (question: any) => {
//   return question.isCoverageQuestion === "yes";
// };

//  const getMemberCount = (coverageAnswer: string) => {
//     if (coverageAnswer === "Just me") return 0;
//     if (coverageAnswer === "Me + 1") return 1;
//     if (coverageAnswer === "My Family") return -1; // -1 means dynamic
//     return 0;
//   };

//   const handleAnswerChange = (questionId: string, value: any) => {
//     setAnswers(prev => ({ ...prev, [questionId]: value }));

//      // Handle coverage question changes
//     const question = questions.find(q => q.id === questionId);
//     if (question && isCoverageQuestion(question)) {
//       const memberCount = getMemberCount(value);
      
//       if (memberCount === 0) {
//         // Just me - clear members
//         setMembers(prev => ({ ...prev, [questionId]: [] }));
//       } else if (memberCount === 1) {
//         // Me + 1 - ensure exactly 1 member
//         setMembers(prev => {
//     const currentMembers = prev[questionId] || [];
//     if (currentMembers.length === 0) {
//       return { ...prev, [questionId]: [createEmptyMember()] };
//     } else {
//       return { ...prev, [questionId]: currentMembers.slice(0, 1) };
//     }
//   });
//       } else if (memberCount === -1) {
//         // My Family - start with 1 member, allow adding more
//         setMembers(prev => ({
//           ...prev,
//           [questionId]: prev[questionId]?.length > 0 ? prev[questionId] : [createEmptyMember()]
//         }));
//       }
//     }

//   };

//   const createEmptyMember = (): FamilyMember => ({
//     id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//     firstName: '',
//     lastName: '',
//     dateOfBirth: '',
//     gender: '',
//     height: '',
//     weight: '',
//     relationship: ''
//   });

//     const handleMemberChange = (questionId: string, memberIndex: number, field: keyof FamilyMember, value: string) => {
//     setMembers(prev => ({
//       ...prev,
//       [questionId]: prev[questionId]?.map((member, index) =>
//         index === memberIndex ? { ...member, [field]: value } : member
//       ) || []
//     }));
//   };

//   const addMember = (questionId: string) => {
//     setMembers(prev => ({
//       ...prev,
//       [questionId]: [...(prev[questionId] || []), createEmptyMember()]
//     }));
//   };

//   const removeMember = (questionId: string, memberIndex: number) => {
//     setMembers(prev => ({
//       ...prev,
//       [questionId]: prev[questionId]?.filter((_, index) => index !== memberIndex) || []
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//         // Include member data in the submission
//     const finalAnswers = { ...answers };
//     Object.keys(members).forEach(questionId => {
//       if (members[questionId] && members[questionId].length > 0) {
//         finalAnswers[`${questionId}_family_members`] = members[questionId];
//       }
//     });

//     onSubmit(finalAnswers);
//   };


//     const validateMembers = (questionMembers: FamilyMember[]) => {
//     return questionMembers.every(member => 
//       member.firstName.trim() && 
//       member.lastName.trim() && 
//       member.dateOfBirth && 
//       member.gender && 
//       member.height.trim() && 
//       member.weight.trim() &&
//       member.relationship.trim()
//     );
//   };

//     const isFormValid = () => {
//     // Check required questions
//     const requiredQuestions = questions.filter(q => q.required);
//     const hasAllRequiredAnswers = requiredQuestions.every(q => {
//       const answer = answers[q.id];
//       return answer !== undefined && answer !== '' && (Array.isArray(answer) ? answer.length > 0 : true);
//     });

//     // Check member data for coverage questions
//     const coverageQuestions = questions.filter(q => isCoverageQuestion(q) && q.required);
//     const hasValidMembers = coverageQuestions.every(q => {
//       const coverageAnswer = answers[q.id];
//       const memberCount = getMemberCount(coverageAnswer);
      
//       if (memberCount === 0) return true; // Just me
      
//       const questionMembers = members[q.id] || [];
//       if (memberCount === 1) {
//         return questionMembers.length === 1 && validateMembers(questionMembers);
//       } else if (memberCount === -1) {
//         return questionMembers.length > 0 && validateMembers(questionMembers);
//       }
      
//       return true;
//     });

//     return hasAllRequiredAnswers && hasValidMembers;
//   };



//     const renderMemberForm = (member: FamilyMember, memberIndex: number, questionId: string, isFamily: boolean) => (
//     <div key={member.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
//       <div className="flex justify-between items-center">
//         <h4 className="font-medium">
//           {isFamily ? `Family Member ${memberIndex + 1}` : 'Additional Member'}
//         </h4>
//         {isFamily && (
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={() => removeMember(questionId, memberIndex)}
//             className="text-red-600 hover:text-red-700"
//           >
//             <Trash2 className="h-4 w-4" />
//           </Button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <Label htmlFor={`${member.id}_firstName`}>First Name *</Label>
//           <Input
//             id={`${member.id}_firstName`}
//             value={member.firstName}
//             onChange={(e) => handleMemberChange(questionId, memberIndex, 'firstName', e.target.value)}
//             placeholder="Enter first name"
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor={`${member.id}_lastName`}>Last Name *</Label>
//           <Input
//             id={`${member.id}_lastName`}
//             value={member.lastName}
//             onChange={(e) => handleMemberChange(questionId, memberIndex, 'lastName', e.target.value)}
//             placeholder="Enter last name"
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor={`${member.id}_relationship`}>Relationship *</Label>
//           <Select
//             value={member.relationship}
//             onValueChange={(value) => handleMemberChange(questionId, memberIndex, 'relationship', value)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select relationship" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="spouse">Spouse</SelectItem>
//               <SelectItem value="child">Child</SelectItem>
//               <SelectItem value="parent">Parent</SelectItem>
//               <SelectItem value="sibling">Sibling</SelectItem>
//               <SelectItem value="other">Other</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div>
//           <Label htmlFor={`${member.id}_dateOfBirth`}>Date of Birth *</Label>
//           <Input
//             id={`${member.id}_dateOfBirth`}
//             type="date"
//             value={member.dateOfBirth}
//             onChange={(e) => handleMemberChange(questionId, memberIndex, 'dateOfBirth', e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor={`${member.id}_gender`}>Gender *</Label>
//           <Select
//             value={member.gender}
//             onValueChange={(value) => handleMemberChange(questionId, memberIndex, 'gender', value)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select gender" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="male">Male</SelectItem>
//               <SelectItem value="female">Female</SelectItem>
//               <SelectItem value="other">Other</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <div>
//           <Label htmlFor={`${member.id}_height`}>Height *</Label>
//           <Input
//             id={`${member.id}_height`}
//             value={member.height}
//             onChange={(e) => handleMemberChange(questionId, memberIndex, 'height', e.target.value)}
//             placeholder="e.g., 5'8 or 173 cm"
//             required
//           />
//         </div>

//         <div>
//           <Label htmlFor={`${member.id}_weight`}>Weight *</Label>
//           <Input
//             id={`${member.id}_weight`}
//             value={member.weight}
//             onChange={(e) => handleMemberChange(questionId, memberIndex, 'weight', e.target.value)}
//             placeholder="e.g., 150 lbs or 68 kg"
//             required
//           />
//         </div>
//       </div>
//     </div>
//   );



//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {questions.map((question) => (
//         <div key={question.id} className="space-y-4">
//           <Label className="text-lg font-medium">
//             {question.question}
//             {question.required && <span className="text-red-500 ml-1">*</span>}
//           </Label>

//           {question.type === "text" && (
//             <Input
//               value={answers[question.id] || ''}
//               onChange={(e) => handleAnswerChange(question.id, e.target.value)}
//               placeholder={question.placeholder}
//               required={question.required}
//             />
//           )}

//           {question.type === "single_choice" && (
//             <RadioGroup 
//               value={answers[question.id] || ''} 
//               onValueChange={(value) => handleAnswerChange(question.id, value)}
//             >
//               {question.options.map((option: string) => (
//                 <div key={option} className="flex items-center space-x-2">
//                   <RadioGroupItem value={option} id={`${question.id}_${option}`} />
//                   <Label htmlFor={`${question.id}_${option}`}>{option}</Label>
//                 </div>
//               ))}
//             </RadioGroup>
//           )}

//           {question.type === "multi_choice" && (
//             <div className="space-y-2">
//               {question.options.map((option: string) => (
//                 <div key={option} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`${question.id}_${option}`}
//                     checked={(answers[question.id] || []).includes(option)}
//                     onCheckedChange={(checked) => {
//                       const currentAnswers = answers[question.id] || [];
//                       if (checked) {
//                         handleAnswerChange(question.id, [...currentAnswers, option]);
//                       } else {
//                         handleAnswerChange(question.id, currentAnswers.filter((a: string) => a !== option));
//                       }
//                     }}
//                   />
//                   <Label htmlFor={`${question.id}_${option}`}>{option}</Label>
//                 </div>
//               ))}
//             </div>
//           )}

//               {/* Member forms for coverage questions */}
//           {isCoverageQuestion(question) && answers[question.id] && getMemberCount(answers[question.id]) !== 0 && (
//             <div className="space-y-4 mt-6">
//               {/* {console.log('Debug - Question:', question.id, 'Coverage answer:', answers[question.id], 'Member count:', getMemberCount(answers[question.id]), 'Members array:', members[question.id])} */}
//               <h3 className="text-lg font-medium">Member Information</h3>
              
//               {(members[question.id] || []).map((member, index) =>
//                 renderMemberForm(
//                   member, 
//                   index, 
//                   question.id, 
//                   answers[question.id] === "My Family"
//                 )
//               )}

//               {answers[question.id] === "My Family" && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => addMember(question.id)}
//                   className="w-full"
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Another Family Member
//                 </Button>
//               )}
//             </div>
//           )}

          
//         </div>
//       ))}

//       <Button type="submit" className="w-full">
//         Continue <ArrowRight className="ml-2 h-4 w-4" />
//       </Button>
//     </form>
//   );
// }


