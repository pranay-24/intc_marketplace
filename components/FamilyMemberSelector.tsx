"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Users } from "lucide-react";
import { FamilyMember } from "@/lib/types";
import { useForm } from "@/contexts/FormContext";

type CoverageType = 'just-me' | 'me+1' | 'family';

interface FamilyMemberSelectorProps {
  coverageType: CoverageType;
  existingMembers: FamilyMember[];
}

// Generate unique ID for new members
const generateMemberId = () => `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Create empty member template
const createEmptyMember = (): FamilyMember => ({
  id: generateMemberId(),
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  height: '',
  weight: '',
  relationship: ''
});

// Add validation function to be exported
export const validateFamilyMembers = (coverageType: CoverageType, members: FamilyMember[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (coverageType === 'family' && members.length < 2) {
    errors.push("Family coverage requires at least 2 additional members");
  }
  
  if (coverageType === 'me+1' && members.length !== 1) {
    errors.push("Individual + 1 coverage requires exactly 1 additional member");
  }
  
  // Check if all required fields are filled
  members.forEach((member, index) => {
    const requiredFields: (keyof FamilyMember)[] = [
      'firstName', 'lastName', 'dateOfBirth', 'gender', 'height', 'weight', 'relationship'
    ];
    
    requiredFields.forEach(field => {
      if (!member[field] || member[field].trim() === '') {
        errors.push(`Member ${index + 1}: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
      }
    });
  });
  
  return { isValid: errors.length === 0, errors };
};

export default function FamilyMemberSelector({ coverageType, existingMembers }: FamilyMemberSelectorProps) {
  const { updateFormData } = useForm();
  const [members, setMembers] = useState<FamilyMember[]>(existingMembers);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize members based on coverage type
  useEffect(() => {
    if (existingMembers.length === 0) {
      if (coverageType === 'me+1') {
        // Add one empty member for me+1
        setMembers([createEmptyMember()]);
      } else if (coverageType === 'family') {
        // Add two empty members for family (minimum)
        setMembers([createEmptyMember(), createEmptyMember()]);
      }
    } else {
      setMembers(existingMembers);
    }
  }, [coverageType, existingMembers]);

  // Update formData whenever members change
  useEffect(() => {
    updateFormData({ familyMembers: members });
  }, [members, updateFormData]);

  // Handle member field changes
  const handleMemberChange = (
    memberIndex: number,
    field: keyof FamilyMember,
    value: string
  ) => {
    const updatedMembers = members.map((member, index) => {
      if (index === memberIndex) {
        return { ...member, [field]: value };
      }
      return member;
    });
    setMembers(updatedMembers);
    
    // Clear error for this field
    const errorKey = `${memberIndex}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // Add new family member (only for family coverage)
  const addMember = () => {
    if (coverageType === 'family') {
      setMembers(prev => [...prev, createEmptyMember()]);
    }
  };

  // Remove family member
  const removeMember = (memberIndex: number) => {
    if (coverageType === 'family' && members.length > 2) {
      setMembers(prev => prev.filter((_, index) => index !== memberIndex));
    }
  };

  // Validate all members
  const validateMembers = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Check minimum member count for family coverage
    if (coverageType === 'family' && members.length < 2) {
      newErrors.general = "Family coverage requires at least 2 additional members";
      isValid = false;
    }

    // Validate each member
    members.forEach((member, index) => {
      const requiredFields: (keyof FamilyMember)[] = [
        'firstName', 'lastName', 'dateOfBirth', 'gender', 'height', 'weight', 'relationship'
      ];

      requiredFields.forEach(field => {
        if (!member[field] || member[field].trim() === '') {
          newErrors[`${index}_${field}`] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
          isValid = false;
        }
      });

      // Validate date of birth format
      if (member.dateOfBirth && !isValidDate(member.dateOfBirth)) {
        newErrors[`${index}_dateOfBirth`] = "Please enter a valid date";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Helper function to validate date
  const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && date < new Date();
  };

  // Get appropriate title based on coverage type
  const getTitle = () => {
    switch (coverageType) {
      case 'me+1':
        return 'Additional Family Member Information';
      case 'family':
        return 'Family Members Information';
      default:
        return '';
    }
  };

  // Get appropriate description
  const getDescription = () => {
    switch (coverageType) {
      case 'me+1':
        return 'Please provide information for the additional person you want to cover.';
      case 'family':
        return 'Please provide information for all family members you want to cover (minimum 2 required).';
      default:
        return '';
    }
  };

  if (coverageType === 'just-me') {
    return null; // Don't render anything for just-me coverage
  }

  return (
    <div className="space-y-6 border-t pt-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">{getTitle()}</h3>
        </div>
        <p className="text-gray-600 text-sm">{getDescription()}</p>
      </div>

      {/* General error message */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Members list */}
      <div className="space-y-4">
        {members.map((member, memberIndex) => (
          <div key={member.id} className="border rounded-lg p-4 space-y-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">
                {coverageType === 'family' 
                  ? `Family Member ${memberIndex + 1}` 
                  : 'Additional Member'
                }
              </h4>
              {coverageType === 'family' && members.length > 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeMember(memberIndex)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`${member.id}_firstName`}>First Name *</Label>
                <Input
                  id={`${member.id}_firstName`}
                  value={member.firstName}
                  onChange={(e) => handleMemberChange(memberIndex, 'firstName', e.target.value)}
                  placeholder="Enter first name"
                  className={errors[`${memberIndex}_firstName`] ? "border-red-500" : ""}
                />
                {errors[`${memberIndex}_firstName`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`${memberIndex}_firstName`]}</p>
                )}
              </div>

              <div>
                <Label htmlFor={`${member.id}_lastName`}>Last Name *</Label>
                <Input
                  id={`${member.id}_lastName`}
                  value={member.lastName}
                  onChange={(e) => handleMemberChange(memberIndex, 'lastName', e.target.value)}
                  placeholder="Enter last name"
                  className={errors[`${memberIndex}_lastName`] ? "border-red-500" : ""}
                />
                {errors[`${memberIndex}_lastName`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`${memberIndex}_lastName`]}</p>
                )}
              </div>

              <div>
                <Label htmlFor={`${member.id}_relationship`}>Relationship *</Label>
                <Select
                  value={member.relationship}
                  onValueChange={(value) => handleMemberChange(memberIndex, 'relationship', value)}
                >
                  <SelectTrigger className={errors[`${memberIndex}_relationship`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors[`${memberIndex}_relationship`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`${memberIndex}_relationship`]}</p>
                )}
              </div>

              <div>
                <Label htmlFor={`${member.id}_dateOfBirth`}>Date of Birth *</Label>
                <Input
                  id={`${member.id}_dateOfBirth`}
                  type="date"
                  value={member.dateOfBirth}
                  onChange={(e) => handleMemberChange(memberIndex, 'dateOfBirth', e.target.value)}
                  className={errors[`${memberIndex}_dateOfBirth`] ? "border-red-500" : ""}
                />
                {errors[`${memberIndex}_dateOfBirth`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`${memberIndex}_dateOfBirth`]}</p>
                )}
              </div>

              <div>
                <Label htmlFor={`${member.id}_gender`}>Gender *</Label>
                <Select
                  value={member.gender}
                  onValueChange={(value) => handleMemberChange(memberIndex, 'gender', value)}
                >
                  <SelectTrigger className={errors[`${memberIndex}_gender`] ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors[`${memberIndex}_gender`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`${memberIndex}_gender`]}</p>
                )}
              </div>

              <div>
                <Label htmlFor={`${member.id}_height`}>Height *</Label>
                <Input
                  id={`${member.id}_height`}
                  value={member.height}
                  onChange={(e) => handleMemberChange(memberIndex, 'height', e.target.value)}
                  placeholder="e.g., 5'8 or 173 cm"
                  className={errors[`${memberIndex}_height`] ? "border-red-500" : ""}
                />
                {errors[`${memberIndex}_height`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`${memberIndex}_height`]}</p>
                )}
              </div>

              <div>
                <Label htmlFor={`${member.id}_weight`}>Weight *</Label>
                <Input
                  id={`${member.id}_weight`}
                  value={member.weight}
                  onChange={(e) => handleMemberChange(memberIndex, 'weight', e.target.value)}
                  placeholder="e.g., 150 lbs or 68 kg"
                  className={errors[`${memberIndex}_weight`] ? "border-red-500" : ""}
                />
                {errors[`${memberIndex}_weight`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`${memberIndex}_weight`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add member button for family coverage */}
      {coverageType === 'family' && (
        <div className="text-center">
          <Button
            type="button"
            variant="outline"
            onClick={addMember}
            className="border-dashed border-2 hover:border-solid"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Family Member
          </Button>
        </div>
      )}

      {/* Member count indicator */}
      <div className="text-center text-sm text-gray-500">
        {coverageType === 'me+1' 
          ? `1 additional member selected`
          : `${members.length} family members selected ${members.length < 2 ? '(minimum 2 required)' : ''}`
        }
      </div>
    </div>
  );
}