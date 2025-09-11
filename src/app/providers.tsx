"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useState } from "react";
import { applyTheme } from "@/lib/colorThemes";
import { useEffect } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeInitializer />
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Initialize theme on client
function ThemeInitializer() {
  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('themeColor')) as any;
    applyTheme(stored || 'purple');
  }, []);
  return null;
}


