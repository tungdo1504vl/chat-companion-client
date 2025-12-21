import { cn } from "@/libs/tailwind/utils";

type TContentCardProps = Readonly<{
  children?: React.ReactNode;
  className?: string;
}>;
export default function ContentCard(props: TContentCardProps) {
  const { children, className } = props;
  return (
    <div className={cn("bg-background rounded-lg p-4", className)}>
      {children}
    </div>
  );
}
