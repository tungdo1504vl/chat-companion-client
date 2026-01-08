"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Clock, Users } from "lucide-react";
import { cn } from "@/libs/tailwind/utils";

export default function AssistantLayout(props: PropsWithChildren) {
  const { children } = props;
  const pathname = usePathname();

  const navItems = [
    {
      href: "/assistant",
      label: "Analyze",
      icon: BarChart3,
    },
    {
      href: "/history",
      label: "History",
      icon: Clock,
    },
    {
      href: "/profile",
      label: "Profile",
      icon: Users,
    },
  ];

  return (
    <>
      <div className="max-w-lg mx-auto h-screen flex flex-col bg-background relative">
        <div className="flex-1 overflow-y-auto pb-20">{children}</div>
      </div>

      {/* Fixed Footer Navigation */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-background border-t border-border z-50">
        <nav className="flex items-center justify-around h-16 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("size-5", isActive && "text-primary")} />
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive && "text-primary"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </footer>
    </>
  );
}
