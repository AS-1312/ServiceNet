"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { ServiceNetConfig } from '@/config/contracts';
import { namehash, formatService, parseUSDC, parseContractError } from '@/lib/contracts';
import type { Service, Rating, ServiceMetrics, FormattedService } from '@/types/contracts';
import { useEffect, useState } from 'react';

/**
 * Hook to interact with ServiceNet contract
 */
export function useServiceNet() {
  const { address } = useAccount();

  /**
   * Get service by ENS node hash
   */
  const useGetService = (ensNode: `0x${string}` | undefined) => {
    const { data, isLoading, error, refetch } = useReadContract({
      ...ServiceNetConfig,
      functionName: 'getService',
      args: ensNode ? [ensNode] : undefined,
      query: {
        enabled: !!ensNode,
      },
    });

    return {
      service: data as Service | undefined,
      isLoading,
      error,
      refetch,
    };
  };

  /**
   * Get service by ENS name
   */
  const useGetServiceByName = (ensName: string | undefined) => {
    const ensNode = ensName ? namehash(ensName) : undefined;
    return useGetService(ensNode);
  };

  /**
   * Get service metrics (totalCalls, totalRevenue, avgRating)
   */
  const useGetServiceMetrics = (ensNode: `0x${string}` | undefined) => {
    const { data, isLoading, error, refetch } = useReadContract({
      ...ServiceNetConfig,
      functionName: 'getServiceMetrics',
      args: ensNode ? [ensNode] : undefined,
      query: {
        enabled: !!ensNode,
      },
    });

    if (!data) {
      return { metrics: undefined, isLoading, error, refetch };
    }

    const [totalCalls, totalRevenue, avgRating] = data as [bigint, bigint, bigint];
    const metrics: ServiceMetrics = {
      totalCalls,
      totalRevenue,
      avgRating,
    };

    return { metrics, isLoading, error, refetch };
  };

  /**
   * Get service rating
   */
  const useGetRating = (ensNode: `0x${string}` | undefined) => {
    const { data, isLoading, error, refetch } = useReadContract({
      ...ServiceNetConfig,
      functionName: 'getRating',
      args: ensNode ? [ensNode] : undefined,
      query: {
        enabled: !!ensNode,
      },
    });

    if (!data) {
      return { rating: undefined, isLoading, error, refetch };
    }

    const [totalRatings, averageRating] = data as [bigint, bigint];
    const rating: Rating = {
      totalRatings,
      sumRatings: BigInt(0), // Not returned by getRating
      averageRating,
    };

    return { rating, isLoading, error, refetch };
  };

  /**
   * Get total number of services
   */
  const useGetTotalServices = () => {
    const { data, isLoading, error } = useReadContract({
      ...ServiceNetConfig,
      functionName: 'totalServices',
    });

    return {
      totalServices: data as bigint | undefined,
      isLoading,
      error,
    };
  };

  /**
   * Get provider's services
   */
  const useGetProviderServices = (providerAddress: `0x${string}` | undefined) => {
    const { data, isLoading, error, refetch } = useReadContract({
      ...ServiceNetConfig,
      functionName: 'getProviderServices',
      args: providerAddress ? [providerAddress] : undefined,
      query: {
        enabled: !!providerAddress,
      },
    });

    return {
      serviceNodes: data as `0x${string}`[] | undefined,
      isLoading,
      error,
      refetch,
    };
  };

  /**
   * Check if user has rated a service
   */
  const useHasRated = (ensNode: `0x${string}` | undefined, userAddress: `0x${string}` | undefined) => {
    const { data, isLoading, error } = useReadContract({
      ...ServiceNetConfig,
      functionName: 'hasRated',
      args: ensNode && userAddress ? [ensNode, userAddress] : undefined,
      query: {
        enabled: !!ensNode && !!userAddress,
      },
    });

    return {
      hasRated: data as boolean | undefined,
      isLoading,
      error,
    };
  };

  /**
   * Get minimum stake required
   */
  const useGetMinimumStake = () => {
    const { data, isLoading, error } = useReadContract({
      ...ServiceNetConfig,
      functionName: 'minimumStake',
    });

    return {
      minimumStake: data as bigint | undefined,
      isLoading,
      error,
    };
  };

  return {
    useGetService,
    useGetServiceByName,
    useGetServiceMetrics,
    useGetRating,
    useGetTotalServices,
    useGetProviderServices,
    useHasRated,
    useGetMinimumStake,
  };
}

/**
 * Hook to write to ServiceNet contract
 */
export function useServiceNetWrite() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  /**
   * Register a new service
   */
  const registerService = async (ensName: string, pricePerCallUSD: string, stakeETH: string) => {
    const ensNode = namehash(ensName);
    const pricePerCall = parseUSDC(pricePerCallUSD);
    const stake = BigInt(Math.floor(parseFloat(stakeETH) * 10 ** 18));

    writeContract({
      ...ServiceNetConfig,
      functionName: 'registerService',
      args: [ensNode, ensName, pricePerCall],
      value: stake,
    });
  };

  /**
   * Update service price
   */
  const updatePrice = async (ensName: string, newPriceUSD: string) => {
    const ensNode = namehash(ensName);
    const newPrice = parseUSDC(newPriceUSD);

    writeContract({
      ...ServiceNetConfig,
      functionName: 'updatePrice',
      args: [ensNode, newPrice],
    });
  };

  /**
   * Toggle service active status
   */
  const toggleService = async (ensName: string) => {
    const ensNode = namehash(ensName);

    writeContract({
      ...ServiceNetConfig,
      functionName: 'toggleService',
      args: [ensNode],
    });
  };

  /**
   * Submit rating for a service (1-5 stars)
   */
  const submitRating = async (ensName: string, stars: number) => {
    if (stars < 1 || stars > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const ensNode = namehash(ensName);

    writeContract({
      ...ServiceNetConfig,
      functionName: 'submitRating',
      args: [ensNode, stars],
    });
  };

  /**
   * Record usage (called by YellowSessionManager)
   */
  const recordUsage = async (ensName: string, consumer: `0x${string}`, calls: bigint) => {
    const ensNode = namehash(ensName);

    writeContract({
      ...ServiceNetConfig,
      functionName: 'recordUsage',
      args: [ensNode, consumer, calls],
    });
  };

  return {
    registerService,
    updatePrice,
    toggleService,
    submitRating,
    recordUsage,
    isPending,
    isConfirming,
    isSuccess,
    error: error ? parseContractError(error) : null,
    hash,
  };
}

/**
 * Combined hook for common service operations
 */
export function useService(ensName: string | undefined) {
  const { address } = useAccount();
  const { useGetServiceByName, useGetServiceMetrics, useGetRating, useHasRated } = useServiceNet();

  const { service, isLoading: isLoadingService, refetch: refetchService } = useGetServiceByName(ensName);
  const ensNode = ensName ? namehash(ensName) : undefined;
  const { metrics, isLoading: isLoadingMetrics } = useGetServiceMetrics(ensNode);
  const { rating, isLoading: isLoadingRating } = useGetRating(ensNode);
  const { hasRated, isLoading: isLoadingHasRated } = useHasRated(ensNode, address);

  const [formattedService, setFormattedService] = useState<FormattedService | undefined>();

  useEffect(() => {
    if (service) {
      setFormattedService(formatService(service));
    }
  }, [service]);

  return {
    service,
    formattedService,
    metrics,
    rating,
    hasRated,
    isLoading: isLoadingService || isLoadingMetrics || isLoadingRating || isLoadingHasRated,
    refetch: refetchService,
  };
}
