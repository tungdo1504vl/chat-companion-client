export type TPageHeaderProps = Readonly<{
  title?: string;
  onBackClick?: () => void;
  backHref?: string; // For Link-based navigation
  onMenuClick?: () => void;
  className?: string;
}>;
