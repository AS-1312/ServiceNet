"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Ylide } from '@ylide/sdk';
import { createYellowSDK, getNetworkName, isSupportedNetwork } from '@/config/yellow';
import { useAccount, useWalletClient } from 'wagmi';

interface YellowContextType {
  ylide: Ylide | null;
  isInitialized: boolean;
  currentNetwork: string | null;
  error: string | null;
}

const YellowContext = createContext<YellowContextType>({
  ylide: null,
  isInitialized: false,
  currentNetwork: null,
  error: null,
});

export function YellowProvider({ children }: { children: ReactNode }) {
  const [ylide, setYlide] = useState<Ylide | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { address, chainId, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Initialize Yellow SDK
  useEffect(() => {
    try {
      const sdk = createYellowSDK();
      setYlide(sdk);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      console.error('Failed to initialize Yellow SDK:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize Yellow SDK');
      setIsInitialized(false);
    }
  }, []);

  // Update current network when chain changes
  useEffect(() => {
    if (chainId) {
      if (isSupportedNetwork(chainId)) {
        const networkName = getNetworkName(chainId);
        setCurrentNetwork(networkName);
      } else {
        console.warn(`Chain ID ${chainId} is not supported by Yellow Network`);
        setCurrentNetwork(null);
      }
    } else {
      setCurrentNetwork(null);
    }
  }, [chainId]);

  // Connect wallet to Yellow SDK when wallet is connected
  useEffect(() => {
    if (ylide && isConnected && address && walletClient && currentNetwork) {
      // Note: Actual wallet connection to Yellow SDK would be implemented here
      // This requires additional setup based on your specific use case
      console.log('Wallet connected to Yellow SDK:', {
        address,
        network: currentNetwork,
      });
    }
  }, [ylide, isConnected, address, walletClient, currentNetwork]);

  return (
    <YellowContext.Provider
      value={{
        ylide,
        isInitialized,
        currentNetwork,
        error,
      }}
    >
      {children}
    </YellowContext.Provider>
  );
}

export function useYellow() {
  const context = useContext(YellowContext);
  if (!context) {
    throw new Error('useYellow must be used within YellowProvider');
  }
  return context;
}

// Made with Bob
