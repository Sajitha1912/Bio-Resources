import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode; fallback: ReactNode }
type State = { hasError: boolean }

/** Keeps a WebGL failure from taking down the page. */
export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
<<<<<<< HEAD
    console.error('3D scene failed to render:', error, info)
=======
    // Keep the console useful for debugging without breaking the UI.
    console.warn('3D scene failed to render:', error, info)
>>>>>>> e384689851efcff18a3874befa8b5e3ae8fd05ae
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
