import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center" style={{ background: '#070d0a' }}>
          <div className="card p-8 max-w-md w-full border-red-500/30">
            <h1 className="text-3xl font-black mb-4 text-red-400">Oops! Something went wrong.</h1>
            <p className="text-gray-300 mb-6">We've encountered an unexpected error. Refreshing the page might help.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 rounded-xl font-bold bg-green-500 hover:bg-green-400 text-black transition-colors"
            >
              Refresh Page
            </button>
            {import.meta.env.DEV && (
              <pre className="mt-6 text-left text-xs text-red-300 bg-red-950/50 p-4 rounded-lg overflow-auto">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
