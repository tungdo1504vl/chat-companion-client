import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TProfileHeaderProps } from "./types";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfileHeader(props: TProfileHeaderProps) {
  const { profile } = props;

  const { avatarUrl, name, age, location, stage } = profile;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="size-20">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {profile.isPremium && (
          <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
            <div className="rounded-full bg-yellow-400 p-1">
              <Star className="size-3 fill-yellow-400 text-yellow-600" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl font-semibold">{name}</h2>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{age}</span>
          <span>•</span>
          <span>{location}</span>
        </div>
      </div>

      <Badge variant="default" className="rounded-full px-3 py-1">
        Stage: {stage}
      </Badge>
    </div>
  );
}
