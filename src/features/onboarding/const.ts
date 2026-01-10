import { TOnboardingFormData } from "./types";

export const defaultOnboardingFormValues: TOnboardingFormData = {
  name: "",
  birthYear: "2000",
  birthMonth: "01",
  birthDay: "31",
  birthHour: "12",
  birthMinute: "30",
  birthPeriod: "PM",
  birthTimeKnown: false,
  genderAtBirth: "Male",
  country: "",
  city: "",
};

// Generate years from 1900 to current year
export const years = Array.from(
  { length: new Date().getFullYear() - 1899 },
  (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  }
);

// Months
export const months = Array.from({ length: 12 }, (_, i) => {
  const month = (i + 1).toString().padStart(2, "0");
  return { value: month, label: month };
});

// Days (1-31)
export const days = Array.from({ length: 31 }, (_, i) => {
  const day = (i + 1).toString().padStart(2, "0");
  return { value: day, label: day };
});

// Hours (1-12)
export const hours = Array.from({ length: 12 }, (_, i) => {
  const hour = (i + 1).toString().padStart(2, "0");
  return { value: hour, label: hour };
});

// Minutes (0-59, step 1)
export const minutes = Array.from({ length: 60 }, (_, i) => {
  const minute = i.toString().padStart(2, "0");
  return { value: minute, label: minute };
});

export const periods = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

export const genders = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];










