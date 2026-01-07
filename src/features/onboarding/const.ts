import { TOnboardingFormData } from "./types";
import type { ComboboxOption } from "@/components/ui/combobox";

export const defaultOnboardingFormValues: TOnboardingFormData = {
  name: "",
  birthYear: "2000",
  birthMonth: "01",
  birthDay: "31",
  birthHour: "12",
  birthMinute: "30",
  birthPeriod: "PM",
  birthTimeKnown: false,
  genderAtBirth: "male",
  country: "VN",
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
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

// Vietnamese Cities List
export const VIETNAM_CITIES: ComboboxOption[] = [
  { id: "hanoi", value: "Hanoi", label: "Hanoi" },
  { id: "ho-chi-minh", value: "Ho Chi Minh City", label: "Ho Chi Minh City" },
  { id: "da-nang", value: "Da Nang", label: "Da Nang" },
  { id: "hai-phong", value: "Hai Phong", label: "Hai Phong" },
  { id: "can-tho", value: "Can Tho", label: "Can Tho" },
  { id: "hue", value: "Hue", label: "Hue" },
  { id: "nha-trang", value: "Nha Trang", label: "Nha Trang" },
  { id: "vung-tau", value: "Vung Tau", label: "Vung Tau" },
  { id: "da-lat", value: "Da Lat", label: "Da Lat" },
  { id: "quy-nhon", value: "Quy Nhon", label: "Quy Nhon" },
  { id: "nam-dinh", value: "Nam Dinh", label: "Nam Dinh" },
  { id: "hai-duong", value: "Hai Duong", label: "Hai Duong" },
  { id: "vinh", value: "Vinh", label: "Vinh" },
  { id: "buon-ma-thuot", value: "Buon Ma Thuot", label: "Buon Ma Thuot" },
  { id: "thanh-hoa", value: "Thanh Hoa", label: "Thanh Hoa" },
  { id: "ca-mau", value: "Ca Mau", label: "Ca Mau" },
  { id: "long-xuyen", value: "Long Xuyen", label: "Long Xuyen" },
  { id: "rach-gia", value: "Rach Gia", label: "Rach Gia" },
  { id: "my-tho", value: "My Tho", label: "My Tho" },
  { id: "bac-lieu", value: "Bac Lieu", label: "Bac Lieu" },
  { id: "cam-ranh", value: "Cam Ranh", label: "Cam Ranh" },
  { id: "phan-thiet", value: "Phan Thiet", label: "Phan Thiet" },
  { id: "pleiku", value: "Pleiku", label: "Pleiku" },
  { id: "kon-tum", value: "Kon Tum", label: "Kon Tum" },
  { id: "tam-ky", value: "Tam Ky", label: "Tam Ky" },
  { id: "quang-ngai", value: "Quang Ngai", label: "Quang Ngai" },
  { id: "tuy-hoa", value: "Tuy Hoa", label: "Tuy Hoa" },
  { id: "soc-trang", value: "Soc Trang", label: "Soc Trang" },
  { id: "tra-vinh", value: "Tra Vinh", label: "Tra Vinh" },
  { id: "ben-tre", value: "Ben Tre", label: "Ben Tre" },
  { id: "tay-ninh", value: "Tay Ninh", label: "Tay Ninh" },
  { id: "binh-duong", value: "Binh Duong", label: "Binh Duong" },
  { id: "dong-nai", value: "Dong Nai", label: "Dong Nai" },
  {
    id: "ba-ria-vung-tau",
    value: "Ba Ria - Vung Tau",
    label: "Ba Ria - Vung Tau",
  },
  { id: "binh-thuan", value: "Binh Thuan", label: "Binh Thuan" },
  { id: "khanh-hoa", value: "Khanh Hoa", label: "Khanh Hoa" },
  { id: "phu-yen", value: "Phu Yen", label: "Phu Yen" },
  { id: "binh-dinh", value: "Binh Dinh", label: "Binh Dinh" },
  { id: "quang-nam", value: "Quang Nam", label: "Quang Nam" },
  { id: "quang-tri", value: "Quang Tri", label: "Quang Tri" },
  { id: "thua-thien-hue", value: "Thua Thien Hue", label: "Thua Thien Hue" },
  { id: "quang-binh", value: "Quang Binh", label: "Quang Binh" },
  { id: "ha-tinh", value: "Ha Tinh", label: "Ha Tinh" },
  { id: "nghe-an", value: "Nghe An", label: "Nghe An" },
  {
    id: "thanh-hoa-province",
    value: "Thanh Hoa Province",
    label: "Thanh Hoa Province",
  },
  { id: "ninh-binh", value: "Ninh Binh", label: "Ninh Binh" },
  { id: "ha-nam", value: "Ha Nam", label: "Ha Nam" },
  { id: "hung-yen", value: "Hung Yen", label: "Hung Yen" },
  { id: "thai-binh", value: "Thai Binh", label: "Thai Binh" },
  {
    id: "haiphong-province",
    value: "Hai Phong Province",
    label: "Hai Phong Province",
  },
  { id: "quang-ninh", value: "Quang Ninh", label: "Quang Ninh" },
  { id: "bac-giang", value: "Bac Giang", label: "Bac Giang" },
  { id: "bac-ninh", value: "Bac Ninh", label: "Bac Ninh" },
  { id: "lang-son", value: "Lang Son", label: "Lang Son" },
  { id: "cao-bang", value: "Cao Bang", label: "Cao Bang" },
  { id: "lao-cai", value: "Lao Cai", label: "Lao Cai" },
  { id: "yen-bai", value: "Yen Bai", label: "Yen Bai" },
  { id: "tuyen-quang", value: "Tuyen Quang", label: "Tuyen Quang" },
  { id: "ha-giang", value: "Ha Giang", label: "Ha Giang" },
  { id: "dien-bien", value: "Dien Bien", label: "Dien Bien" },
  { id: "son-la", value: "Son La", label: "Son La" },
  { id: "hoa-binh", value: "Hoa Binh", label: "Hoa Binh" },
  { id: "phu-tho", value: "Phu Tho", label: "Phu Tho" },
  { id: "vinh-phuc", value: "Vinh Phuc", label: "Vinh Phuc" },
  { id: "thai-nguyen", value: "Thai Nguyen", label: "Thai Nguyen" },
  { id: "bac-kan", value: "Bac Kan", label: "Bac Kan" },
  { id: "tay-bac", value: "Tay Bac", label: "Tay Bac" },
  {
    id: "dong-bang-song-cuu-long",
    value: "Dong Bang Song Cuu Long",
    label: "Dong Bang Song Cuu Long",
  },
  { id: "an-giang", value: "An Giang", label: "An Giang" },
  { id: "dong-thap", value: "Dong Thap", label: "Dong Thap" },
  { id: "kien-giang", value: "Kien Giang", label: "Kien Giang" },
  {
    id: "can-tho-province",
    value: "Can Tho Province",
    label: "Can Tho Province",
  },
  { id: "hau-giang", value: "Hau Giang", label: "Hau Giang" },
  { id: "vinh-long", value: "Vinh Long", label: "Vinh Long" },
  { id: "tien-giang", value: "Tien Giang", label: "Tien Giang" },
  { id: "binh-phuoc", value: "Binh Phuoc", label: "Binh Phuoc" },
  {
    id: "binh-duong-province",
    value: "Binh Duong Province",
    label: "Binh Duong Province",
  },
  {
    id: "dong-nai-province",
    value: "Dong Nai Province",
    label: "Dong Nai Province",
  },
  {
    id: "ba-ria-vung-tau-province",
    value: "Ba Ria - Vung Tau Province",
    label: "Ba Ria - Vung Tau Province",
  },
  { id: "lam-dong", value: "Lam Dong", label: "Lam Dong" },
  { id: "dak-lak", value: "Dak Lak", label: "Dak Lak" },
  { id: "dak-nong", value: "Dak Nong", label: "Dak Nong" },
  { id: "gia-lai", value: "Gia Lai", label: "Gia Lai" },
  {
    id: "kon-tum-province",
    value: "Kon Tum Province",
    label: "Kon Tum Province",
  },
].sort((a, b) => a.label.localeCompare(b.label));
