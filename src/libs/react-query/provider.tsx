"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { getQueryClient } from ".";

export default function ReactQueryProvider({
  children,
}: React.PropsWithChildren) {
  const [queryClient] = useState(getQueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
