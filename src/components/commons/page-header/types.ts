export type TPageHeaderProps = Readonly<{
  title?: string;
  smallTitle?: boolean;
  onBackClick?: () => void;
  backHref?: string; // For Link-based navigation
  onMenuClick?: () => void;
  className?: string;
}>;
