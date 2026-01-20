import { TInputArgs, TTaskType } from "@/types/common";

export function createTaskParams(
  taskType: TTaskType,
  inputArgs: TInputArgs,
  priority?: string,
  options?: {
    enable?: boolean;
  }
) {
  return {
    task_type: taskType,
    input_args: inputArgs,
    priority: priority || "high",
  };
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Country code to country name mapping (ISO 3166-1 alpha-2)
 * Returns the full country name if code is found, otherwise returns the original value
 */
const COUNTRY_CODE_TO_NAME: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  PT: "Portugal",
  GR: "Greece",
  IE: "Ireland",
  NZ: "New Zealand",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  IN: "India",
  BR: "Brazil",
  MX: "Mexico",
  AR: "Argentina",
  CL: "Chile",
  CO: "Colombia",
  PE: "Peru",
  VN: "Vietnam",
  TH: "Thailand",
  SG: "Singapore",
  MY: "Malaysia",
  ID: "Indonesia",
  PH: "Philippines",
  TW: "Taiwan",
  HK: "Hong Kong",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  IL: "Israel",
  TR: "Turkey",
  ZA: "South Africa",
  EG: "Egypt",
  NG: "Nigeria",
  KE: "Kenya",
  RU: "Russia",
  UA: "Ukraine",
};

/**
 * Converts country code to full country name
 * If the input is already a full name or unknown code, returns it as-is
 */
export const getCountryName = (countryCodeOrName: string | undefined | null): string => {
  if (!countryCodeOrName) {
    return "";
  }

  // If it's already a full name (contains spaces or is longer than 3 chars), return as-is
  if (countryCodeOrName.length > 3 || countryCodeOrName.includes(" ")) {
    return countryCodeOrName;
  }

  // Convert to uppercase for lookup
  const code = countryCodeOrName.toUpperCase();
  return COUNTRY_CODE_TO_NAME[code] || countryCodeOrName;
};
