"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { YellowSessionManagerConfig } from '@/config/contracts';
import { namehash, formatSession, parseUSDC, parseContractError } from '@/lib/contracts';
import type { Session, SessionBalance, FormattedSession } from '@/types/contracts';
import { useEffect, useState } from 'react';

/**
 * Hook to interact with YellowSessionManager contract
 */
export function useYellowSessionManager() {
  /**
   * Get session by ID
   */
  const useGetSession = (sessionId: `0x${string}` | undefined) => {
    const { data, isLoading, error, refetch } = useReadContract({
      ...YellowSessionManagerConfig,
      functionName: 'getSession',
      args: sessionId ? [sessionId] : undefined,
      query: {
        enabled: !!sessionId,
      },
    });

    return {
      session: data as Session | undefined,
      isLoading,
      error,
      refetch,
    };
  };

  /**
   * Get session balance information
   */
  const useGetSessionBalance = (sessionId: `0x${string}` | undefined) => {
    const { data, isLoading, error, refetch } = useReadContract({
      ...YellowSessionManagerConfig,
      functionName: 'getSessionBalance',
      args: sessionId ? [sessionId] : undefined,
      query: {
        enabled: !!sessionId,
      },
    });

    if (!data) {
      return { balance: undefined, isLoading, error, refetch };
    }

    const [allowance, spent, remaining] = data as [bigint, bigint, bigint];
    const balance: SessionBalance = {
      allowance,
      spent,
      remaining,
    };

    return { balance, isLoading, error, refetch };
  };

  /**
   * Check if session is active
   */
  const useIsSessionActive = (sessionId: `0x${string}` | undefined) => {
    const { data, isLoading, error, refetch } = useReadContract({
      ...YellowSessionManagerConfig,
      functionName: 'isSessionActive',
      args: sessionId ? [sessionId] : undefined,
      query: {
        enabled: !!sessionId,
      },
    });

    return {
      isActive: data as boolean | undefined,
      isLoading,
      error,
      refetch,
    };
  };

  /**
   * Get all sessions for a user
   */
  const useGetUserSessions = (userAddress: `0x${string}` | undefined) => {
    const { data, isLoading, error, refetch } = useReadContract({
      ...YellowSessionManagerConfig,
      functionName: 'getUserSessions',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress,
      },
    });

    return {
      sessionIds: data as `0x${string}`[] | undefined,
      isLoading,
      error,
      refetch,
    };
  };

  /**
   * Get total session count
   */
  const useGetSessionCount = () => {
    const { data, isLoading, error } = useReadContract({
      ...YellowSessionManagerConfig,
      functionName: 'sessionCount',
    });

    return {
      sessionCount: data as bigint | undefined,
      isLoading,
      error,
    };
  };

  return {
    useGetSession,
    useGetSessionBalance,
    useIsSessionActive,
    useGetUserSessions,
    useGetSessionCount,
  };
}

/**
 * Hook to write to YellowSessionManager contract
 */
export function useYellowSessionWrite() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  /**
   * Open a new session
   */
  const openSession = async (
    ensName: string,
    allowanceUSD: string,
    durationSeconds: number = 86400 // Default: 24 hours
  ) => {
    const serviceNode = namehash(ensName);
    const allowance = parseUSDC(allowanceUSD);

    writeContract({
      ...YellowSessionManagerConfig,
      functionName: 'openSession',
      args: [serviceNode, allowance, BigInt(durationSeconds)],
    });
  };

  /**
   * Close a session
   */
  const closeSession = async (sessionId: `0x${string}`) => {
    writeContract({
      ...YellowSessionManagerConfig,
      functionName: 'closeSession',
      args: [sessionId],
    });
  };

  /**
   * Record usage for a session (typically called by provider)
   */
  const recordUsage = async (sessionId: `0x${string}`, calls: bigint) => {
    writeContract({
      ...YellowSessionManagerConfig,
      functionName: 'recordUsage',
      args: [sessionId, calls],
    });
  };

  return {
    openSession,
    closeSession,
    recordUsage,
    isPending,
    isConfirming,
    isSuccess,
    error: error ? parseContractError(error) : null,
    hash,
  };
}

/**
 * Combined hook for session management
 */
export function useYellowSession(sessionId: `0x${string}` | undefined) {
  const { useGetSession, useGetSessionBalance, useIsSessionActive } = useYellowSessionManager();

  const { session, isLoading: isLoadingSession, refetch: refetchSession } = useGetSession(sessionId);
  const { balance, isLoading: isLoadingBalance, refetch: refetchBalance } = useGetSessionBalance(sessionId);
  const { isActive, isLoading: isLoadingActive, refetch: refetchActive } = useIsSessionActive(sessionId);

  const [formattedSession, setFormattedSession] = useState<FormattedSession | undefined>();

  useEffect(() => {
    if (session) {
      setFormattedSession(formatSession(session));
    }
  }, [session]);

  const refetch = () => {
    refetchSession();
    refetchBalance();
    refetchActive();
  };

  return {
    session,
    formattedSession,
    balance,
    isActive,
    isLoading: isLoadingSession || isLoadingBalance || isLoadingActive,
    refetch,
  };
}

/**
 * Hook to manage user's active sessions
 */
export function useUserSessions() {
  const { address } = useAccount();
  const { useGetUserSessions, useGetSession } = useYellowSessionManager();

  const { sessionIds, isLoading: isLoadingIds, refetch } = useGetUserSessions(address);

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Fetch all session details when sessionIds change
  useEffect(() => {
    if (!sessionIds || sessionIds.length === 0) {
      setSessions([]);
      return;
    }

    setIsLoadingSessions(true);
    // Note: In a production app, you'd batch these calls or use multicall
    // For now, we'll just mark as loading and let individual components fetch
    setIsLoadingSessions(false);
  }, [sessionIds]);

  return {
    sessionIds,
    sessions,
    isLoading: isLoadingIds || isLoadingSessions,
    refetch,
  };
}
