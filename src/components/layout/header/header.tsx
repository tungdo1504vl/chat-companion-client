import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme.toggle";
import { UserProfile } from "./user-profile";

export default function HeaderLayout() {
  return (
    <header className="w-full h-16 bg-background border-b flex items-center justify-between p-4">
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserProfile />
      </div>
    </header>
  );
}
