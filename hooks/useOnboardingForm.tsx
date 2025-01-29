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

export const GHANA_SECONDARY_SCHOOLS = [
  "Presbyterian Boy's High School",
  "Christ the King",
  "New Life",
  "St. Anthony's",
  "St. Francis",
  "St. Mary's",
  "St. Paul's",
  "St. Peter's",
  "St. Thomas's",
  "St. Vincent's",
  "St. Xavier's",
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
    .refine((val) => val.length >= 3, {
      message: "Please select at least 3 industries",
      path: ["industry"], // Explicitly set the path for error
    })
    .refine((val) => val.length <= 5, {
      message: "You can select up to 5 industries",
      path: ["industry"], // Explicitly set the path for error
    }),
  locations: z.array(z.string()).min(0).max(5, "You can add up to 5 locations"),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface StepConfig {
  id: string;
  title: string;
  description: string;
  animation: string;
  bg?: string;
}

export const useOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps: StepConfig[] = [
    {
      id: "intro",
      title: "Personalize your experience",
      description:
        "In order to get the best experience on Gathr. We would like to know a little bit more about you.",
      animation: require("@/assets/animation/welcome.json"),
      bg: "#FFEABE",
    },
    {
      id: "education",
      title: "Your Education",
      description:
        "Tell us a little about the schools you completed. We can help you find some mates here.",
      animation: require("@/assets/animation/education.json"),
      bg: "#FFEABE",
    },
    {
      id: "faith",
      title: "Faith",
      description:
        "Tell us a little about your faith. We can help you find family and friends of the same faith here",
      animation: require("@/assets/animation/faith.json"),
      bg: "#EEE6FF",
    },
    {
      id: "industry",
      title: "Professional Interests",
      description:
        "We can help you find gatherings that are of the same industry as you.",
      animation: require("@/assets/animation/sports.json"),
      bg: "#FDE3EB",
    },
    {
      id: "location",
      title: "Your Locations",
      description:
        "With gathr you can get to talk with the friend or family in your neighborhood about important matters ",
      animation: require("@/assets/animation/location.json"),
      bg: "#DEF8FF",
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

  const updateFormData = (
    stepId: keyof OnboardingFormData,
    data: any
  ): boolean => {
    try {
      if (validateStep(stepId, data)) {
        setFormData((prev) => ({
          ...prev,
          [stepId]: data,
        }));
        console.log(errors);
        return true;
      }
      console.log(errors);
      return false;
    } catch (error) {
      console.log(errors);
      console.error("Error updating form data:", error);
      return false;
    }
  };

  const skipOnboarding = () => {
    // Handle skipping logic here
    return true;
  };

  const submitForm = async () => {
    // Handle form submission logic here
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
    submitForm,
  };
};
