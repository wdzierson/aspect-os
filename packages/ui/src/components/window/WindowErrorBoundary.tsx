import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface WindowErrorBoundaryProps {
  children: ReactNode;
  windowTitle?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export class WindowErrorBoundary extends Component<WindowErrorBoundaryProps, State> {
  state: State = { hasError: false, error: null, showDetails: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { windowTitle } = this.props;
    const { error, showDetails } = this.state;

    return (
      <div role="alert" className="flex flex-col items-center justify-center h-full p-6 bg-background text-foreground">
        <AlertTriangle className="w-10 h-10 text-mac-yellow mb-3" aria-hidden="true" />
        <h2 className="text-base font-semibold mb-1">App crashed</h2>
        {windowTitle && (
          <p className="text-sm text-muted-foreground mb-4">{windowTitle}</p>
        )}

        <button
          onClick={this.handleReload}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-primary text-primary-foreground text-sm font-medium',
            'hover:opacity-90 transition-opacity duration-fast',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          )}
          aria-label="Reload app"
        >
          <RotateCcw className="w-4 h-4" />
          Reload
        </button>

        {error && (
          <div className="mt-4 w-full max-w-sm">
            <button
              onClick={this.toggleDetails}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-fast"
              aria-expanded={showDetails}
              aria-label="Toggle error details"
            >
              {showDetails ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              Error details
            </button>
            {showDetails && (
              <pre className="mt-2 p-3 rounded-lg bg-muted text-xs text-muted-foreground overflow-auto max-h-40 os-scrollbar">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            )}
          </div>
        )}
      </div>
    );
  }
}
