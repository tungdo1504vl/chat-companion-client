import { WinACrushWrapper } from "../win-a-crush-wrapper";

type WinACrushPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function WinACrushPage({ params }: WinACrushPageProps) {
  const partnerParams = await params;
  const partnerId = partnerParams.id;

  return (
    <div className="flex flex-col h-full bg-background">
      <WinACrushWrapper partnerId={partnerId} />
    </div>
  );
}
