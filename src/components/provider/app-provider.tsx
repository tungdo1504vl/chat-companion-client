"use client";

import { ThemeProvider } from "@/libs/next-theme";
import ReactQueryProvider from "@/libs/react-query/provider";
import { Toaster } from "../ui/sonner";

export default function AppProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        <Toaster />
        {children}
      </ReactQueryProvider>
    </ThemeProvider>
  );
}
