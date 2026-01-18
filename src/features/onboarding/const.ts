import { ComboboxOption } from '@/components/ui/combobox';
import { TOnboardingFormData } from './types';

export const defaultOnboardingFormValues: TOnboardingFormData = {
  name: '',
  gender: '',
  dob: '',
  country: '',
};

export const genders = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
];

// Common countries list
export const countries = [
  { value: 'US', label: 'United States' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'BE', label: 'Belgium' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AT', label: 'Austria' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'FI', label: 'Finland' },
  { value: 'PL', label: 'Poland' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'IE', label: 'Ireland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'GR', label: 'Greece' },
  { value: 'JP', label: 'Japan' },
  { value: 'KR', label: 'South Korea' },
  { value: 'CN', label: 'China' },
  { value: 'IN', label: 'India' },
  { value: 'SG', label: 'Singapore' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'TH', label: 'Thailand' },
  { value: 'PH', label: 'Philippines' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'NZ', label: 'New Zealand' },
].sort((a, b) => a.label.localeCompare(b.label));

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
  const month = (i + 1).toString().padStart(2, '0');
  return { value: month, label: month };
});

// Days (1-31)
export const days = Array.from({ length: 31 }, (_, i) => {
  const day = (i + 1).toString().padStart(2, '0');
  return { value: day, label: day };
});

// Hours (1-12)
export const hours = Array.from({ length: 12 }, (_, i) => {
  const hour = (i + 1).toString().padStart(2, '0');
  return { value: hour, label: hour };
});

// Minutes (0-59, step 1)
export const minutes = Array.from({ length: 60 }, (_, i) => {
  const minute = i.toString().padStart(2, '0');
  return { value: minute, label: minute };
});

export const periods = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
];


// Vietnamese Cities List
export const VIETNAM_CITIES: ComboboxOption[] = [
  // Centrally governed cities
  { id: 'ha-noi', value: 'Hanoi', label: 'Hanoi', type: 'municipality' },
  {
    id: 'ho-chi-minh',
    value: 'Ho Chi Minh City',
    label: 'Ho Chi Minh City',
    type: 'municipality',
  },
  {
    id: 'hai-phong',
    value: 'Hai Phong',
    label: 'Hai Phong',
    type: 'municipality',
  },
  { id: 'da-nang', value: 'Da Nang', label: 'Da Nang', type: 'municipality' },
  { id: 'can-tho', value: 'Can Tho', label: 'Can Tho', type: 'municipality' },

  // Provinces
  { id: 'an-giang', value: 'An Giang', label: 'An Giang', type: 'province' },
  {
    id: 'ba-ria-vung-tau',
    value: 'Ba Ria - Vung Tau',
    label: 'Ba Ria - Vung Tau',
    type: 'province',
  },
  { id: 'bac-giang', value: 'Bac Giang', label: 'Bac Giang', type: 'province' },
  { id: 'bac-kan', value: 'Bac Kan', label: 'Bac Kan', type: 'province' },
  { id: 'bac-lieu', value: 'Bac Lieu', label: 'Bac Lieu', type: 'province' },
  { id: 'bac-ninh', value: 'Bac Ninh', label: 'Bac Ninh', type: 'province' },
  { id: 'ben-tre', value: 'Ben Tre', label: 'Ben Tre', type: 'province' },
  { id: 'binh-dinh', value: 'Binh Dinh', label: 'Binh Dinh', type: 'province' },
  {
    id: 'binh-duong',
    value: 'Binh Duong',
    label: 'Binh Duong',
    type: 'province',
  },
  {
    id: 'binh-phuoc',
    value: 'Binh Phuoc',
    label: 'Binh Phuoc',
    type: 'province',
  },
  {
    id: 'binh-thuan',
    value: 'Binh Thuan',
    label: 'Binh Thuan',
    type: 'province',
  },
  { id: 'ca-mau', value: 'Ca Mau', label: 'Ca Mau', type: 'province' },
  { id: 'cao-bang', value: 'Cao Bang', label: 'Cao Bang', type: 'province' },
  { id: 'dak-lak', value: 'Dak Lak', label: 'Dak Lak', type: 'province' },
  { id: 'dak-nong', value: 'Dak Nong', label: 'Dak Nong', type: 'province' },
  { id: 'dien-bien', value: 'Dien Bien', label: 'Dien Bien', type: 'province' },
  { id: 'dong-nai', value: 'Dong Nai', label: 'Dong Nai', type: 'province' },
  { id: 'dong-thap', value: 'Dong Thap', label: 'Dong Thap', type: 'province' },
  { id: 'gia-lai', value: 'Gia Lai', label: 'Gia Lai', type: 'province' },
  { id: 'ha-giang', value: 'Ha Giang', label: 'Ha Giang', type: 'province' },
  { id: 'ha-nam', value: 'Ha Nam', label: 'Ha Nam', type: 'province' },
  { id: 'ha-tinh', value: 'Ha Tinh', label: 'Ha Tinh', type: 'province' },
  { id: 'hau-giang', value: 'Hau Giang', label: 'Hau Giang', type: 'province' },
  { id: 'hoa-binh', value: 'Hoa Binh', label: 'Hoa Binh', type: 'province' },
  { id: 'hung-yen', value: 'Hung Yen', label: 'Hung Yen', type: 'province' },
  { id: 'khanh-hoa', value: 'Khanh Hoa', label: 'Khanh Hoa', type: 'province' },
  {
    id: 'kien-giang',
    value: 'Kien Giang',
    label: 'Kien Giang',
    type: 'province',
  },
  { id: 'kon-tum', value: 'Kon Tum', label: 'Kon Tum', type: 'province' },
  { id: 'lam-dong', value: 'Lam Dong', label: 'Lam Dong', type: 'province' },
  { id: 'lang-son', value: 'Lang Son', label: 'Lang Son', type: 'province' },
  { id: 'lao-cai', value: 'Lao Cai', label: 'Lao Cai', type: 'province' },
  { id: 'long-an', value: 'Long An', label: 'Long An', type: 'province' },
  { id: 'nam-dinh', value: 'Nam Dinh', label: 'Nam Dinh', type: 'province' },
  { id: 'nghe-an', value: 'Nghe An', label: 'Nghe An', type: 'province' },
  { id: 'ninh-binh', value: 'Ninh Binh', label: 'Ninh Binh', type: 'province' },
  {
    id: 'ninh-thuan',
    value: 'Ninh Thuan',
    label: 'Ninh Thuan',
    type: 'province',
  },
  { id: 'phu-tho', value: 'Phu Tho', label: 'Phu Tho', type: 'province' },
  { id: 'phu-yen', value: 'Phu Yen', label: 'Phu Yen', type: 'province' },
  {
    id: 'quang-binh',
    value: 'Quang Binh',
    label: 'Quang Binh',
    type: 'province',
  },
  { id: 'quang-nam', value: 'Quang Nam', label: 'Quang Nam', type: 'province' },
  {
    id: 'quang-ngai',
    value: 'Quang Ngai',
    label: 'Quang Ngai',
    type: 'province',
  },
  {
    id: 'quang-ninh',
    value: 'Quang Ninh',
    label: 'Quang Ninh',
    type: 'province',
  },
  { id: 'quang-tri', value: 'Quang Tri', label: 'Quang Tri', type: 'province' },
  { id: 'soc-trang', value: 'Soc Trang', label: 'Soc Trang', type: 'province' },
  { id: 'son-la', value: 'Son La', label: 'Son La', type: 'province' },
  { id: 'tay-ninh', value: 'Tay Ninh', label: 'Tay Ninh', type: 'province' },
  { id: 'thai-binh', value: 'Thai Binh', label: 'Thai Binh', type: 'province' },
  {
    id: 'thai-nguyen',
    value: 'Thai Nguyen',
    label: 'Thai Nguyen',
    type: 'province',
  },
  { id: 'thanh-hoa', value: 'Thanh Hoa', label: 'Thanh Hoa', type: 'province' },
  {
    id: 'thua-thien-hue',
    value: 'Thua Thien Hue',
    label: 'Thua Thien Hue',
    type: 'province',
  },
  {
    id: 'tien-giang',
    value: 'Tien Giang',
    label: 'Tien Giang',
    type: 'province',
  },
  { id: 'tra-vinh', value: 'Tra Vinh', label: 'Tra Vinh', type: 'province' },
  {
    id: 'tuyen-quang',
    value: 'Tuyen Quang',
    label: 'Tuyen Quang',
    type: 'province',
  },
  { id: 'vinh-long', value: 'Vinh Long', label: 'Vinh Long', type: 'province' },
  { id: 'vinh-phuc', value: 'Vinh Phuc', label: 'Vinh Phuc', type: 'province' },
  { id: 'yen-bai', value: 'Yen Bai', label: 'Yen Bai', type: 'province' },
].sort((a, b) => a.label.localeCompare(b.label));





