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
    console.error('3D scene failed to render:', error, info)
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
