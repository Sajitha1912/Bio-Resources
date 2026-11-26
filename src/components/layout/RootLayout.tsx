import { useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { FilmGrain } from "@/components/ui/FilmGrain";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { ScrollToTop } from "./ScrollToTop";
import { ScrollProgress } from "./ScrollProgress";
import { BackToTop } from "./BackToTop";
import { FloatingCall } from "./FloatingCall";
import { PageTransition } from "./PageTransition";
import { Preloader } from "./Preloader";
import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { useDocumentVisible } from "@/hooks/useDocumentVisible";

export function RootLayout() {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);
  const location = useLocation();

  useDocumentVisible();

  return (
    <MotionConfig reducedMotion="user">
      {loaded ? null : <Preloader onDone={handleLoaded} />}

      <div className="flex min-h-svh flex-col">
        <LocalBusinessJsonLd />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[70] focus:rounded-lg focus:bg-surface-strong focus:px-4 focus:py-2 focus:text-sm"
        >
          Skip to content
        </a>

        <ScrollProgress />
        <SiteHeader />

        <main id="main" className="relative z-10 flex-1">
          <PageTransition>
            <ErrorBoundary key={location.pathname}>
              <Outlet />
            </ErrorBoundary>
          </PageTransition>
        </main>

        <SiteFooter />
        <FloatingCall />
        <BackToTop />
        <FilmGrain />
        <ScrollToTop />
      </div>
    </MotionConfig>
  );
}
