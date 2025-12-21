import { ArrowLeft, MoreVertical } from "lucide-react";
import { TMobileHeaderProps } from "./types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MobileHeader(props: TMobileHeaderProps) {
  const { isHaveBackButton = true, title, actions } = props;

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full flex items-center justify-between">
      {isHaveBackButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="shrink-0"
        >
          <ArrowLeft className="size-5" />
        </Button>
      )}
      <h1 className="flex-1 text-center text-2xl font-bold">{title}</h1>
      <Button variant="ghost" size="icon" className="shrink-0">
        <MoreVertical className="size-5" />
      </Button>
    </div>
  );
}
