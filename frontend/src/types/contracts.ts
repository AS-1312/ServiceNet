/**
 * Type definitions for smart contract data structures
 */

/**
 * Service struct from ServiceNet.sol
 */
export interface Service {
  provider: `0x${string}`;
  ensName: string;
  pricePerCall: bigint;
  totalCalls: bigint;
  totalRevenue: bigint;
  active: boolean;
  createdAt: bigint;
}

/**
 * Rating struct from ServiceNet.sol
 */
export interface Rating {
  totalRatings: bigint;
  sumRatings: bigint;
  averageRating: bigint;
}

/**
 * Session struct from YellowSessionManager.sol
 */
export interface Session {
  sessionId: `0x${string}`;
  serviceNode: `0x${string}`;
  consumer: `0x${string}`;
  provider: `0x${string}`;
  allowance: bigint;
  spent: bigint;
  callsMade: bigint;
  pricePerCall: bigint;
  openedAt: bigint;
  expiresAt: bigint;
  active: boolean;
}

/**
 * Service metrics aggregated data
 */
export interface ServiceMetrics {
  totalCalls: bigint;
  totalRevenue: bigint;
  avgRating: bigint;
}

/**
 * Session balance information
 */
export interface SessionBalance {
  allowance: bigint;
  spent: bigint;
  remaining: bigint;
}

/**
 * Formatted service data for UI display
 */
export interface FormattedService extends Omit<Service, 'pricePerCall' | 'totalCalls' | 'totalRevenue' | 'createdAt'> {
  pricePerCall: bigint;
  pricePerCallFormatted: string;
  totalCalls: bigint;
  totalCallsFormatted: string;
  totalRevenue: bigint;
  totalRevenueFormatted: string;
  createdAt: bigint;
  createdAtDate: Date;
}

/**
 * Formatted session data for UI display
 */
export interface FormattedSession extends Omit<Session, 'allowance' | 'spent' | 'callsMade' | 'pricePerCall' | 'openedAt' | 'expiresAt'> {
  allowance: bigint;
  allowanceFormatted: string;
  spent: bigint;
  spentFormatted: string;
  callsMade: bigint;
  remaining: bigint;
  remainingFormatted: string;
  pricePerCall: bigint;
  pricePerCallFormatted: string;
  openedAt: bigint;
  openedAtDate: Date;
  expiresAt: bigint;
  expiresAtDate: Date;
  isExpired: boolean;
}

/**
 * Service category type
 */
export type ServiceCategory = 'data' | 'ai' | 'oracle' | 'api' | 'compute' | 'other';

/**
 * Transaction status
 */
export type TransactionStatus = 'idle' | 'preparing' | 'pending' | 'success' | 'error';
