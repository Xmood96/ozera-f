import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="text-center p-8 bg-base-100 rounded-2xl shadow-lg max-w-md">
              <div className="text-6xl mb-4">😵</div>
              <h2 className="text-2xl font-bold text-base-content mb-2">
                حدث خطأ غير متوقع
              </h2>
              <p className="text-base-content opacity-75 mb-6">
                نعتذر عن هذا الإزعاج. يرجى تحديث الصفحة والمحاولة مرة أخرى.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                تحديث الصفحة
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}