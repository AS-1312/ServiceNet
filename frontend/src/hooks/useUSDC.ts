"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { USDCConfig, getContractAddress, SEPOLIA_CHAIN_ID } from '@/config/contracts';
import { formatUSDC, parseUSDC, parseContractError } from '@/lib/contracts';
import { useState, useEffect } from 'react';

/**
 * Hook to interact with USDC token contract
 */
export function useUSDC() {
  const { address } = useAccount();

  /**
   * Get USDC balance of an address
   */
  const useBalance = (userAddress: `0x${string}` | undefined) => {
    const { data, isLoading, error, refetch } = useReadContract({
      ...USDCConfig,
      functionName: 'balanceOf',
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress,
      },
    });

    return {
      balance: data as bigint | undefined,
      balanceFormatted: data ? formatUSDC(data as bigint) : undefined,
      isLoading,
      error,
      refetch,
    };
  };

  /**
   * Get USDC allowance for a spender
   */
  const useAllowance = (owner: `0x${string}` | undefined, spender: `0x${string}` | undefined) => {
    const { data, isLoading, error, refetch } = useReadContract({
      ...USDCConfig,
      functionName: 'allowance',
      args: owner && spender ? [owner, spender] : undefined,
      query: {
        enabled: !!owner && !!spender,
      },
    });

    return {
      allowance: data as bigint | undefined,
      allowanceFormatted: data ? formatUSDC(data as bigint) : undefined,
      isLoading,
      error,
      refetch,
    };
  };

  /**
   * Get user's own balance
   */
  const useMyBalance = () => {
    return useBalance(address);
  };

  /**
   * Check allowance for YellowSessionManager
   */
  const useYellowAllowance = () => {
    const yellowManager = getContractAddress(SEPOLIA_CHAIN_ID, 'YellowSessionManager');
    return useAllowance(address, yellowManager);
  };

  return {
    useBalance,
    useAllowance,
    useMyBalance,
    useYellowAllowance,
  };
}

/**
 * Hook to write to USDC contract
 */
export function useUSDCWrite() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  /**
   * Approve USDC spending
   */
  const approve = async (spender: `0x${string}`, amountUSD: string) => {
    const amount = parseUSDC(amountUSD);

    writeContract({
      ...USDCConfig,
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  /**
   * Approve USDC for YellowSessionManager
   */
  const approveYellow = async (amountUSD: string) => {
    const yellowManager = getContractAddress(SEPOLIA_CHAIN_ID, 'YellowSessionManager');
    await approve(yellowManager, amountUSD);
  };

  /**
   * Approve unlimited USDC spending (max uint256)
   */
  const approveMax = async (spender: `0x${string}`) => {
    const maxAmount = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

    writeContract({
      ...USDCConfig,
      functionName: 'approve',
      args: [spender, maxAmount],
    });
  };

  return {
    approve,
    approveYellow,
    approveMax,
    isPending,
    isConfirming,
    isSuccess,
    error: error ? parseContractError(error) : null,
    hash,
  };
}

/**
 * Combined hook for USDC operations
 */
export function useUSDCOperations() {
  const { address } = useAccount();
  const { useMyBalance, useYellowAllowance } = useUSDC();
  const usdcWrite = useUSDCWrite();

  const { balance, balanceFormatted, isLoading: isLoadingBalance, refetch: refetchBalance } = useMyBalance();
  const { allowance, allowanceFormatted, isLoading: isLoadingAllowance, refetch: refetchAllowance } = useYellowAllowance();

  const [needsApproval, setNeedsApproval] = useState(false);

  /**
   * Check if approval is needed for a specific amount
   */
  const checkApproval = (amountUSD: string): boolean => {
    if (!allowance) return true;
    const amount = parseUSDC(amountUSD);
    return allowance < amount;
  };

  /**
   * Approve and wait for confirmation
   */
  const approveAndWait = async (amountUSD: string) => {
    await usdcWrite.approveYellow(amountUSD);
    // Wait for confirmation
    // Note: In production, you'd want to handle this with proper state management
  };

  useEffect(() => {
    if (allowance !== undefined) {
      setNeedsApproval(allowance === BigInt(0));
    }
  }, [allowance]);

  return {
    balance,
    balanceFormatted,
    allowance,
    allowanceFormatted,
    needsApproval,
    isLoading: isLoadingBalance || isLoadingAllowance,
    checkApproval,
    approveAndWait,
    refetchBalance,
    refetchAllowance,
    ...usdcWrite,
  };
}

/**
 * Hook to manage USDC approval flow for sessions
 */
export function useSessionApproval() {
  const { address } = useAccount();
  const { useYellowAllowance } = useUSDC();
  const { approveYellow, isPending, isConfirming, isSuccess, error } = useUSDCWrite();

  const { allowance, refetch } = useYellowAllowance();

  const [approvalState, setApprovalState] = useState<'idle' | 'checking' | 'needed' | 'approving' | 'approved'>('idle');

  /**
   * Check if approval is needed and approve if necessary
   */
  const ensureApproval = async (amountUSD: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setApprovalState('checking');
    await refetch();

    const amount = parseUSDC(amountUSD);
    
    if (allowance && allowance >= amount) {
      setApprovalState('approved');
      return true;
    }

    setApprovalState('needed');
    
    // Request approval for 2x the amount to reduce future approvals
    const approvalAmount = amount * BigInt(2);
    await approveYellow(formatUSDC(approvalAmount));
    
    setApprovalState('approving');
  };

  useEffect(() => {
    if (isSuccess) {
      setApprovalState('approved');
      refetch();
    }
  }, [isSuccess, refetch]);

  return {
    ensureApproval,
    approvalState,
    allowance,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
  };
}
