import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'ServiceNet',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [sepolia, mainnet, base, baseSepolia], // Sepolia first as primary network
  ssr: true,
});

// Export chain info for convenience
export const SUPPORTED_CHAINS = {
  sepolia,
  mainnet,
  base,
  baseSepolia,
};

export const PRIMARY_CHAIN = sepolia;
export const PRIMARY_CHAIN_ID = sepolia.id;
