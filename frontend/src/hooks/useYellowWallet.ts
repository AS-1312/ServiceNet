"use client";

import { useState, useEffect, useCallback } from 'react';
import { useYellow } from '@/providers/yellow-provider';
import { useAccount, useWalletClient } from 'wagmi';

export interface YellowWalletAccount {
  wallet: string;
  address: string;
  blockchain: string;
}

export function useYellowWallet() {
  const { ylide, isInitialized, currentNetwork } = useYellow();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [yellowAccount, setYellowAccount] = useState<YellowWalletAccount | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Connect wallet to Yellow Network
   */
  const connectYellowWallet = useCallback(async () => {
    if (!ylide || !isInitialized) {
      throw new Error('Yellow SDK is not initialized');
    }

    if (!address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!currentNetwork) {
      throw new Error('Network not supported by Yellow');
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Note: Actual implementation would use ylide.addWallet() or similar
      // This is a placeholder for the actual Yellow SDK wallet connection
      console.log('Connecting wallet to Yellow Network:', {
        address,
        network: currentNetwork,
      });

      // Placeholder account
      const account: YellowWalletAccount = {
        wallet: 'metamask', // or detected wallet type
        address: address,
        blockchain: currentNetwork.toString(),
      };

      setYellowAccount(account);
      return account;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet to Yellow';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }, [ylide, isInitialized, address, isConnected, currentNetwork]);

  /**
   * Disconnect wallet from Yellow Network
   */
  const disconnectYellowWallet = useCallback(() => {
    setYellowAccount(null);
    setError(null);
    console.log('Disconnected from Yellow Network');
  }, []);

  /**
   * Auto-connect when wallet is connected and Yellow is initialized
   */
  useEffect(() => {
    if (isInitialized && isConnected && address && currentNetwork && !yellowAccount && !isConnecting) {
      connectYellowWallet().catch((err) => {
        console.error('Auto-connect to Yellow failed:', err);
      });
    }
  }, [isInitialized, isConnected, address, currentNetwork, yellowAccount, isConnecting, connectYellowWallet]);

  /**
   * Auto-disconnect when wallet is disconnected
   */
  useEffect(() => {
    if (!isConnected && yellowAccount) {
      disconnectYellowWallet();
    }
  }, [isConnected, yellowAccount, disconnectYellowWallet]);

  return {
    yellowAccount,
    isConnecting,
    error,
    connectYellowWallet,
    disconnectYellowWallet,
    isYellowConnected: !!yellowAccount,
    isReady: isInitialized && isConnected && !!currentNetwork,
  };
}

// Made with Bob
