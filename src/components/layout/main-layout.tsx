import { SidebarProvider } from "../ui/sidebar";
import HeaderLayout from "./header/header";
import Sidebar from "./sidebar/sidebar";
import { TMainLayoutProps } from "./types";

export default function MainLayout(props: TMainLayoutProps) {
  const { children } = props;

  return (
    <SidebarProvider defaultOpen>
      <Sidebar />
      <div className="flex flex-col h-screen w-full">
        <HeaderLayout />
        {children}
      </div>
    </SidebarProvider>
  );
}
