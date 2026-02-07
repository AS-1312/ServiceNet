"use client";

import { useToast, Toast as ToastType } from '@/contexts/ToastContext';
import { CheckCircle2, XCircle, Info, Loader2, X, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Slide in animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300); // Match animation duration
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundClass = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'loading':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'info':
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div
      className={`
        pointer-events-auto
        rounded-lg border backdrop-blur-sm
        shadow-lg p-4 
        transform transition-all duration-300 ease-out
        ${getBackgroundClass()}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">{toast.title}</p>
          {toast.message && (
            <p className="text-sm text-muted-foreground mt-1">{toast.message}</p>
          )}
          
          {toast.txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${toast.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 mt-2 transition-colors"
            >
              View on Etherscan
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
