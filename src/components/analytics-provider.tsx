"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageView } from "@/lib/analytics";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route changes
  React.useEffect(() => {
    if (pathname) {
      pageView(pathname, {
        search: searchParams?.toString() || undefined,
      });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
