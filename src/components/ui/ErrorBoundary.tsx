import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center space-y-4 rounded-lg border border-red-200 bg-red-50 p-8">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold text-red-900">
              Something went wrong
            </h2>
            <p className="text-red-700">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
          </div>
          <Button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}