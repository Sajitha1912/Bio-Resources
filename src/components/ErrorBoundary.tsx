import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

/**
 * Catches render/lifecycle errors anywhere in the route tree so a crash shows a
 * friendly, recoverable message instead of leaving a blank screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  private handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        role="alert"
        className="flex min-h-svh flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-fg"
      >
        <h1 className="font-heading text-3xl sm:text-4xl">Something went wrong</h1>
        <p className="max-w-md text-fg-muted">
          An unexpected error interrupted this page. You can try again, or head
          back to the home page.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={this.handleReset}
            className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream transition hover:bg-forest-deep dark:bg-lime dark:text-forest dark:hover:bg-lime/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-line bg-surface px-6 py-3 text-sm font-medium text-fg transition hover:border-teal/60 hover:text-accent dark:hover:border-lime/60 dark:hover:text-lime"
          >
            Back to home
          </a>
        </div>
      </div>
    )
  }
}
