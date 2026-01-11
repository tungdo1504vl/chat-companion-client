import { IPartnerProfileModel } from "@/models/partner-profile";
import type { StageType } from "@/features/profile/partner/types";

export type TProfileHeaderProps = Readonly<{
  profile: IPartnerProfileModel;
}>;

export type TProfileInfoProps = Readonly<{
  name: string;
  avatarUrl?: string;
  initials?: string;
  isLoading?: boolean;
  onAvatarEditClick?: () => void;
  age?: number;
  location?: string;
  stage?: StageType;
  isPremium?: boolean;
}>;
