import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('Uncaught Error Boundary Exception:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="bg-slate-900/80 border border-rose-500/30 rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">Something went wrong</h1>
              <p className="text-slate-400 text-xs leading-relaxed">
                An unexpected application error occurred. Diagnostic details are shown below.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-rose-400 text-left overflow-x-auto max-h-60 space-y-2 select-text">
                <div className="font-bold text-rose-300">Message: {this.state.error.message}</div>
                {this.state.error.stack && (
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider font-sans font-semibold mb-1">Stack Trace:</div>
                    <pre className="text-[10px] text-rose-300/80 whitespace-pre-wrap font-mono">{this.state.error.stack}</pre>
                  </div>
                )}
                {this.state.errorInfo?.componentStack && (
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider font-sans font-semibold mb-1">Component Stack:</div>
                    <pre className="text-[10px] text-slate-400 whitespace-pre-wrap font-mono">{this.state.errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <RefreshCcw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
