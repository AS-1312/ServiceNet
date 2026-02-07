import { ServiceNetAbi } from '@/abi/ServiceNetAbi';
import { YellowSessionManagerAbi } from '@/abi/YellowSessionManagerAbi';

/**
 * Contract addresses on Sepolia network
 */
export const SEPOLIA_CHAIN_ID = 11155111;

export const CONTRACT_ADDRESSES = {
  [SEPOLIA_CHAIN_ID]: {
    USDC: '0xC699822C6cADd3088A41DCC438E1b9F1C7D1c563' as `0x${string}`,
    ServiceNet: '0xDcA1c9dEC72290F5df5aa54a360ea324e48Ff625' as `0x${string}`,
    YellowSessionManager: '0x8Af5dF8FFF3375Ad85E8486f3F721D531075Ed3a' as `0x${string}`,
  },
} as const;

/**
 * Get contract address for the current chain
 */
export function getContractAddress(
  chainId: number,
  contract: 'USDC' | 'ServiceNet' | 'YellowSessionManager'
): `0x${string}` {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return addresses[contract];
}

/**
 * Contract ABIs
 */
export const ABIS = {
  ServiceNet: ServiceNetAbi,
  YellowSessionManager: YellowSessionManagerAbi,
  // ERC20 ABI for USDC interactions
  ERC20: [
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'address', name: 'spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'spender', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
} as const;

/**
 * Contract configurations for Wagmi
 */
export const ServiceNetConfig = {
  address: CONTRACT_ADDRESSES[SEPOLIA_CHAIN_ID].ServiceNet,
  abi: ABIS.ServiceNet,
  chainId: SEPOLIA_CHAIN_ID,
} as const;

export const YellowSessionManagerConfig = {
  address: CONTRACT_ADDRESSES[SEPOLIA_CHAIN_ID].YellowSessionManager,
  abi: ABIS.YellowSessionManager,
  chainId: SEPOLIA_CHAIN_ID,
} as const;

export const USDCConfig = {
  address: CONTRACT_ADDRESSES[SEPOLIA_CHAIN_ID].USDC,
  abi: ABIS.ERC20,
  chainId: SEPOLIA_CHAIN_ID,
} as const;
