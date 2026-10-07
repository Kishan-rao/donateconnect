import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const showSuccess = useCallback((message: string) => addToast('success', message), [addToast]);
  const showError = useCallback((message: string) => addToast('error', message), [addToast]);
  const showInfo = useCallback((message: string) => addToast('info', message), [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      {/* Toast Notification Container: elevated above Android bottom navigation on mobile */}
      <div
        aria-live="polite"
        className="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 z-50 flex flex-col gap-2 max-w-sm w-auto md:w-96 pointer-events-none mx-auto md:mx-0 safe-pb"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl border shadow-xl flex items-start gap-3 transition-all duration-200 animate-slide-up bg-white ${
              toast.type === 'success'
                ? 'border-[#A7F3D0] text-[#047857]'
                : toast.type === 'error'
                ? 'border-[#FECACA] text-[#B91C1C]'
                : 'border-[#BAE6FD] text-[#0369A1]'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
            )}

            <div className="flex-1 text-xs font-semibold leading-relaxed text-[#111827]">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#6B7280] hover:text-[#111827] transition-colors p-1 -mr-1 -mt-1 rounded-lg"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
