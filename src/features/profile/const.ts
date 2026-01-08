import { TProfileFormData } from "./types";

export const defaultProfileFormValues: TProfileFormData = {
  primaryLoveLanguage: "",
  communicationStyles: [],
  attachmentStyle: "",
  dealBreakers: [],
  workSchedule: "",
  dateBudget: 10,
  socialEnergy: "",
  hobbies: [],
  instagramUrl: "",
};

export const loveLanguages = [
  { value: "words", label: "Words of Affirmation" },
  { value: "acts", label: "Acts of Service" },
  { value: "gifts", label: "Receiving Gifts" },
  { value: "time", label: "Quality Time" },
  { value: "touch", label: "Physical Touch" },
];

export const attachmentStyles = [
  { value: "secure", label: "Secure" },
  { value: "anxious", label: "Anxious" },
  { value: "avoidant", label: "Avoidant" },
  { value: "disorganized", label: "Disorganized" },
];

export const communicationStyles = [
  { value: "direct", label: "Direct" },
  { value: "storyteller", label: "Storyteller" },
  { value: "listener", label: "Listener" },
  { value: "visual", label: "Visual" },
];

export const workSchedules = [
  { value: "9-5", label: "9-5 Standard" },
  { value: "flexible", label: "Flexible / Remote" },
];

export const socialEnergyLevels = [
  { value: "low", label: "Low" },
  { value: "balanced", label: "Balanced" },
  { value: "high", label: "High" },
];

// Zodiac symbols mapping (all 12 signs)
export const zodiacSymbols: Record<string, string> = {
  Aries: "♈",
  Taurus: "♉",
  Gemini: "♊",
  Cancer: "♋",
  Leo: "♌",
  Virgo: "♍",
  Libra: "♎",
  Scorpio: "♏",
  Sagittarius: "♐",
  Capricorn: "♑",
  Aquarius: "♒",
  Pisces: "♓",
};

// Planet symbols mapping (all 10 planets)
export const planetSymbols: Record<string, string> = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
};

// Zodiac colors mapping (all 12 signs)
export const zodiacColors: Record<string, string> = {
  Aries: "bg-red-500",
  Taurus: "bg-green-500",
  Gemini: "bg-orange-500",
  Cancer: "bg-gray-500",
  Leo: "bg-yellow-500",
  Virgo: "bg-lime-500",
  Libra: "bg-pink-500",
  Scorpio: "bg-teal-500",
  Sagittarius: "bg-blue-500",
  Capricorn: "bg-slate-500",
  Aquarius: "bg-purple-500",
  Pisces: "bg-indigo-500",
};

// Planet display order for consistent rendering
export const planetDisplayOrder: string[] = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
];
