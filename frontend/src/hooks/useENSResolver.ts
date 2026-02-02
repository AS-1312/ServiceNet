"use client";

import { useState } from 'react';
import { usePublicClient } from 'wagmi';
import { normalize } from 'viem/ens';
import { getEnsAddress, getEnsText } from 'viem/actions';

interface ServiceMetadata {
  endpoint?: string;
  price?: string;
  token?: string;
  chains?: string;
  category?: string;
  description?: string;
  rateLimit?: string;
  version?: string;
  docs?: string;
  uptime?: string;
}

export function useENSResolver() {
  const publicClient = usePublicClient({ chainId: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolveENSName = async (ensName: string) => {
    if (!publicClient) {
      setError('Public client not available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const normalizedName = normalize(ensName);
      
      // Resolve ENS name to address
      const address = await getEnsAddress(publicClient, {
        name: normalizedName,
      });

      if (!address) {
        setError('ENS name not found');
        setLoading(false);
        return null;
      }

      // Fetch service metadata from text records
      const metadata: ServiceMetadata = {};
      
      const textRecords = [
        'service.endpoint',
        'payment.price',
        'payment.token',
        'payment.chains',
        'service.category',
        'service.description',
        'service.rateLimit',
        'service.version',
        'service.docs',
        'service.uptime',
      ];

      for (const record of textRecords) {
        try {
          const value = await getEnsText(publicClient, {
            name: normalizedName,
            key: record,
          });
          
          if (value) {
            const key = record.split('.')[1] as keyof ServiceMetadata;
            metadata[key] = value;
          }
        } catch (err) {
          // Text record might not exist, continue
          console.log(`Text record ${record} not found`);
        }
      }

      setLoading(false);
      return {
        ensName: normalizedName,
        address,
        metadata,
      };
    } catch (err) {
      console.error('Error resolving ENS:', err);
      setError(err instanceof Error ? err.message : 'Failed to resolve ENS name');
      setLoading(false);
      return null;
    }
  };

  return {
    resolveENSName,
    loading,
    error,
  };
}
