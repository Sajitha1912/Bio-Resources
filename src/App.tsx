import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RootLayout } from '@/components/layout/RootLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'

/** Shown while a lazy route chunk is downloading, so the page is never blank. */
function RouteFallback() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex min-h-[60svh] items-center justify-center"
    >
      <span className="size-8 animate-spin rounded-full border-2 border-line border-t-accent dark:border-t-lime" />
    </div>
  )
}

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const AboutPage = lazy(() =>
  import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })),
)
const ServicesPage = lazy(() =>
  import('@/pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
)
const ServiceDetailPage = lazy(() =>
  import('@/pages/ServiceDetailPage').then((m) => ({
    default: m.ServiceDetailPage,
  })),
)
const ContactPage = lazy(() =>
  import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<RootLayout />}>
            <Route
              path="/"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <AboutPage />
                </Suspense>
              }
            />
            <Route
              path="/services"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <ServicesPage />
                </Suspense>
              }
            />
            <Route
              path="/services/:slug"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <ServiceDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <ContactPage />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
