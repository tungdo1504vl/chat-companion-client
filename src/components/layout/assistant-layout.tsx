'use client';

<<<<<<< Updated upstream
import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/libs/tailwind/utils';
import { ASSISTANT_NAV_ITEMS, type NavigationItem } from '@/constants/routes';
=======
import { PropsWithChildren } from "react";
import FooterLayoutV2 from "./footer-layout-v2";
>>>>>>> Stashed changes

export default function AssistantLayout(props: Readonly<PropsWithChildren>) {
  const { children } = props;

<<<<<<< Updated upstream
  return (
    <>
      <div className="max-w-lg mx-auto h-screen flex flex-col bg-background fixed top-0 left-1/2 -translate-x-1/2 w-full">
        <div className="flex-1 overflow-y-auto max-h-[90vh]">{children}</div>
      </div>

      {/* Fixed Footer Navigation */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-background border-t border-border z-50">
        <nav className="flex items-center justify-around h-16 px-4">
          {ASSISTANT_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(item, pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('size-5', isActive && 'text-primary')} />
                <span
                  className={cn(
                    'text-xs font-medium',
                    isActive && 'text-primary'
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
=======
  return <FooterLayoutV2>{children}</FooterLayoutV2>;
>>>>>>> Stashed changes
}
