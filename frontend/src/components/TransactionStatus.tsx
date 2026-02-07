"use client";

import { CheckCircle2, XCircle, Loader2, ExternalLink, AlertCircle } from 'lucide-react';

export type TransactionState = 'idle' | 'pending' | 'confirming' | 'success' | 'error';

export interface TransactionStatusProps {
  state: TransactionState;
  title?: string;
  message?: string;
  txHash?: string;
  error?: string;
  className?: string;
}

export function TransactionStatus({
  state,
  title,
  message,
  txHash,
  error,
  className = '',
}: TransactionStatusProps) {
  if (state === 'idle') {
    return null;
  }

  const getStateConfig = () => {
    switch (state) {
      case 'pending':
        return {
          icon: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
          bgClass: 'bg-blue-500/10 border-blue-500/20',
          title: title || 'Transaction Pending',
          message: message || 'Please confirm in your wallet...',
        };
      case 'confirming':
        return {
          icon: <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />,
          bgClass: 'bg-purple-500/10 border-purple-500/20',
          title: title || 'Confirming Transaction',
          message: message || 'Waiting for blockchain confirmation...',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
          bgClass: 'bg-green-500/10 border-green-500/20',
          title: title || 'Transaction Successful',
          message: message || 'Your transaction has been confirmed.',
        };
      case 'error':
        return {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          bgClass: 'bg-red-500/10 border-red-500/20',
          title: title || 'Transaction Failed',
          message: error || message || 'An error occurred during the transaction.',
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5 text-gray-500" />,
          bgClass: 'bg-gray-500/10 border-gray-500/20',
          title: title || 'Transaction',
          message: message || '',
        };
    }
  };

  const config = getStateConfig();

  return (
    <div className={`rounded-xl border backdrop-blur-sm p-6 ${config.bgClass} ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{config.title}</h3>
          <p className="text-sm text-muted-foreground">{config.message}</p>
          
          {txHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
            >
              View on Etherscan
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// Simplified inline version for use in forms/buttons
export interface InlineTransactionStatusProps {
  isPending?: boolean;
  isConfirming?: boolean;
  isSuccess?: boolean;
  error?: string;
  defaultText: string;
  pendingText?: string;
  confirmingText?: string;
  successText?: string;
}

export function InlineTransactionStatus({
  isPending,
  isConfirming,
  isSuccess,
  error,
  defaultText,
  pendingText = 'Waiting for approval...',
  confirmingText = 'Confirming...',
  successText = 'Success!',
}: InlineTransactionStatusProps) {
  if (isPending) {
    return (
      <span className="inline-flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        {pendingText}
      </span>
    );
  }

  if (isConfirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        {confirmingText}
      </span>
    );
  }

  if (isSuccess) {
    return (
      <span className="inline-flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4" />
        {successText}
      </span>
    );
  }

  if (error) {
    return (
      <span className="inline-flex items-center gap-2">
        <XCircle className="w-4 h-4" />
        Error
      </span>
    );
  }

  return <span>{defaultText}</span>;
}
