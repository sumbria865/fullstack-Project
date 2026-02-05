import React from "react";

type Props = {
  children?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 text-red-900 rounded">
          <h2 className="font-bold text-lg">Something went wrong</h2>
          <pre className="text-xs mt-2 whitespace-pre-wrap">
            {String(this.state.error)}
          </pre>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
