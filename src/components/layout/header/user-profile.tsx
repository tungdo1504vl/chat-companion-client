"use client";

import { useSession, signOut } from "@/libs/better-auth/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { PUBLIC_ROUTES } from "@/constants";

/**
 * Generate a consistent color based on a string (user's name or email)
 */
function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (str.codePointAt(i) ?? 0) + ((hash << 5) - hash);
  }

  // Generate a color with good contrast (avoiding too dark colors)
  const hue = hash % 360;
  const saturation = 65 + (hash % 20); // 65-85%
  const lightness = 45 + (hash % 15); // 45-60%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get initials from name or email
 */
function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      const first = parts[0]?.at(0) ?? "";
      const last = parts.at(-1)?.at(0) ?? "";
      return (first + last).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  if (email) {
    const username = email.split("@")[0];
    return username.substring(0, 2).toUpperCase();
  }

  return "U";
}

export function UserProfile() {
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;
  const initials = useMemo(
    () => getInitials(user?.name, user?.email),
    [user?.name, user?.email]
  );

  const avatarColor = useMemo(() => {
    const identifier = user?.name || user?.email || "user";
    return getColorFromString(identifier);
  }, [user?.name, user?.email]);

  const handleSignOut = async () => {
    await signOut();
    router.push(PUBLIC_ROUTES.LOGIN);
    router.refresh();
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <Avatar className="size-9 cursor-pointer hover:opacity-80 transition-opacity">
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.name || user.email || "User"}
              />
            )}
            <AvatarFallback
              style={{ backgroundColor: avatarColor, color: "#ffffff" }}
              className="font-semibold"
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            {user.name && (
              <p className="text-sm font-medium leading-none">{user.name}</p>
            )}
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          className="cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
