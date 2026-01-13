import { Suspense } from "react";
import { WinACrushWrapper } from "../win-a-crush-wrapper";
import { WinACrushSkeleton } from "@/features/win-a-crush";

type WinACrushPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function WinACrushPage({ params }: WinACrushPageProps) {
  const partnerParams = await params;
  const partnerId = partnerParams.id;

  return (
    <div className="flex flex-col h-full bg-background">
      <Suspense fallback={<WinACrushSkeleton />}>
        <WinACrushWrapper partnerId={partnerId} />
      </Suspense>
    </div>
  );
}
