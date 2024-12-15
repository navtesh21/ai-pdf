"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
const queryClient = new QueryClient();
type props = {
  children: React.ReactNode;
};
export const ReactQueryProvider = ({ children }: props) => {
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

    )
};
