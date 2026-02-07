"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  txHash?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? (toast.type === 'loading' ? undefined : 5000),
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration (except for loading toasts)
    if (newToast.duration) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );

    // If updating a loading toast to success/error, auto-remove after duration
    if (updates.type && updates.type !== 'loading') {
      const duration = updates.duration ?? 5000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Transaction-specific toast helpers
export function useTransactionToast() {
  const { addToast, updateToast } = useToast();

  const showTransactionPending = useCallback((title: string = 'Transaction Pending') => {
    return addToast({
      type: 'loading',
      title,
      message: 'Waiting for wallet approval...',
    });
  }, [addToast]);

  const showTransactionSubmitted = useCallback((toastId: string, txHash?: string) => {
    updateToast(toastId, {
      type: 'loading',
      title: 'Transaction Submitted',
      message: 'Confirming transaction...',
      txHash,
    });
  }, [updateToast]);

  const showTransactionSuccess = useCallback((
    toastId: string,
    title: string,
    message?: string,
    txHash?: string
  ) => {
    updateToast(toastId, {
      type: 'success',
      title,
      message,
      txHash,
      duration: 6000,
    });
  }, [updateToast]);

  const showTransactionError = useCallback((
    toastId: string,
    title: string,
    error: string
  ) => {
    updateToast(toastId, {
      type: 'error',
      title,
      message: error,
      duration: 8000,
    });
  }, [updateToast]);

  return {
    showTransactionPending,
    showTransactionSubmitted,
    showTransactionSuccess,
    showTransactionError,
  };
}
