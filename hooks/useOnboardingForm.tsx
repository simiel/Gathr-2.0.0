import { useState } from "react";
import { z } from "zod";

// Constants for form options
export const GHANA_UNIVERSITIES = [
  "University of Ghana",
  "Kwame Nkrumah University of Science and Technology",
  "University of Cape Coast",
  "University of Education, Winneba",
  "Ashesi University",
  // Add more universities...
] as const;

export const FAITH_OPTIONS = {
  Christian: {
    label: "Christian",
    denominations: [
      "Catholic",
      "Methodist",
      "Presbyterian",
      "Pentecostal",
      "Charismatic",
      "Anglican",
      "Seventh Day Adventist",
      "Other",
    ],
  },
  Muslim: {
    label: "Muslim",
    denominations: ["Sunni", "Shia", "Ahmadiyya", "Other"],
  },
  Traditional: {
    label: "Traditional",
    denominations: ["African Traditional Religion"],
  },
  Buddhist: {
    label: "Buddhist",
    denominations: ["Theravada", "Mahayana", "Vajrayana"],
  },
  Other: {
    label: "Other",
    denominations: ["None"],
  },
} as const;

export const INDUSTRY_OPTIONS = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Entertainment",
  "Media",
  "Agriculture",
  "Manufacturing",
  "Mining",
  "Construction",
  "Retail",
  "Transportation",
  "Tourism",
  "Real Estate",
  "Energy",
  "Telecommunications",
] as const;

export const onboardingSchema = z.object({
  education: z.object({
    secondarySchool: z.string().min(1, "Secondary school is required"),
    university: z.string().optional(),
  }),
  faith: z.object({
    religion: z.enum([
      "Christian",
      "Muslim",
      "Traditional",
      "Buddhist",
      "Other",
    ] as const),
    denomination: z.string().optional().nullable(),
  }),
  industry: z
    .array(z.enum(INDUSTRY_OPTIONS))
    .min(3, "Please select at least 3 industries")
    .max(5, "You can select up to 5 industries"),
  locations: z
    .array(z.string())
    .min(1, "At least one location is required")
    .max(5, "You can add up to 5 locations"),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface StepConfig {
  id: string;
  title: string;
  description: string;
  animation: string;
}

export const useOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps: StepConfig[] = [
    {
      id: "intro",
      title: "Welcome to Gathr",
      description:
        "Let's get to know you better! This will help us create a more personalized experience for you.",
      animation: require("@/assets/animation/welcome.json"),
    },
    {
      id: "education",
      title: "Your Education Journey",
      description:
        "Tell us about your educational background to help connect you with like-minded individuals.",
      animation: require("@/assets/animation/education.json"),
    },
    {
      id: "faith",
      title: "Faith & Beliefs",
      description:
        "Share your faith to connect with people who share your values and beliefs.",
      animation: require("@/assets/animation/faith.json"),
    },
    {
      id: "industry",
      title: "Professional Interests",
      description:
        "Select at least 3 industries you're interested in or working in.",
      animation: require("@/assets/animation/industry.json"),
    },
    {
      id: "location",
      title: "Your Locations",
      description: "Add locations where you live or frequently visit.",
      animation: require("@/assets/animation/location.json"),
    },
  ];

  const validateStep = (stepId: string, data: any) => {
    try {
      const stepSchema =
        onboardingSchema.shape[stepId as keyof OnboardingFormData];
      if (stepSchema) {
        stepSchema.parse(data);
        setErrors({});
        return true;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          newErrors[err.path.join(".")] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateFormData = (stepId: keyof OnboardingFormData, data: any) => {
    if (validateStep(stepId, data)) {
      setFormData((prev) => ({
        ...prev,
        [stepId]: data,
      }));
      return true;
    }
    return false;
  };

  const skipOnboarding = () => {
    // Handle skipping logic here
    return true;
  };

  return {
    currentStep,
    steps,
    formData,
    errors,
    nextStep,
    prevStep,
    updateFormData,
    skipOnboarding,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
  };
};
