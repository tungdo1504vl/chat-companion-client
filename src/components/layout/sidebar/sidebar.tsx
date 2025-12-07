import Image from "next/image";
import {
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TypographyH1 } from "@/components/ui/typgoraphy";

export default function Sidebar() {
  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row space-x-2 items-center">
            <Image src="/vercel.svg" alt="logo" width={32} height={32} />
            <TypographyH1 className="lg:text-lg font-bold">
              Chat Companion
            </TypographyH1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </ShadcnSidebar>
  );
}
