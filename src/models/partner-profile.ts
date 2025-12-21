export interface IPartnerProfileModel {
  id: string;
  name: string;
  nickname?: string;
  age: number;
  location: string;
  avatarUrl?: string;
  stage: string;
  isPremium?: boolean;
}
