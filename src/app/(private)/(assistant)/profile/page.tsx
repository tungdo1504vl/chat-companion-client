import { Suspense } from "react";
import ProfilePageClient from "./profile-page-client";
import { ProfileFormSkeleton } from "@/features/profile/user/components";

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileFormSkeleton />}>
      <ProfilePageClient />
    </Suspense>
  );
}
