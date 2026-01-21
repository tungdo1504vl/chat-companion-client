"use client";

import ReactQueryProvider from "@/libs/react-query/provider";
import { Toaster } from "../ui/sonner";

export default function AppProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (

    <ReactQueryProvider>
      <Toaster />
      {children}
    </ReactQueryProvider>
  );
}
