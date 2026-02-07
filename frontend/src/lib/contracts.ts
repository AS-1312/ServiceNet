import { formatUnits, parseUnits, keccak256, toBytes, namehash as viemNamehash } from 'viem';
import type { Service, Session, FormattedService, FormattedSession } from '@/types/contracts';

/**
 * Convert ENS name to bytes32 node hash
 */
export function namehash(name: string): `0x${string}` {
  return viemNamehash(name);
}

/**
 * Format USDC amount (6 decimals) to human-readable string
 */
export function formatUSDC(amount: bigint): string {
  return formatUnits(amount, 6);
}

/**
 * Parse USDC amount from string to bigint (6 decimals)
 */
export function parseUSDC(amount: string): bigint {
  return parseUnits(amount, 6);
}

/**
 * Format ETH amount (18 decimals) to human-readable string
 */
export function formatETH(amount: bigint): string {
  return formatUnits(amount, 18);
}

/**
 * Parse ETH amount from string to bigint (18 decimals)
 */
export function parseETH(amount: string): bigint {
  return parseUnits(amount, 18);
}

/**
 * Format timestamp to Date object
 */
export function formatTimestamp(timestamp: bigint): Date {
  return new Date(Number(timestamp) * 1000);
}

/**
 * Format large numbers with K, M suffixes
 */
export function formatLargeNumber(num: bigint): string {
  const n = Number(num);
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1)}K`;
  }
  return n.toString();
}

/**
 * Format rating (stored as rating * 100)
 */
export function formatRating(rating: bigint): string {
  return (Number(rating) / 100).toFixed(2);
}

/**
 * Format service data for UI display
 */
export function formatService(service: Service): FormattedService {
  return {
    ...service,
    pricePerCallFormatted: `$${formatUSDC(service.pricePerCall)}`,
    totalCallsFormatted: formatLargeNumber(service.totalCalls),
    totalRevenueFormatted: `$${formatUSDC(service.totalRevenue)}`,
    createdAtDate: formatTimestamp(service.createdAt),
  };
}

/**
 * Format session data for UI display
 */
export function formatSession(session: Session): FormattedSession {
  const remaining = session.allowance - session.spent;
  const now = Math.floor(Date.now() / 1000);
  const isExpired = Number(session.expiresAt) < now;

  return {
    ...session,
    allowanceFormatted: `$${formatUSDC(session.allowance)}`,
    spentFormatted: `$${formatUSDC(session.spent)}`,
    remaining,
    remainingFormatted: `$${formatUSDC(remaining)}`,
    pricePerCallFormatted: `$${formatUSDC(session.pricePerCall)}`,
    openedAtDate: formatTimestamp(session.openedAt),
    expiresAtDate: formatTimestamp(session.expiresAt),
    isExpired,
  };
}

/**
 * Calculate estimated number of calls remaining in session
 */
export function calculateRemainingCalls(session: Session): bigint {
  const remaining = session.allowance - session.spent;
  if (session.pricePerCall === BigInt(0)) return BigInt(0);
  return remaining / session.pricePerCall;
}

/**
 * Check if session has expired
 */
export function isSessionExpired(session: Session): boolean {
  const now = Math.floor(Date.now() / 1000);
  return Number(session.expiresAt) < now;
}

/**
 * Check if session has sufficient balance for calls
 */
export function hasSessionBalance(session: Session, numCalls: number = 1): boolean {
  const remaining = session.allowance - session.spent;
  const cost = session.pricePerCall * BigInt(numCalls);
  return remaining >= cost;
}

/**
 * Parse contract error message
 */
export function parseContractError(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    
    // Check for custom contract errors
    if (err.name) {
      switch (err.name) {
        case 'ServiceNotFound':
          return 'Service not found';
        case 'ServiceNotActive':
          return 'Service is not active';
        case 'InsufficientStake':
          return 'Insufficient stake required';
        case 'InvalidPrice':
          return 'Invalid price';
        case 'Unauthorized':
          return 'Unauthorized access';
        case 'SessionExpired':
          return 'Session has expired';
        case 'SessionNotActive':
          return 'Session is not active';
        case 'InsufficientAllowance':
          return 'Insufficient session allowance';
        case 'AlreadyRated':
          return 'You have already rated this service';
        case 'InvalidRating':
          return 'Invalid rating value';
        default:
          break;
      }
    }
    
    // Check for revert messages
    if (err.message) {
      return err.message;
    }
  }
  
  return 'Transaction failed';
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Calculate platform fee (2%)
 */
export function calculatePlatformFee(amount: bigint): bigint {
  return (amount * BigInt(200)) / BigInt(10000); // 200 basis points = 2%
}

/**
 * Calculate provider revenue after platform fee
 */
export function calculateProviderRevenue(amount: bigint): bigint {
  const fee = calculatePlatformFee(amount);
  return amount - fee;
}

/**
 * Validate ENS name format
 */
export function isValidENSName(name: string): boolean {
  // Basic validation - should end with .eth and contain valid characters
  const ensRegex = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.eth$/i;
  return ensRegex.test(name);
}

/**
 * Get time remaining until expiration
 */
export function getTimeRemaining(expiresAt: bigint): string {
  const now = Math.floor(Date.now() / 1000);
  const remaining = Number(expiresAt) - now;
  
  if (remaining <= 0) return 'Expired';
  
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
