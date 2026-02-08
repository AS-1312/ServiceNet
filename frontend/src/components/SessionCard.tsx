"use client";

import Link from "next/link";
import { Clock, AlertCircle, X, Loader2, Zap } from "lucide-react";
import { useYellowSession, useYellowSessionWrite, useSessionStats } from "@/hooks";
import { useEffect, useState } from "react";

interface SessionCardProps {
  sessionId: `0x${string}`;
}

export function SessionCard({ sessionId }: SessionCardProps) {
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  
  // Fetch session data from contract
  const { 
    session, 
    formattedSession, 
    balance, 
    isActive, 
    isLoading 
  } = useYellowSession(sessionId);
  
  // Fetch live stats from API provider (off-chain tracking via Yellow Network)
  // TODO: Get service endpoint from ENS resolution or service metadata
  const serviceEndpoint = 'http://localhost:3001';
  const { data: liveStats, isLoading: isLoadingStats } = useSessionStats(
    isActive ? sessionId : undefined,
    serviceEndpoint
  );
  
  // Close session functionality
  const { 
    closeSession, 
    isPending: isClosing, 
    isSuccess: sessionClosed,
    error: closeError 
  } = useYellowSessionWrite();

  // Handle session close success
  useEffect(() => {
    if (sessionClosed) {
      alert('Session closed successfully! Remaining balance has been refunded.');
      setShowCloseConfirm(false);
    }
  }, [sessionClosed]);

  const handleCloseSession = async () => {
    if (!showCloseConfirm) {
      setShowCloseConfirm(true);
      return;
    }
    
    try {
      await closeSession(sessionId);
    } catch (error) {
      console.error('Failed to close session:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl border-2 border-border animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-muted rounded w-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
        <div className="h-2 bg-muted rounded w-full mb-4"></div>
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-muted rounded"></div>
          <div className="flex-1 h-10 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!session || !formattedSession) {
    return null;
  }

  // Calculate time remaining
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = Number(session.expiresAt);
  const timeRemaining = expiresAt - now;
  const hoursRemaining = Math.max(0, Math.floor(timeRemaining / 3600));
  const minutesRemaining = Math.max(0, Math.floor((timeRemaining % 3600) / 60));
  const isExpiringSoon = timeRemaining < 7200; // Less than 2 hours
  const isExpired = timeRemaining <= 0;

  // Calculate balance percentage
  const balancePercentage = balance ? 
    (Number(balance.remaining) / Number(session.allowance)) * 100 : 0;
  const isLowBalance = balancePercentage < 20 && balancePercentage > 0;

  // Get service name from ENS node (simplified - in production you'd resolve this)
  const serviceName = `service@${session.serviceNode.slice(0, 8)}...`;

  const getStatusColor = () => {
    if (isExpired || !isActive) return "text-red-600 dark:text-red-400 bg-red-500/10";
    if (isExpiringSoon || isLowBalance) return "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10";
    return "text-green-600 dark:text-green-400 bg-green-500/10";
  };

  const getStatus = () => {
    if (isExpired) return "expired";
    if (!isActive) return "closed";
    if (isExpiringSoon || isLowBalance) return "warning";
    return "active";
  };

  return (
    <div className="p-6 rounded-xl border-2 border-border hover:border-primary/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-lg font-semibold font-mono">
            Session #{sessionId.slice(0, 10)}...
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Service: {serviceName}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor()}`}>
              {getStatus()}
            </span>
            {!isExpired && isActive && (
              <span className="text-xs text-muted-foreground flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>
                  {hoursRemaining > 0 && `${hoursRemaining}h `}
                  {minutesRemaining}m remaining
                </span>
              </span>
            )}
          </div>
        </div>
        {isActive && !isExpired && (
          <button 
            onClick={() => setShowCloseConfirm(true)}
            disabled={isClosing}
            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-50"
          >
            {isClosing ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Close Error */}
      {closeError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{closeError}</p>
        </div>
      )}

      {/* Balance Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Balance</span>
          <span className="font-semibold">
            {formattedSession.remainingFormatted} / {formattedSession.allowanceFormatted}
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              isLowBalance ? "bg-warning" : "bg-success"
            }`}
            style={{ width: `${balancePercentage}%` }}
          />
        </div>
      </div>

      {/* Calls Used */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Calls Made</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {isActive && liveStats 
                ? liveStats.callsMade.toLocaleString()
                : Number(session.callsMade).toLocaleString()}
            </span>
            {isActive && liveStats?.yellowEnabled && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded" title="Zero-gas tracking via Yellow Network">
                <Zap className="w-3 h-3" />
                Live
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Spent: {isActive && liveStats 
              ? `$${liveStats.totalSpent.toFixed(6)}`
              : formattedSession.spentFormatted}
          </span>
          <span>Per call: ${formattedSession.pricePerCallFormatted}</span>
        </div>
        {isActive && liveStats?.yellowEnabled && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span>Zero-gas updates via Yellow Network • Refreshing every 3s</span>
          </div>
        )}
      </div>

      {/* Warnings */}
      {isActive && !isExpired && (isLowBalance || isExpiringSoon) && (
        <div className="flex items-center space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg mb-4">
          <AlertCircle className="w-4 h-4 text-warning" />
          <span className="text-sm text-warning">
            {isLowBalance && "Low balance - "}
            {isExpiringSoon && "Expiring soon"}
          </span>
        </div>
      )}

      {/* Close Confirmation */}
      {showCloseConfirm && (
        <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm font-medium mb-3">
            Are you sure you want to close this session?
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Remaining balance of {formattedSession.remainingFormatted} will be refunded to your wallet.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCloseSession}
              disabled={isClosing}
              className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isClosing && <Loader2 className="w-4 h-4 animate-spin" />}
              {isClosing ? 'Closing...' : 'Yes, Close Session'}
            </button>
            <button
              onClick={() => setShowCloseConfirm(false)}
              disabled={isClosing}
              className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {!showCloseConfirm && (
        <div className="flex gap-2">
          {isActive && !isExpired ? (
            <>
              <button
                onClick={() => setShowCloseConfirm(true)}
                disabled={isClosing}
                className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                Close Session
              </button>
              <a
                href={`https://sepolia.etherscan.io/address/${session.consumer}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
              >
                View on Explorer
              </a>
            </>
          ) : (
            <div className="w-full text-center py-2 text-sm text-muted-foreground">
              {isExpired ? 'Session Expired' : 'Session Closed'}
            </div>
          )}
        </div>
      )}

      {/* Session Details (collapsed) */}
      <details className="mt-4 text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          View Details
        </summary>
        <div className="mt-2 p-3 bg-secondary rounded-lg space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Session ID:</span>
            <span className="font-mono">{sessionId.slice(0, 16)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Consumer:</span>
            <span className="font-mono">{session.consumer.slice(0, 10)}...{session.consumer.slice(-8)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service Node:</span>
            <span className="font-mono">{session.serviceNode.slice(0, 16)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Opened:</span>
            <span>{new Date(Number(session.openedAt) * 1000).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expires:</span>
            <span>{new Date(Number(session.expiresAt) * 1000).toLocaleString()}</span>
          </div>
        </div>
      </details>
    </div>
  );
}
