import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

// Types
type PreferenceFormData = {
  location: string;
  birthDate: Date;
  gender: string;
  languages: string[];
  interests: string[];
  bio: string;
};

// Validation Schema
const preferenceSchema = z.object({
  location: z.string().min(1, "Location is required"),
  birthDate: z.date().max(new Date(), "Birth date cannot be in the future"),
  gender: z.string().min(1, "Gender is required"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio cannot exceed 500 characters"),
});

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Non-binary", value: "non-binary" },
  { label: "Prefer not to say", value: "prefer-not-to-say" },
];

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Mandarin", value: "zh" },
  { label: "Arabic", value: "ar" },
  { label: "Hindi", value: "hi" },
];

const interestOptions = [
  { label: "Technology", value: "technology" },
  { label: "Arts & Culture", value: "arts" },
  { label: "Sports", value: "sports" },
  { label: "Music", value: "music" },
  { label: "Travel", value: "travel" },
  { label: "Food & Cooking", value: "food" },
  { label: "Reading", value: "reading" },
  { label: "Photography", value: "photography" },
  { label: "Gaming", value: "gaming" },
  { label: "Fitness", value: "fitness" },
];

const Intro = ({ onNext }: { onNext: () => void }) => {
  const [genderOpen, setGenderOpen] = React.useState(false);
  const [languagesOpen, setLanguagesOpen] = React.useState(false);
  const [interestsOpen, setInterestsOpen] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PreferenceFormData>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      location: "",
      birthDate: new Date(2000, 0, 1),
      gender: "",
      languages: [],
      interests: [],
      bio: "",
    },
  });

  const onSubmit = (data: PreferenceFormData) => {
    console.log(data);
    onNext();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          Help us personalize your experience and connect you with like-minded
          individuals
        </Text>

        <View style={styles.form}>
          {/* Location Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <GooglePlacesAutocomplete
                  placeholder="Search for your location"
                  onPress={(data, details = null) => {
                    onChange(data.description);
                  }}
                  query={{
                    key: "YOUR_GOOGLE_PLACES_API_KEY",
                    language: "en",
                  }}
                  styles={{
                    container: styles.placesContainer,
                    textInput: styles.placesInput,
                  }}
                />
              )}
            />
            {errors.location && (
              <Text style={styles.errorText}>{errors.location.message}</Text>
            )}
          </View>

          {/* Birth Date Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Birth Date</Text>
            <Controller
              control={control}
              name="birthDate"
              render={({ field: { onChange, value } }) => (
                <DateTimePicker
                  value={value}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    onChange(selectedDate);
                  }}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}
            />
            {errors.birthDate && (
              <Text style={styles.errorText}>{errors.birthDate.message}</Text>
            )}
          </View>

          {/* Gender Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <DropDownPicker
                  open={genderOpen}
                  value={value}
                  items={genderOptions}
                  setOpen={setGenderOpen}
                  setValue={(callback) => {
                    const newValue = callback(value);
                    onChange(newValue);
                  }}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              )}
            />
            {errors.gender && (
              <Text style={styles.errorText}>{errors.gender.message}</Text>
            )}
          </View>

          {/* Languages Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Languages</Text>
            <Controller
              control={control}
              name="languages"
              render={({ field: { onChange, value } }) => (
                <DropDownPicker
                  open={languagesOpen}
                  value={value}
                  items={languageOptions}
                  setOpen={setLanguagesOpen}
                  setValue={(callback) => {
                    const newValue = callback(value);
                    onChange(newValue);
                  }}
                  multiple={true}
                  min={1}
                  max={5}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              )}
            />
            {errors.languages && (
              <Text style={styles.errorText}>{errors.languages.message}</Text>
            )}
          </View>

          {/* Interests Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Interests</Text>
            <Controller
              control={control}
              name="interests"
              render={({ field: { onChange, value } }) => (
                <DropDownPicker
                  open={interestsOpen}
                  value={value}
                  items={interestOptions}
                  setOpen={setInterestsOpen}
                  setValue={(callback) => {
                    const newValue = callback(value);
                    onChange(newValue);
                  }}
                  multiple={true}
                  min={1}
                  max={5}
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              )}
            />
            {errors.interests && (
              <Text style={styles.errorText}>{errors.interests.message}</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Lato-Black",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: "Lato-Bold",
    color: "#333",
  },
  placesContainer: {
    flex: 0,
  },
  placesInput: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Lato-Regular",
  },
  dropdown: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
  },
  dropdownContainer: {
    borderColor: "#E5E5E5",
    borderRadius: 12,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontFamily: "Lato-Regular",
  },
});

export default Intro;
