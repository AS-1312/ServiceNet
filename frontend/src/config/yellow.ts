import { Ylide, YlideKeyStore, BrowserLocalStorage } from '@ylide/sdk';

// Yellow SDK configuration
export interface YellowConfig {
  dev?: boolean;
  keystore?: YlideKeyStore;
}

// Default configuration
export const defaultYellowConfig: YellowConfig = {
  dev: process.env.NODE_ENV === 'development',
};

// Initialize Yellow SDK instance
export function createYellowSDK(config: YellowConfig = defaultYellowConfig): Ylide {
  // Create keystore with browser local storage if not provided
  const storage = new BrowserLocalStorage();
  const keystore = config.keystore || new YlideKeyStore(storage, {
    onPasswordRequest: async (reason: string) => {
      // Return a default password or prompt user
      return 'default-password';
    },
    onDeriveRequest: async (
      reason: string,
      blockchainGroup: string,
      wallet: string,
      address: string,
      magicString: string
    ) => {
      // Handle key derivation request
      return null;
    },
  });
  const ylide = new Ylide(keystore);

  return ylide;
}

// Supported networks mapping (chain ID to network name)
export const SUPPORTED_NETWORKS: Record<number, string> = {
  1: 'ethereum',
  11155111: 'sepolia',
  137: 'polygon',
  42161: 'arbitrum',
  10: 'optimism',
  56: 'bsc',
  43114: 'avalanche',
  250: 'fantom',
  100: 'gnosis',
  8453: 'base',
  84532: 'base-sepolia',
};

// Helper to check if network is supported
export function isSupportedNetwork(chainId: number): boolean {
  return chainId in SUPPORTED_NETWORKS;
}

// Helper to get network name
export function getNetworkName(chainId: number): string {
  return SUPPORTED_NETWORKS[chainId] || 'Unknown';
}

// Export types for use in other files
export interface YellowWalletAccount {
  wallet: string;
  address: string;
  blockchain: string;
}

// Made with Bob
