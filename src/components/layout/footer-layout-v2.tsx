'use client';

import { PropsWithChildren } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/libs/tailwind/utils';
import {
  FOOTER_V2_NAV_ITEMS,
  type NavigationItem,
  ASSISTANT_ROUTES,
} from '@/constants/routes';
import { useIsPartnerChatDetail } from '@/hooks/use-is-partner-chat-detail';

function isNavItemActive(item: NavigationItem, pathname: string): boolean {
  if (item.matchPrefix) {
    return pathname.startsWith(item.href);
  }
  return pathname === item.href;
}

export default function FooterLayoutV2(props: Readonly<PropsWithChildren>) {
  const { children } = props;
  const pathname = usePathname();
  const isPartnerChatDetailPath = useIsPartnerChatDetail();

  return (
    <>
      <div className="max-w-lg mx-auto h-screen flex flex-col bg-background fixed top-0 left-1/2 -translate-x-1/2 w-full">
        <div
          className={cn('flex-1 overflow-y-auto', {
            'pb-24 max-h-[90vh] min-h-screen': !isPartnerChatDetailPath,
            'h-screen pb-6': isPartnerChatDetailPath,
          })}
        >
          {children}
        </div>
      </div>

      {/* Fixed Footer Navigation v2 */}
      <footer
        className={cn(
          'fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-50',
          {
            hidden: isPartnerChatDetailPath,
          }
        )}
      >
        <div className="footer-v2-background rounded-t-[32px] px-4 pt-3 pb-6 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
          <nav className="flex items-center justify-around relative">
            {FOOTER_V2_NAV_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item, pathname);
              const isPlusButton =
                item.href === ASSISTANT_ROUTES.PARTNER_CREATE;

              // Regular navigation items
              if (!isPlusButton) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-center transition-colors',
                      'flex-1'
                    )}
                    onClick={(e) => {
                      if (!item.href) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Icon
                      className={cn(
                        'size-6 transition-colors',
                        isActive
                          ? 'text-[var(--footer-active)]'
                          : 'text-[var(--footer-inactive)]'
                      )}
                    />
                  </Link>
                );
              }

              // Central Plus button (prominent)
              return (
                <div
                  key={item.href}
                  className="relative flex items-center justify-center -mt-8"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center justify-center',
                      'size-14 rounded-full',
                      'bg-[var(--footer-active)]',
                      'shadow-[0_4px_16px_rgba(230,82,97,0.4)]',
                      'hover:shadow-[0_6px_20px_rgba(230,82,97,0.5)]',
                      'transition-all duration-200',
                      'active:scale-95'
                    )}
                  >
                    <Icon className="size-6 text-white" strokeWidth={2.5} />
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>
      </footer>
    </>
  );
}
